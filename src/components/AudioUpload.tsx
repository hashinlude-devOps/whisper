//src/components/AudioUploadComponent.tsx
"use client";

import React, { useEffect, useState } from "react";
import { Button } from "antd";
import AudioInput from "./AudioInput";
import {
  getRecordingUploadStatus,
  uploadAudio,
} from "@/lib/services/audioService";
import { convertToAac } from "@/lib/audioutils";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import ProgressBar from "@/components/ui/progressbar";
import { useSidebar } from "@/context/ContextProvider";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FFmpeg } from "@ffmpeg/ffmpeg";
import { toBlobURL, fetchFile } from "@ffmpeg/util";

export default function AudioUpload() {
  const [audioFile, setAudioFile] = useState<File | Blob | null | any>(null);
  const [speakers, setSpeakers] = useState<string>("");
  const [processStatus, setprocessStatus] = useState<string | null>(null);
  const [errorStatus, seterrorStatus] = useState<string | null>(null);
  const [loading, setIsLoading] = useState(false);
  const { refreshHistory, resetKey } = useSidebar();

  const router = useRouter();
  const [currentStep, setCurrentStep] = React.useState(0);
  const [isProgressVisible, setIsProgressVisible] = useState(false);
  const [isButtonVisible, setIsButtonVisible] = useState(false);
  const [ffmpeg, setFFmpeg] = useState<FFmpeg | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    const ffmpeg = new FFmpeg();
    setFFmpeg(ffmpeg);

    try {
      // Load ffmpeg.wasm-core script
      const baseURL = "https://unpkg.com/@ffmpeg/core@0.12.4/dist/umd";
      await ffmpeg.load({
        coreURL: await toBlobURL(
          `${baseURL}/ffmpeg-core.js`,
          "text/javascript"
        ),
        wasmURL: await toBlobURL(
          `${baseURL}/ffmpeg-core.wasm`,
          "application/wasm"
        ),
      });
      setIsReady(true);
      setMessage("FFmpeg is ready!");
    } catch (error) {
      // setMessage('Failed to load FFmpeg: ' + error.message);
    }
  };

  const handleFileSelected = async (file: File | Blob) => {
    try {
      setIsButtonVisible(false);
      setAudioFile(null);
      seterrorStatus(null);
      setprocessStatus("Compressing selected audio file");

      if (!ffmpeg || !isReady) {
        setprocessStatus(null);
        seterrorStatus("FFmpeg is not initialized or ready.");
        toast.error("FFmpeg is not ready. Please try again later.", {
          duration: 5000,
        });
        setIsButtonVisible(true);
        return;
      }

      const fileBuffer = await fetchFile(file);
      if (!fileBuffer) {
        throw new Error("Unable to process the input file.");
      }

      await ffmpeg.writeFile("input.mp4", fileBuffer);

      await ffmpeg.exec([
        "-i",
        "input.mp4",
        "-vn", // Disable video
        "-c:a",
        "aac",
        "-ac",
        "1",
        "-ar",
        "16000",
        "-b:a",
        "16k",
        "-movflags",
        "+faststart",
        "output.aac",
      ]);

      // Retrieve the output file
      const data = await ffmpeg.readFile("output.aac"); // Returns Uint8Array

      // Wrap the Uint8Array in a Blob
      const convertedBlob = new Blob([data], { type: "audio/aac" });

      // Generate the final file
      const originalFileName =
        file instanceof File ? file.name : "recorded_audio";
      const fileNameWithoutExtension = originalFileName.replace(
        /\.[^/.]+$/,
        ""
      );
      const finalFileName = `${fileNameWithoutExtension}.aac`;
      const finalFile = new File([convertedBlob], finalFileName, {
        type: "audio/aac",
      });

      // Update states
      setAudioFile(finalFile);
      setIsButtonVisible(true);
      seterrorStatus(null);
      setprocessStatus(null);
      toast.success("File successfully compressed.", { duration: 5000 });
    } catch (error) {
      // console.error("Error during file processing:", error);
      toast.error("Error converting to AAC: " + (error as Error).message, {
        duration: 5000,
      });
      setIsButtonVisible(true);
      setprocessStatus(null);
      seterrorStatus("Error during conversion.");
    }
  };

  useEffect(() => {
    setAudioFile(null);
    setSpeakers("");
    setIsButtonVisible(false);
    setprocessStatus(null);
    seterrorStatus(null);
    setIsProgressVisible(false);
  }, [resetKey]);

  const handleSpeakersChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value.trim();
    if (value === "" || /^[1-9]\d*$/.test(value)) {
      setSpeakers(value);
      seterrorStatus(null);
    } else {
      setprocessStatus(null);
      seterrorStatus("Please enter a valid whole number greater than 0.");
    }
  };

  const handleUpload = async () => {
    if (!audioFile) {
      setprocessStatus(null);
      seterrorStatus("No file to upload");
      toast.error("No file to upload", { duration: 5000 });
      return;
    }

    if (!speakers || parseInt(speakers, 10) < 1) {
      setprocessStatus(null);
      seterrorStatus("Number of speakers must be greater than or equal to 1");
      toast.error("Number of speakers must be greater than or equal to 1", {
        duration: 5000,
      });
      return;
    }

    setIsProgressVisible(true);
    setIsButtonVisible(false);
    setIsLoading(true);
    seterrorStatus(null);
    setprocessStatus("Please wait, Uploading");
    setCurrentStep(1);

    try {
      const result = await uploadAudio(audioFile, parseInt(speakers, 10));
      const fetchedResult = result.data;

      if (result.status === 202) {
        toast.success("File successfully uploaded.", {
          duration: 5000,
        });
        refreshHistory();
        setCurrentStep(2);
        seterrorStatus(null);
        setprocessStatus(
          "You can continue with other tasks. Your audio is being processed in the background."
        );
        const statusResponse = await getRecordingUploadStatus(
          fetchedResult.recording_id
        );

        if (statusResponse.status === 200) {
          const recordingStatus =
            statusResponse.data.recording_status.toLowerCase();

          if (recordingStatus === "completed") {
            setCurrentStep(3);
            toast.success(`Processing completed.`, {
              duration: 5000,
            });
            router.push(`/result/${statusResponse.data.recording_id}`);
            refreshHistory();
            setIsProgressVisible(false);
            setIsButtonVisible(true);
            setIsLoading(false);
          } else if (recordingStatus === "failed") {
            setprocessStatus(null);
            seterrorStatus("Upload failed. Please reupload the file.");
            setCurrentStep(0);
            refreshHistory();
            setIsProgressVisible(false);
            setIsButtonVisible(true);
            setIsLoading(false);
          } else if (recordingStatus === "pending") {
            setCurrentStep(2);
            refreshHistory();
            const checkStatusInterval = setInterval(async () => {
              const retryStatusResponse = await getRecordingUploadStatus(
                fetchedResult.recording_id
              );
              if (retryStatusResponse.status === 200) {
                const retryRecordingStatus =
                  retryStatusResponse.data.recording_status.toLowerCase();

                if (retryRecordingStatus === "completed") {
                  toast.success(`Processing completed.`, {
                    duration: 5000,
                  });
                  clearInterval(checkStatusInterval);
                  setCurrentStep(3);
                  router.push(
                    `/result/${retryStatusResponse.data.recording_id}`
                  );
                  refreshHistory();
                  setIsProgressVisible(false);
                  setIsButtonVisible(true);
                  setIsLoading(false);
                } else if (retryRecordingStatus === "failed") {
                  clearInterval(checkStatusInterval);
                  setprocessStatus(null);
                  seterrorStatus("Upload failed. Please reupload the file.");
                  setCurrentStep(0);
                  refreshHistory();
                  setIsProgressVisible(false);
                  setIsButtonVisible(true);
                  setIsLoading(false);
                }
              }
            }, 10000);
          }
        } else {
          setprocessStatus(null);
          seterrorStatus(`Error fetching status: ${statusResponse.status}`);
          refreshHistory();
          setIsProgressVisible(false);
          setIsButtonVisible(true);
          setIsLoading(false);
        }
      } else {
        setprocessStatus(null);
        seterrorStatus(`Error: ${fetchedResult.error}`);
        refreshHistory();
        setIsProgressVisible(false);
        setIsButtonVisible(true);
        setIsLoading(false);
      }
    } catch (error) {
      setprocessStatus(null);
      seterrorStatus("Error uploading file");
      toast.error("Error uploading file", { duration: 5000 });
      refreshHistory();
      setIsProgressVisible(false);
      setIsButtonVisible(true);
      setIsLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center h-full px-[2rem] py-[2rem] ">
      {/* {loading && <Loader />} */}
      <div className="flex flex-col justify-center w-full md:w-3/4 lg:w-1/2">
        <div className="min-h-screen flex items-center justify-center bg-black">
          <div className="container p-4 max-w-md  rounded-lg shadow-lg">
            <h1 className="text-2xl font-bold mb-4 text-white-1">
              Audio Recorder and Uploader
            </h1>
            <div className="space-y-4">
              <AudioInput onFileSelected={handleFileSelected} />
              {audioFile && (
                <>
                  <div>
                    <Label htmlFor="speakers" className="text-white-1">
                      Number of Speakers
                    </Label>
                    <Input
                      id="speakers"
                      type="number"
                      min="1"
                      value={speakers}
                      onChange={handleSpeakersChange}
                      className="mt-1 bg-black-1 text-white border-gray-700 text-white-1 focus:ring-gray-600"
                      placeholder="Enter number of speakers"
                    />
                  </div>

                  {isButtonVisible && (
                    <Button
                      onClick={handleUpload}
                      className="w-full bg-blue-600 hover:bg-blue-700 border-none text-white-1"
                    >
                      Upload Audio
                    </Button>
                  )}
                </>
              )}
              {isProgressVisible && (
                <div className="flex items-center justify-between w-full">
                  <ProgressBar currentStep={currentStep} />
                </div>
              )}
              {processStatus && (
                <p className="mt-4 text-sm text-gray-300">
                  {processStatus}
                  <span className="dot-animate">...</span>
                </p>
              )}
              {errorStatus && (
                <p className="mt-4 text-sm text-red-500">{errorStatus}</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
