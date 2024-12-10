//src/components/AudioUploadComponent.tsx
"use client";

import React, { useState } from "react";
import { Button } from "antd";
import AudioInput from "./AudioInput";
import { uploadAudio } from "@/lib/services/audioService";
import { convertToWav } from "@/lib/audioutils";
import toast from "react-hot-toast";
import Loader from "./Loader";
import { useRouter } from "next/navigation";

export default function AudioUpload() {
  const [audioFile, setAudioFile] = useState<File | Blob | null | any>(null);
  const [speakers, setSpeakers] = useState<number>(1);
  const [uploadStatus, setUploadStatus] = useState<string | null>(null);
  const [loading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleFileSelected = async (file: File | Blob) => {
    try {
      // Convert the file to WAV format
      const convertedFile = await convertToWav(file);

      // Determine file name: Use original file name or set a default
      const originalFileName =
        file instanceof File ? file.name : "recorded_audio";
      const fileNameWithoutExtension = originalFileName.replace(
        /\.[^/.]+$/,
        ""
      ); // Remove existing extension
      const finalFileName = `${fileNameWithoutExtension}.wav`;

      // Wrap the converted Blob into a File with the desired name
      const finalFile = new File([convertedFile], finalFileName, {
        type: "audio/wav",
      });

      // Set the processed file in state
      setAudioFile(finalFile);
    } catch (error) {
      console.error("Error converting to WAV:", error);
    }
  };

  const handleSpeakersChange = (speakers: number) => {
    setSpeakers(speakers);
  };

  const handleUpload = async () => {
    if (!audioFile) {
      setUploadStatus("No file to upload");
      return;
    }

    if (!speakers || speakers < 1) {
      toast.error("Number of speakers must be greater than or equal to 1", {
        duration: 5000,
      });
      return;
    }
    setIsLoading(true);

    try {
      // Use the audioFile as is since it's already processed and named
      const result = await uploadAudio(audioFile, speakers);
      const fetchedResult = result.data;
      if (result.status == 200) {
        router.push(`/result/${fetchedResult.recording_id}`);
      }
      else{
        setUploadStatus(`Error: ${fetchedResult.error}`);
      }
    } catch (error) {
      setUploadStatus("Error uploading file");
      console.error("Upload error:", error);
    }finally{
      setIsLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center h-full px-[2rem] py-[2rem] ">
      {loading && <Loader />}
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
              <Button
                onClick={handleUpload}
                className="w-full bg-orange-600 hover:bg-orange-700 border-none text-white-1"
              >
                Upload Audio
              </Button>
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

// const handlePostRequest = async () => {
//   try {
//     if (!countOfSpeaker || countOfSpeaker < 1) {
//       toast.error("Number of speakers must be greater than or equal to 1", {
//         duration: 5000,
//       });
//       return;
//     }
//     setIsLoading(true);
//     const result = await uploadAudio(
//       audioFileState?.originFileObj,
//       countOfSpeaker
//     );

//     const fetchedResult = result.data;

//     if (result.status == 200 && fileName != null && fileName != "") {
//       await updateRecordingName(fetchedResult.recording_id, fileName);
//     }

//     router.push(`/result/${fetchedResult.recording_id}`);
//   } catch (error) {
//     console.error("Error posting data:", error);
//     message.error("Failed to upload the audio.");
//   } finally {
//     setIsLoading(false);
//   }
// };

{
  /* <div>
          <div className="flex justify-between items-center my-[1rem] text-white-1">
            <div>Upload Audio File here</div>
          </div>
          <div className="h-[15rem] md:w-full">
            <Dragger {...props} >
              <p className="ant-upload-text text-white-1">
                Click or drag file to this area to upload
              </p>
            </Dragger>
          </div>
        </div>

        {audio && (
          <div className="mt-[3rem] text-white-1">
            <audio controls className="w-full">
              <source src={audio} type="audio/mpeg" />
              Your browser does not support the audio element.
            </audio>
          </div>
        )}

        <div className="mt-[1rem] flex flex-col space-y-4">
          <div className="flex items-center space-x-4 w-full">
            <label className="text-white-1 whitespace-nowrap">
              Enter Number of Speakers
            </label>
            <InputNumber
              className="bg-gray-600 bg-opacity-20 border-gray-300 text-white-1 placeholder-gray-300 w-[20%]"
              value={countOfSpeaker}
              onChange={(value: any) => setCountOfSpeaker(value)}
              style={{ color: "white" }} // Explicitly set the text color to white
            />
            <label className="text-white-1 whitespace-nowrap">File Name</label>
            <Input
              className="bg-gray-600 bg-opacity-20 border-gray-300 text-white-1 placeholder-gray-300 w-[80%]"
              value={fileName}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setFileName(e.target.value)
              }
              style={{ color: "white" }} // Explicitly set the text color to white
            />
          </div>

          <Button
            type="primary"
            loading={loading}
            className="bg-orange-1 w-full"
            onClick={handlePostRequest}
          >
            Upload
          </Button>
        </div> */
}

// const props = {
//   name: "file",
//   accept: "audio/*",
//   action: undefined, // Disable automatic upload
//   beforeUpload: (file: any) => {
//     const isAudio = file.type.startsWith("audio/");
//     if (!isAudio) {
//       message.error("You can only upload audio files!");
//       return false; // Prevent the file from being uploaded
//     }
//     return true; // Allow upload if it's an audio file
//   },
//   onChange(info: any) {
//     const { status, originFileObj } = info.file;
//     if (status !== "uploading" && originFileObj) {
//       setAudioFileState(info.file);
//       const fileUrl = URL.createObjectURL(originFileObj);
//       setAudio(fileUrl);
//     }
//   },
// };

// React.useEffect(() => {
//   return () => {
//     if (audio) {
//       URL.revokeObjectURL(audio);
//     }
//   };
// }, [audio]);

//       const [fileName, setFileName] = React.useState<string>();
// const [countOfSpeaker, setCountOfSpeaker] = React.useState<number>();
// const [audioFileState, setAudioFileState] = React.useState<any>();
// const [audio, setAudio] = React.useState<any>();
// const [loading, setIsLoading] = React.useState(false);
// const router = useRouter(); // Use the router for navigation

// import { InputNumber } from "antd";
// import { updateRecordingName, uploadAudio } from "@/lib/services/audioService"; // Import the service
// import { useAudio } from "@/context/AudioContext"; // Import your context hook
// import { useRouter } from "next/navigation"; // Import useRouter for navigation
// import toast from "react-hot-toast";

// const { Dragger } = Upload;
