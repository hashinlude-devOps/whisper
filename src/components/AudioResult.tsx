"use client";
import React, { useEffect, useState, useRef } from "react";
import { getFullAudio } from "@/lib/services/audiofetchService";
import { PencilSquareIcon } from "@heroicons/react/24/outline";
import CustomAudioPlayer from "./CustomAudioPlayer";
import Loader from "@/components/Loader";
import {
  getTranscription,
  updateRecordingName,
  updateSpeakerNames,
} from "@/lib/services/audioService";
import CalendarIcon from "@heroicons/react/20/solid/CalendarIcon";
import ClockIcon from "@heroicons/react/20/solid/ClockIcon";
import { useRouter } from "next/navigation";
import { Button, Input, message, Modal } from "antd";

const AudioResultComponent = ({ id }: { id: number }) => {
  const [noOfSpeakers, setNoOfSpeakers] = React.useState<any>();
  const [speakerValue, setSpeakerValue] = React.useState([{}]);
  const [isLoading, setIsLoading] = React.useState(false);

  const [isFileNameEdit, setIsFileNameEdit] = useState<boolean>(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [loadingAudio, setLoadingAudio] = useState(true);
  const [currentAudioTime, setCurrentAudioTime] = useState(0);
  const [showTranslation, setShowTranslation] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [timestamp, setTimestamp] = useState<any>(null);
  const [isPlaying, setIsPlaying] = useState(false);


  const hasFetchedAudio = useRef(false);
  const router = useRouter();

  const formatTime = (ms: number) => {
    const date = new Date(ms * 1000);
    const hours = date.getUTCHours().toString().padStart(2, "0");
    const minutes = date.getUTCMinutes().toString().padStart(2, "0");
    const seconds = date.getUTCSeconds().toString().padStart(2, "0");

    return `${hours}:${minutes}:${seconds}`;
  };

  const convertTimestamp = (timestamp: string): string => {
    const year = parseInt(timestamp.slice(0, 4), 10);
    const month = parseInt(timestamp.slice(4, 6), 10) - 1; // Months are zero-indexed
    const day = parseInt(timestamp.slice(6, 8), 10);
    const hour = parseInt(timestamp.slice(8, 10), 10);
    const minute = parseInt(timestamp.slice(10, 12), 10);
    const second = parseInt(timestamp.slice(12, 14), 10);

    const date = new Date(year, month, day, hour, minute, second);

    // Format to DD/MM/YYYY, HH:MM:SS
    const formattedDate = date.toLocaleString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    });

    return formattedDate;
  };

  const fetchAudioData = async () => {
    if (hasFetchedAudio.current) return;

    setLoadingAudio(true);
    try {
      const url = await getFullAudio(id.toString());
      setAudioUrl(url);
      hasFetchedAudio.current = true;

      const response = await getTranscription(id.toString());

      const fetchedResult = response.data?.result;

      if (fetchedResult) {
        setResult(fetchedResult);
        setTimestamp(convertTimestamp(fetchedResult?.timestamp));
      } else {
        message.error("No results found for this transcription.");
      }
    } catch (error) {
      console.error("Error fetching full audio:", error);
    } finally {
      setLoadingAudio(false);
    }
  };

  React.useEffect(() => {
    fetchAudioData();
  }, []);

  React.useEffect(() => {
    setNoOfSpeakers(result?.speaker_list);
  }, [result]);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const handleAudioSeek = (startTime: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = startTime; 
      audioRef.current.play(); 
      setIsPlaying(true);   
    }
  };

  const toggleTranslation = () => {
    setShowTranslation(!showTranslation); // Toggle translation visibility
  };

  

  const handleSpeakerEdit = () => {
    setIsLoading(true);
    updateSpeakerNames(result?.json_file, speakerValue)
      .then(async () => {
        const response = await getTranscription(id.toString());
        const fetchedResult = response.data.result; // TODO : REFACTOR REFETCH
        if (fetchedResult) {
          setResult(fetchedResult);
        } else {
          message.error("No results found for this transcription.");
        }
        setIsLoading(false);
        setIsModalOpen(false);
      })
      .catch((error) => {
        console.error("Error updating speaker names:", error);
        setIsLoading(false);
      });

    setIsLoading(false);
  };

  const handleFilenameChange = async () => {
    if (fileName != null && fileName != "") {
      await updateRecordingName(id.toString(), fileName);
      const response = await getTranscription(id.toString());
      const fetchedResult = response.data.result; // TODO : REFACTOR REFETCH
      if (fetchedResult) {
        setResult(fetchedResult);
      } else {
        message.error("No results found for this transcription.");
      }
      setFileName(null);
    }
  };

  const handleAudioTimeUpdate = (time: number) => {
    setCurrentAudioTime(time);
  };

  return (
    <div className="flex flex-col min-h-screen lg:ml-[16rem]">
      <div className="flex flex-col space-y-4 px-[2rem] flex-1 mb-4">
        <div className="flex justify-between items-start md:items-center flex-col md:flex-row gap-2">
          <div className="flex items-center space-x-2 mt-2 py-4">
            {!isFileNameEdit ? (
              <span
                className="text-sm text-white-1 font-bold"
                onKeyDown={async (e) => await handleFilenameChange()}
              >
                {result?.recordingname}
                {/* TODO : Confirm recording name is required */}
              </span>
            ) : (
              <Input
                className="w-full border-1 border-white-1 focus:border-blue-300"
                value={fileName ?? result?.recordingname}
                onChange={(e: any) => setFileName(e.target.value)}
              />
            )}
            {!isFileNameEdit && (
              <button
                className="text-white-1 hover:text-white-5"
                onClick={() => setIsFileNameEdit(true)}
              >
                <PencilSquareIcon className="h-5 w-5" />
              </button>
            )}
            {isFileNameEdit && (
              <>
                <Button
                  className="text-white  bg-blue-500 border-none"
                  onClick={async () => {
                    await handleFilenameChange();
                    setIsFileNameEdit(false);
                  }}
                >
                  save
                </Button>
                <Button
                  className="text-white  bg-red-500 border-none"
                  onClick={() => setIsFileNameEdit(false)}
                >
                  cancel
                </Button>
              </>
            )}
          </div>

          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-1">
              <CalendarIcon className="h-5 w-5 text-gray-50" />
              <span className="text-sm text-gray-50">
                {timestamp || "No Timestamp Available"}
              </span>
            </div>
            <div className="flex items-center space-x-1">
              <ClockIcon className="h-5 w-5 text-gray-50" />
              <span className="text-sm text-gray-50">0:26</span>
            </div>
          </div>

          <div className="my-4 md:my-0">
            <div className="flex gap-3 flex-row">
              <Button
                className="bg-orange-600 text-black-1 border-none hover:bg-orange-500"
                onClick={showModal}
              >
                Edit Speaker
              </Button>
              <Button
                className="bg-orange-600 text-black-1 border-none hover:bg-orange-500"
                onClick={() => router.push(`/result/minutes/${id}`)}
              >
                Meeting Minutes
              </Button>
            </div>

            <Modal
              title={
                <p className="text-white font-bold text-lg">Edit Speaker</p>
              }
              open={isModalOpen}
              onOk={handleOk}
              onCancel={handleCancel}
              footer={null} // Remove default footer if you want custom buttons
            >
              <div>
                {noOfSpeakers?.map((item: any, index: number) => (
                  <div className="mt-2" key={index}>
                    <div className="font-semibold ">{item}</div>
                    <div>
                      <Input
                        placeholder={`Enter ${item} name`}
                        style={{
                          backgroundColor: "#1A1A1A", // Black background
                          color: "#FFF", // White text
                        }}
                        onChange={(e) => {
                          setSpeakerValue((prev: any[]) => ({
                            ...prev,
                            [item]: e.target.value,
                          }));
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex justify-end gap-3 mt-4">
                <Button
                  className="text-white  bg-red-500 border-none"
                  onClick={handleCancel}
                >
                  Cancel
                </Button>
                <Button
                  className="bg-blue-500 text-black hover:bg-blue-600 border-none"
                  onClick={() => handleSpeakerEdit()}
                  loading={isLoading}
                >
                  Edit
                </Button>
              </div>
            </Modal>
          </div>
        </div>

        {/* Table Container with Scrollable Content */}
        <div className="mt-4 overflow-y-auto max-h-[calc(100vh-160px-132px)] hide-scrollable">
          <table className="min-w-full table-auto">
            <tbody>
              {result?.result.map((segment: any, index: any) => {
                const startTime = segment.start_time;
                const endTime = segment.end_time;
                const elapsedTime = formatTime(index === 0 ? 0 : startTime);
                const bufferTime = 0.3; // Add a small buffer time (in seconds)
                const isHighlighted =
                  currentAudioTime >= startTime - bufferTime &&
                  currentAudioTime <= endTime + bufferTime;

                return (
                  <tr
                    key={index}
                    className={`table-row transition-colors duration-300 ${
                      isHighlighted ? "bg-black-2" : "hover:bg-black-2"
                    }`}
                  >
                    <td className="px-4 py-2 text-blue-500">
                      <span
                        onClick={() => {
                          handleAudioSeek(segment.start_time); 
                        }}
                        className="cursor-pointer"
                      >
                        {" "}
                        {elapsedTime}
                      </span>
                    </td>
                    <td className="px-4 py-2 text-blue-500">
                      {segment.speaker}
                    </td>

                    <td className="px-4 py-2 text-white-1">
                      <span
                        onClick={() => toggleTranslation()} // Pass start_time to handleTextClick
                        className="cursor-pointer"
                      >
                        {showTranslation
                          ? segment.translated_text
                          : segment.transcribed_text}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {loadingAudio ? (
        <Loader />
      ) : (
        audioUrl && (
          <div className="sticky bottom-0 w-full text-white-1 shadow-lg ">
            <div className="max-w-full w-full">
              <CustomAudioPlayer
                audioUrl={audioUrl}
                onTimeUpdate={handleAudioTimeUpdate}
                audioRef={audioRef}
              />
            </div>
          </div>
        )
      )}
    </div>
  );
};

export default AudioResultComponent;
