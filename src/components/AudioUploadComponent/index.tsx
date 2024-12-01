"use client";

import React from "react";
import { message, Upload, Button } from "antd";
import axios from "axios";
import { InputNumber } from "antd";

const { Dragger } = Upload;

export default function AudioUploadComponent({
  setAudioUploadFetched,
  setIsLoading,
  isLoading,
}: any) {
  const [countOfSpeaker, setCountOfSpeaker] = React.useState<number>();
  const [audioFileState, setAudioFileState] = React.useState<any>();
  const [audio, setAudio] = React.useState<string | undefined>();
  const [isUploaded, setIsUploaded] = React.useState<boolean>(false);

  const props = {
    name: "file",
    accept: "audio/*",
    onChange(info: any) {
      const { status, originFileObj } = info.file;
      if (status !== "uploading" && originFileObj) {
        setAudioFileState(info.file);
        const fileUrl = URL.createObjectURL(originFileObj);
        setAudio(fileUrl);
        setIsUploaded(false); // Reset the uploaded state
      }
    },
  };

  const handlePostRequest = async () => {
    if (!audioFileState) {
      message.error("Please upload an audio file first.");
      return;
    }

    const formData = new FormData();
    formData.append("audio", audioFileState?.originFileObj);
    formData.append("num_speakers", countOfSpeaker?.toString() || "0");

    try {
      setIsLoading(true);
      const result = await axios.post(
        "http://192.168.0.178:5000/upload-audio",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmcmVzaCI6ZmFsc2UsImlhdCI6MTczMjM1MDE5NiwianRpIjoiZjk4MDg4YzAtNmVmYy00OGNjLWFhZGUtZTM4NTQ2ZTkwNDc4IiwidHlwZSI6ImFjY2VzcyIsInN1YiI6InJydDJAdGVzdC5jb20iLCJuYmYiOjE3MzIzNTAxOTYsImNzcmYiOiI2ODg3MmI2YS1iM2I0LTQwZTctYTFlNi1iM2Q1NjRlMjFjNDgiLCJleHAiOjE3MzIzNTEwOTZ9.n1EgbHVVtr6bZQRvpYIn6jmDVQq9UxNw_nnB5LLi9YQ`,
          },
        }
      );
      setAudioUploadFetched(result?.data);
      setIsUploaded(true); // Set upload success
    } catch (error) {
      console.error("Error posting data:", error);
      message.error("Upload failed. Please try again.");
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
    <div className="flex justify-center items-center h-full">
      <div>
        {!isUploaded ? (
          <>
            <div className="flex justify-between items-center my-[1rem]">
              <div>Upload Audio File here</div>
              <div>
                <Button
                  type="primary"
                  loading={isLoading}
                  className="bg-black"
                  onClick={handlePostRequest}
                >
                  Upload
                </Button>
              </div>
            </div>
            <div className="h-[30rem] md:w-[30rem]">
              <Dragger {...props}>
                <p className="ant-upload-drag-icon">
                  {/* <InboxOutlined /> */}
                </p>
                <p className="ant-upload-text">
                  Click or drag file to this area to upload
                </p>
                <p className="ant-upload-hint">
                  Support for a single or bulk upload. Strictly prohibited from
                  uploading company data or other banned files.
                </p>
              </Dragger>
            </div>
            <div className="mt-[1rem]">
              <div>No. of speakers</div>
              <div className="mt-[0.5rem]">
                <InputNumber
                  className="w-[15rem]"
                  value={countOfSpeaker}
                  onChange={(value: number | null) =>
                    setCountOfSpeaker(value || undefined)
                  }
                />
              </div>
            </div>
          </>
        ) : (
          <div className="flex justify-center items-center mt-[3rem]">
            {audio ? (
              <audio
                controls
                style={{
                  width: 350,
                }}
              >
                <source src={audio} type="audio/mpeg" />
                Your browser does not support the audio element.
              </audio>
            ) : (
              <p>No audio available to play.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
