"use client";

import React, { useRef } from "react";

import type { UploadProps } from "antd";
import { message, Upload } from "antd";

import { InputNumber } from "antd";

const { Dragger } = Upload;

export default function AudioUploadComponent() {
  const audioRef = useRef(null);

  const [countOfSpeaker, setCountOfSpeaker] = React.useState<number>(0);

  console.log(countOfSpeaker);

  const props: UploadProps = {
    name: "file",
    multiple: true,
    action: "https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload",
    onChange(info) {
      const { status } = info.file;
      if (status !== "uploading") {
        console.log(info.file, info.fileList);
      }
      if (status === "done") {
        message.success(`${info.file.name} file uploaded successfully.`);
      } else if (status === "error") {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
    onDrop(e) {
      console.log("Dropped files", e.dataTransfer.files);
    },
  };

  return (
    <div className="flex justify-center items-center h-full">
      <div>
        <div className="mb-[2rem]">Upload Audio File here</div>
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

        <div className="flex justify-center items-center mt-[1rem] ">
          <audio
            controls
            style={{
              width: 350,
            }}
          >
            <source src="/audio/sample-audio.mp3" type="audio/mpeg" />
            Your browser does not support the audio element.
          </audio>
        </div>

        <div className="mt-[1rem]">
          <div>No. of speaker</div>
          <div className="mt-[0.5rem]">
            <InputNumber
              className="w-[15rem] "
              value={countOfSpeaker}
              onChange={(e: any) => setCountOfSpeaker(e?.target?.value)}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
