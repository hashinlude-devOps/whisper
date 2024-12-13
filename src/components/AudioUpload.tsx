//src/components/AudioUploadComponent.tsx
"use client";

import React, { useState } from "react";
import { Button } from "antd";
import AudioInput from "./AudioInput";
import {
  getRecordingUploadStatus,
  uploadAudio,
} from "@/lib/services/audioService";
import { convertToWav } from "@/lib/audioutils";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import ProgressBar from "@/components/ui/progressbar";
import { useSidebar } from "@/context/SidebarProvider";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function AudioUpload() {
  const [audioFile, setAudioFile] = useState<File | Blob | null | any>(null);
  const [speakers, setSpeakers] = useState<string>("");
  const [processStatus, setprocessStatus] = useState<string | null>(null);
  const [errorStatus, seterrorStatus] = useState<string | null>(null);
  const [loading, setIsLoading] = useState(false);
  const { refreshHistory } = useSidebar();

  const router = useRouter();
  const [currentStep, setCurrentStep] = React.useState(0);
  const [isProgressVisible, setIsProgressVisible] = useState(false);
  const [isButtonVisible, setIsButtonVisible] = useState(false);

  const handleFileSelected = async (file: File | Blob) => {
    try {
      setIsButtonVisible(false);
      setAudioFile(null);
      setprocessStatus("Compressing selected audio file");
      const convertedFile = await convertToWav(file);

      const originalFileName =
        file instanceof File ? file.name : "recorded_audio";
      const fileNameWithoutExtension = originalFileName.replace(
        /\.[^/.]+$/,
        ""
      );
      const finalFileName = `${fileNameWithoutExtension}.wav`;
      console.log("coverted");
      const finalFile = new File([convertedFile], finalFileName, {
        type: "audio/wav",
      });
      setAudioFile(finalFile);
      setIsButtonVisible(true);
      setprocessStatus(null);
      toast.success(
        "File successfully compressed.",
        {
          duration: 5000,
        }
      );
    } catch (error) {
      console.error("Error converting to WAV:", error);
      setIsButtonVisible(true);
      seterrorStatus("Error during conversion.");
    }
  };

  const handleSpeakersChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value.trim();

    // Allow only positive whole numbers or an empty field
    if (value === "" || /^[1-9]\d*$/.test(value)) {
      setSpeakers(value);
      seterrorStatus(null); // Clear any previous error message
    } else {
      seterrorStatus("Please enter a valid whole number greater than 0.");
    }
  };

  const handleUpload = async () => {
    if (!audioFile) {
      console.log("no file");
      seterrorStatus("No file to upload");
      toast.error("No file to upload", { duration: 5000 });
      return;
    }

    if (!speakers || parseInt(speakers, 10) < 1) {
      seterrorStatus("Number of speakers must be greater than or equal to 1");
      toast.error("Number of speakers must be greater than or equal to 1", {
        duration: 5000,
      });
      return;
    }

    setIsProgressVisible(true);
    setIsButtonVisible(false);
    setIsLoading(true);
    setprocessStatus("Please wait, Uploading");
    setCurrentStep(1);

    try {
      const result = await uploadAudio(audioFile, parseInt(speakers, 10));
      const fetchedResult = result.data;

      if (result.status === 202) {
        refreshHistory();
        setCurrentStep(2);
        setprocessStatus(
          "Your audio is being processed, This may take a while"
        );
        const statusResponse = await getRecordingUploadStatus(
          fetchedResult.recording_id
        );

        if (statusResponse.status === 200) {
          const recordingStatus =
            statusResponse.data.recording_status.toLowerCase();

          if (recordingStatus === "completed") {
            setCurrentStep(3);

            router.push(`/result/${statusResponse.data.recording_id}`);
            refreshHistory();
            setIsProgressVisible(false);
            setIsButtonVisible(true);
            setIsLoading(false);
          } else if (recordingStatus === "failed") {
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
          seterrorStatus(`Error fetching status: ${statusResponse.status}`);
          refreshHistory();
          setIsProgressVisible(false);
          setIsButtonVisible(true);
          setIsLoading(false);
        }
      } else {
        seterrorStatus(`Error: ${fetchedResult.error}`);
        refreshHistory();
        setIsProgressVisible(false);
        setIsButtonVisible(true);
        setIsLoading(false);
      }
    } catch (error) {
      seterrorStatus("Error uploading file");
      console.error("Upload error:", error);
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
