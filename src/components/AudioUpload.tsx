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

export default function AudioUpload() {
  const [audioFile, setAudioFile] = useState<File | Blob | null | any>(null);
  const [speakers, setSpeakers] = useState<number>(1);
  const [uploadStatus, setUploadStatus] = useState<string | null>(null);
  const [loading, setIsLoading] = useState(false);
  const router = useRouter();
  const [currentStep, setCurrentStep] = React.useState(0);
  const [isProgressVisible, setIsProgressVisible] = useState(false);
  const [isButtonVisible, setIsButtonVisible] = useState(true);

  const handleFileSelected = async (file: File | Blob) => {
    try {
      setIsProgressVisible(true);
      setIsButtonVisible(false);
      setUploadStatus("Converting file...");
      setCurrentStep(1);
      setCurrentStep(2);
      const convertedFile = await convertToWav(file);

      const originalFileName =
        file instanceof File ? file.name : "recorded_audio";
      const fileNameWithoutExtension = originalFileName.replace(
        /\.[^/.]+$/,
        ""
      );
      setCurrentStep(3);
      const finalFileName = `${fileNameWithoutExtension}.wav`;
      console.log("coverted");
      const finalFile = new File([convertedFile], finalFileName, {
        type: "audio/wav",
      });
      setCurrentStep(4);
      setAudioFile(finalFile);
      setIsProgressVisible(false);
      setIsButtonVisible(true);
      setUploadStatus("File ready for upload!");
      setCurrentStep(0);
    } catch (error) {
      console.error("Error converting to WAV:", error);
      setIsProgressVisible(false);
      setIsButtonVisible(true);
      setUploadStatus("Error during conversion.");
      setCurrentStep(0);
    }
  };

  const handleSpeakersChange = (speakers: number) => {
    setSpeakers(speakers);
  };

  const handleUpload = async () => {
    if (!audioFile) {
      console.log("no file");
      setUploadStatus("No file to upload");
      toast.error("No file to upload", { duration: 5000 });
      return;
    }

    if (!speakers || speakers < 1) {
      setUploadStatus("Number of speakers must be greater than or equal to 1");
      toast.error("Number of speakers must be greater than or equal to 1", {
        duration: 5000,
      });
      return;
    }

    // Show progress bar and hide button when the upload starts
    setIsProgressVisible(true);
    setIsButtonVisible(false);
    setIsLoading(true);
    setUploadStatus("Uploading...");
    setCurrentStep(1);

    try {
      const result = await uploadAudio(audioFile, speakers);
      const fetchedResult = result.data;

      if (result.status === 202) {
        setCurrentStep(2);
        setUploadStatus(
          "Uploaded, Your audio is being processed, This may take a while."
        );
        const statusResponse = await getRecordingUploadStatus(
          fetchedResult.recording_id
        );

        if (statusResponse.status === 200) {
          const recordingStatus =
            statusResponse.data.recording_status.toLowerCase();

          if (recordingStatus === "completed") {
            setCurrentStep(4);
            router.push(`/result/${statusResponse.data.recording_id}`);
            // Hide progress bar and show button after process is complete
            setIsProgressVisible(false);
            setIsButtonVisible(true);
            setIsLoading(false);
          } else if (recordingStatus === "failed") {
            setUploadStatus("Upload failed. Please reupload the file.");
            setCurrentStep(0);
            // Hide progress bar and show button after process is complete
            setIsProgressVisible(false);
            setIsButtonVisible(true);
            setIsLoading(false);
          } else if (recordingStatus === "pending") {
            setCurrentStep(3);

            const checkStatusInterval = setInterval(async () => {
              const retryStatusResponse = await getRecordingUploadStatus(
                fetchedResult.recording_id
              );
              if (retryStatusResponse.status === 200) {
                const retryRecordingStatus =
                  retryStatusResponse.data.recording_status.toLowerCase();

                if (retryRecordingStatus === "completed") {
                  clearInterval(checkStatusInterval);
                  setCurrentStep(4);
                  router.push(
                    `/result/${retryStatusResponse.data.recording_id}`
                  );
                  // Hide progress bar and show button after process is complete
                  setIsProgressVisible(false);
                  setIsButtonVisible(true);
                  setIsLoading(false);
                } else if (retryRecordingStatus === "failed") {
                  clearInterval(checkStatusInterval);
                  setUploadStatus("Upload failed. Please reupload the file.");
                  setCurrentStep(0);
                  // Hide progress bar and show button after process is complete
                  setIsProgressVisible(false);
                  setIsButtonVisible(true);
                  setIsLoading(false);
                }
              }
            }, 15000); // Poll every 2 seconds
          }
        } else {
          setUploadStatus(`Error fetching status: ${statusResponse.status}`);
          // Hide progress bar and show button after process is complete
          setIsProgressVisible(false);
          setIsButtonVisible(true);
          setIsLoading(false);
        }
      } else {
        setUploadStatus(`Error: ${fetchedResult.error}`);
        // Hide progress bar and show button after process is complete
        setIsProgressVisible(false);
        setIsButtonVisible(true);
        setIsLoading(false);
      }
    } catch (error) {
      setUploadStatus("Error uploading file");
      console.error("Upload error:", error);
      // Hide progress bar and show button after process is complete
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
              <AudioInput
                onFileSelected={handleFileSelected}
                onSpeakersChange={handleSpeakersChange}
              />
              {isProgressVisible && (
                <div className="flex items-center justify-between w-full">
                  <ProgressBar currentStep={currentStep} />
                </div>
              )}
              {isButtonVisible && (
                <Button
                  onClick={handleUpload}
                  className="w-full bg-blue-600 hover:bg-blue-700 border-none text-white-1"
                >
                  Upload Audio
                </Button>
              )}
              {uploadStatus && (
                <p className="mt-4 text-sm text-gray-300">{uploadStatus}</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

