//src/components/AudioUploadComponent.tsx
"use client";

import React from "react";
import { message, Upload, Button, Input } from "antd";
import { InputNumber } from "antd";
import { updateRecordingName, uploadAudio } from "@/lib/services/audioService"; // Import the service
import { useRouter } from "next/navigation"; // Import useRouter for navigation
import toast from "react-hot-toast";
import { useSidebar } from "@/context/SidebarProvider";

const { Dragger } = Upload;

export default function AudioUpload() {
  const [countOfSpeaker, setCountOfSpeaker] = React.useState<number>();
  const [fileName, setFileName] = React.useState<string>();
  const [audioFileState, setAudioFileState] = React.useState<any>();
  const [audio, setAudio] = React.useState<any>();
  const [loading, setIsLoading] = React.useState(false);
  const router = useRouter(); // Use the router for navigation
  const { isMenuOpen, setIsMenuOpen } = useSidebar();

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
      if (!countOfSpeaker || countOfSpeaker < 1) {
        toast.error("Number of speakers must be greater than or equal to 1", {
          duration: 5000,
        });
        return;
      }
      setIsLoading(true);
      const result = await uploadAudio(
        audioFileState?.originFileObj,
        countOfSpeaker
      );

      const fetchedResult = result.data;

      if (result.status == 200 && fileName != null && fileName != "") {
        await updateRecordingName(fetchedResult.recording_id, fileName);
      }

      setIsMenuOpen(false);
      router.push(`/result/${fetchedResult.recording_id}`);
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

        <div className="mt-4 space-y-4">
          <div className="flex flex-col sm:flex-row sm:space-x-4 space-y-4 sm:space-y-0">
            {/* Number of Speakers Input */}
            <div className="flex-1 flex flex-col">
              <label className="text-gray-700 font-medium mb-1">
                Enter Number of Speakers
              </label>
              <InputNumber
                className="w-full"
                value={countOfSpeaker}
                onChange={(value: any) => setCountOfSpeaker(value)}
              />
            </div>

            {/* File Name Input */}
            <div className="flex-1 flex flex-col">
              <label className="text-gray-700 font-medium mb-1">
                File Name
              </label>
              <Input
                className="w-full"
                value={fileName}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setFileName(e.target.value)
                }
              />
            </div>
          </div>

          {/* Upload Button */}
          <Button
            type="primary"
            loading={loading}
            className="bg-gray-800 w-full sm:w-auto sm:self-center"
            onClick={handlePostRequest}
          >
            Upload
          </Button>
        </div>
      </div>
    </div>
  );
}
