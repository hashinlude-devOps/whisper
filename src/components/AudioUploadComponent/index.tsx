"use client";

import React from "react";
import { message, Upload, Button } from "antd";
import axios from "axios";

import { InputNumber } from "antd";

const { Dragger } = Upload;

export default function AudioUploadComponent({ setAudioUploadFetched }: any) {
  const [countOfSpeaker, setCountOfSpeaker] = React.useState<number>();
  const [audioFileState, setAudioFileState] = React.useState<any>();
  const [audio, setAudio] = React.useState<any>();
  const [isLoading, setIsLoading] = React.useState<boolean>(false);

  const props = {
    name: "file",
    accept: "audio/*",
    beforeUpload(file: any) {
      const isAllowedSize = file.size / 1024 / 1024 < 10; // 10 MB limit
      if (!isAllowedSize) {
        message.error("File must be smaller than 10MB!");
      }
      return isAllowedSize;
    },
    onChange(info: any) {
      const { status, originFileObj } = info.file;
      if (status !== "uploading" && originFileObj) {
        setAudioFileState(info.file);
        // Ensure originFileObj is defined before creating a URL
        const fileUrl = URL.createObjectURL(originFileObj);
        setAudio(fileUrl);
      }
      // if (status === "done") {
      //   message?.success(`${info.file.name} file uploaded successfully.`);
      // } else if (status === "error") {
      //   message?.error(`${info.file.name} file upload failed.`);
      // }
    },
  };

  const handlePostRequest = async () => {
    const formData = new FormData();
    formData.append("audio", audioFileState?.originFileObj); // Pass the raw file object
    formData.append("num_speakers", countOfSpeaker?.toString() || "0");

    try {
      setIsLoading(true);
      const result = await axios.post(
        "http://192.168.70.112:5000/upload-audio",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setAudioUploadFetched(result?.data);
    } catch (error) {
      console.error("Error posting data:", error);
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
        <div className="flex justify-between items-center my-[1rem]">
          <div className="">Upload Audio File here</div>
          <div>
            <Button
              type="primary"
              loading={isLoading}
              className="bg-black"
              onClick={() => handlePostRequest()}
            >
              Upload
            </Button>
          </div>
        </div>
        <div className="h-[30rem] md:w-[30rem]">
          <Dragger {...props}>
            <p className="ant-upload-drag-icon">{/* <InboxOutlined /> */}</p>
            <p className="ant-upload-text">
              Click or drag file to this area to upload
            </p>
            <p className="ant-upload-hint">
              Support for a single or bulk upload. Strictly prohibited from
              uploading company data or other banned files.
            </p>
          </Dragger>
        </div>

        <div className="flex justify-center items-center mt-[3rem] ">
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
            <p>Please upload an audio file to preview.</p>
          )}
        </div>

        <div className="mt-[1rem]">
          <div>No. of speaker</div>
          <div className="mt-[0.5rem]">
            <InputNumber
              className="w-[15rem] "
              value={countOfSpeaker}
              onChange={(value: any) => setCountOfSpeaker(value)}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
