//src/components/AudioUploadComponent.tsx
"use client";

import React from "react";
import { message, Upload, Button } from "antd";
import { InputNumber } from "antd";
import { uploadAudio } from "@/lib/services/audioService"; // Import the service
import { useAudio } from "@/context/AudioContext"; // Import your context hook
import { useRouter } from "next/navigation"; // Import useRouter for navigation

const { Dragger } = Upload;

export default function AudioUpload() {
  const { setAudioResult } = useAudio(); // Use the global context to update audio result
  const [countOfSpeaker, setCountOfSpeaker] = React.useState<number>();
  const [audioFileState, setAudioFileState] = React.useState<any>();
  const [audio, setAudio] = React.useState<any>();
  const [loading, setIsLoading] = React.useState(false);
  const router = useRouter(); // Use the router for navigation

  const props = {
    name: "file",
    accept: "audio/*",
    action: undefined, // Disable automatic upload
    beforeUpload: (file: any) => {
      const isAudio = file.type.startsWith("audio/");
      if (!isAudio) {
        message.error("You can only upload audio files!");
        return false; // Prevent the file from being uploaded
      }
      return true; // Allow upload if it's an audio file
    },
    onChange(info: any) {
      const { status, originFileObj } = info.file;
      if (status !== "uploading" && originFileObj) {
        setAudioFileState(info.file);
        const fileUrl = URL.createObjectURL(originFileObj);
        setAudio(fileUrl);
      }
    },
  };

  const handlePostRequest = async () => {
    try {
      setIsLoading(true);
      const result = await uploadAudio(
        audioFileState?.originFileObj,
        countOfSpeaker
      );
      const fetchedResult = result.data;
      console.log(fetchedResult);
      setAudioResult(fetchedResult);
      router.push("/result");
    } catch (error) {
      console.error("Error posting data:", error);
      message.error("Failed to upload the audio.");
    } finally {
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    return () => {
      if (audio) {
        URL.revokeObjectURL(audio);
      }
    };
  }, [audio]);

  return (
    <div className="flex justify-center items-center h-full px-[2rem] py-[2rem]">
      <div className="flex flex-col justify-center w-full md:w-3/4 lg:w-1/2">
        <div>
          <div className="flex justify-between items-center my-[1rem]">
            <div>Upload Audio File here</div>
          </div>
          <div className="h-[15rem] md:w-full">
            <Dragger {...props}>
              <p className="ant-upload-text">
                Click or drag file to this area to upload
              </p>
            </Dragger>
          </div>
        </div>

        {audio && (
          <div className="mt-[3rem]">
            <audio controls className="w-full">
              <source src={audio} type="audio/mpeg" />
              Your browser does not support the audio element.
            </audio>
          </div>
        )}

        <div className="mt-[1rem] flex flex-col space-y-4">
          <div>
            <label>Enter Number of Speakers</label>
            <InputNumber
              className="w-full"
              value={countOfSpeaker}
              onChange={(value: any) => setCountOfSpeaker(value)}
            />
          </div>
          <Button
            type="primary"
            loading={loading}
            className="bg-gray-800 w-full"
            onClick={handlePostRequest}
          >
            Upload
          </Button>
        </div>
      </div>
    </div>
  );
}
