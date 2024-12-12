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
import SpeakerCarousel from "./SpeakerCarousel";
import { useSidebar } from "@/context/SidebarProvider";

const AudioResultComponent = ({ id }: { id: number }) => {
  const [noOfSpeakers, setNoOfSpeakers] = React.useState<any>();
  const [speakerValue, setSpeakerValue] = React.useState([{}]);
  const [loading, setIsLoading] = React.useState(false);
  const { setActiveItem } = useSidebar();

  const [isFileNameEdit, setIsFileNameEdit] = useState<boolean>(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
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

  const fetchAudioData = async () => {
    if (hasFetchedAudio.current) return;

    setIsLoading(true);

    try {
      const response = await getTranscription(id.toString());
      const fetchedResult = response.data?.result;

      if (fetchedResult) {
        setResult(fetchedResult);
        setTimestamp(fetchedResult?.timestamp);
      } else {
        message.error("No results found for this transcription.");
      }

      setIsLoading(false);

      const url = await getFullAudio(id.toString());
      setAudioUrl(url);
      hasFetchedAudio.current = true;
    } catch (error) {
      console.error("Error fetching transcription or audio:", error);
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    fetchAudioData();
  }, []);

  React.useEffect(() => {
    setNoOfSpeakers(result?.speaker_list);
  }, [result]);

  React.useEffect(() => {
    setActiveItem(id);
    return () => {
      setActiveItem(null);
    };
  }, [id, setActiveItem]);

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

  const handleSpeakerAudioPlay = (speaker: string) => {
    if (!result?.result || !audioRef.current) return;

    const speakerSegment = result.result.find(
      (segment: any) => segment.speaker === speaker
    );

    if (speakerSegment) {
      const { start_time, end_time } = speakerSegment;
      const duration = (end_time - start_time) * 1000; // Convert to milliseconds

      audioRef.current.currentTime = start_time;
      audioRef.current.play();
      setIsPlaying(true);

      // Stop the audio after the snippet's duration
      setTimeout(() => {
        if (audioRef.current) {
          audioRef.current.pause();
          audioRef.current.currentTime = start_time; // Reset to start of snippet
          setIsPlaying(false);
        }
      }, duration);
    } else {
      message.error("Audio segment for this speaker not found.");
    }
  };

  const handleSpeakerEdit = () => {
    setIsModalOpen(false);
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
      })
      .catch((error) => {
        console.error("Error updating speaker names:", error);
        setIsLoading(false);
      });
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
      {loading ? (
        <Loader /> // Display loader for the entire component
      ) : (
        <>
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
                      className="text-white  bg-blue-600 hover:bg-blue-700 border-none"
                      onClick={async () => {
                        await handleFilenameChange();
                        setIsFileNameEdit(false);
                      }}
                    >
                      save
                    </Button>
                    <Button
                      className="text-white  bg-red-600 hover:bg-red-700 border-none"
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
                    className=" text-white-1 border-none bg-blue-600 hover:bg-blue-700"
                    onClick={showModal}
                  >
                    Update Speaker
                  </Button>
                  <Button
                    className="text-white-1 border-none bg-blue-600 hover:bg-blue-700"
                    onClick={() => router.push(`/result/minutes/${id}`)}
                  >
                    Meeting Minutes
                  </Button>
                </div>

                <Modal
                  title={
                    <p className="text-white font-bold text-lg border-b">
                      Update Speaker
                    </p>
                  }
                  open={isModalOpen}
                  onOk={handleOk}
                  onCancel={handleCancel}
                  footer={null} // Remove default footer if you want custom buttons
                >
                  <SpeakerCarousel
                    noOfSpeakers={noOfSpeakers}
                    setSpeakerValue={setSpeakerValue}
                    handleSpeakerAudioPlay={handleSpeakerAudioPlay}
                  />

                  <div className="flex justify-end gap-3 mt-4">
                    <Button
                      className="text-white-1 border-none bg-red-600 hover:bg-red-700"
                      onClick={handleCancel}
                    >
                      Cancel
                    </Button>
                    <Button
                      className="text-white-1 border-none bg-blue-600 hover:bg-blue-700"
                      onClick={() => handleSpeakerEdit()}
                      loading={loading}
                    >
                      Update
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

          {audioUrl ? (
            <div className="sticky bottom-0 w-full text-white-1 shadow-lg">
              <div className="max-w-full w-full">
                <CustomAudioPlayer
                  audioUrl={audioUrl}
                  onTimeUpdate={handleAudioTimeUpdate}
                  audioRef={audioRef}
                />
              </div>
            </div>
          ) : (
            <div className="sticky bottom-0 w-full text-center h-[112px]  text-white py-4">
              <span className="loading-text">
                Downloading audio<span className="dot-animate">...</span>
              </span>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default AudioResultComponent;
