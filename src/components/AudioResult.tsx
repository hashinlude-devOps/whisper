"use client";
import React, { useState, useRef } from "react";
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
import { Button, Input, message } from "antd";
import { nullable } from "zod";

const AudioResultComponent = ({ id }: { id: number }) => {
  const [openDropdownIndex, setOpenDropdownIndex] = useState<number | null>(
    null
  );
  const [result, setResult] = useState<any>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [loadingAudio, setLoadingAudio] = useState(true);
  const [speakerNameUpdates, setSpeakerNameUpdates] = useState<
    Record<string, string>
  >({});
  const [currentAudioTime, setCurrentAudioTime] = useState(0);
  const [isFileNameEdit, setIsFileNameEdit] = useState<boolean>(false);
  const [fileName, setFileName] = useState<string | null>(null);

  const hasFetchedAudio = useRef(false);

  const formatTime = (ms: number) => {
    const date = new Date(ms * 1000);
    const hours = date.getUTCHours().toString().padStart(2, "0");
    const minutes = date.getUTCMinutes().toString().padStart(2, "0");
    const seconds = date.getUTCSeconds().toString().padStart(2, "0");
    return `${hours}:${minutes}:${seconds}`;
  };

  const fetchAudioData = async () => {
    if (hasFetchedAudio.current) return;

    setLoadingAudio(true);
    try {
      const url = await getFullAudio(id.toString());
      setAudioUrl(url);
      hasFetchedAudio.current = true;

      const response = await getTranscription(id.toString());
      const fetchedResult = response.data.result;
      if (fetchedResult) {
        setResult(fetchedResult);
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

  const handleSpeakerEdit = (
    speakerIndex: number,
    newValue: string,
    jsonPath: string
  ) => {
    const speakerKey = `speaker_${speakerIndex}`;
    setSpeakerNameUpdates((prevUpdates) => ({
      ...prevUpdates,
      [speakerKey]: newValue,
    }));

    updateSpeakerNames(jsonPath, { [speakerKey]: newValue })
      .then(() => {
        console.log("Speaker name updated successfully");
      })
      .catch((error) => {
        console.error("Error updating speaker names:", error);
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

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLSpanElement>,
    speakerIndex: number,
    jsonPath: string
  ) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const newValue = e.currentTarget.innerText.trim();
      if (newValue) {
        handleSpeakerEdit(speakerIndex, newValue, jsonPath);
      }
    }
  };

  const handleAudioTimeUpdate = (time: number) => {
    setCurrentAudioTime(time);
  };

  return (
    <div
      onClick={() => setOpenDropdownIndex(null)}
      className="flex flex-col min-h-screen"
    >
      <div className="flex flex-col space-y-4 px-[2rem] flex-1 mb-4">
        <div className=" bg-white ">
          <div className="flex items-center space-x-2 mt-2 py-4">
            <div className="flex items-center space-x-2">
              {!isFileNameEdit ? (
                <span
                  className="text-sm text-gray-700 font-bold"
                  onKeyDown={async (e) => await handleFilenameChange()}
                >
                  {result?.recordingname}
                  {/* TODO : Confirm recording name is required */}
                </span>
              ) : (
                <Input
                  className="w-full"
                  value={fileName ?? result?.recordingname}
                  onChange={(e: any) => setFileName(e.target.value)}
                />
              )}
              {!isFileNameEdit && (
                <button
                  className="text-gray-600 hover:text-gray-800"
                  onClick={() => setIsFileNameEdit(true)}
                >
                  <PencilSquareIcon className="h-5 w-5" />
                </button>
              )}
              {isFileNameEdit && (
                <>
                  <Button
                    className="text-white  bg-blue-500"
                    onClick={async () => {
                      await handleFilenameChange();
                      setIsFileNameEdit(false);
                    }}
                  >
                    save
                  </Button>
                  <Button
                    className="text-white  bg-red-500"
                    onClick={() => setIsFileNameEdit(false)}
                  >
                    cancel
                  </Button>
                </>
              )}
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-1">
              <CalendarIcon className="h-5 w-5 text-gray-500" />
              <span className="text-sm text-gray-700">
                27/11/2024, 15:32:38
              </span>
            </div>
            <div className="flex items-center space-x-1">
              <ClockIcon className="h-5 w-5 text-gray-500" />
              <span className="text-sm text-gray-700">0:26</span>
            </div>
          </div>
        </div>

        {/* Table Container with Scrollable Content */}
        <div className="mt-4 overflow-y-auto max-h-[calc(100vh-160px)] hide-scrollable">
          <table className="min-w-full table-auto">
            <tbody>
              {result?.result?.map((segment: any, index: any) => {
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
                      isHighlighted ? "bg-gray-200" : "hover:bg-gray-200"
                    }`}
                  >
                    <td className="px-4 py-2">{elapsedTime}</td>
                    <td className="px-4 py-2">{segment.speaker}</td>
                    <td className="px-4 py-2">
                      {/* Dropdown for Actions */}
                      <div
                        className="relative"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div
                          className="flex items-center justify-center cursor-pointer bg-gray-200 w-6 h-6 rounded-full"
                          onClick={() =>
                            setOpenDropdownIndex(
                              openDropdownIndex === index ? null : index
                            )
                          }
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4 text-gray-600"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2}
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M5 10l7 7 7-7"
                            />
                          </svg>
                        </div>
                        {openDropdownIndex === index && (
                          <div className="absolute left-0 mt-2 bg-white border border-gray-300 rounded-md shadow-lg z-10 w-48">
                            <ul>
                              <li className="px-4 py-1 hover:bg-gray-100 border-b cursor-pointer">
                                Speakers
                              </li>
                              {result?.speaker_list?.map(
                                (speaker: string, speakerIndex: number) => (
                                  <li
                                    key={speakerIndex}
                                    className="flex items-center px-4 py-1 hover:bg-gray-100 cursor-pointer space-x-2"
                                  >
                                    <span
                                      contentEditable
                                      suppressContentEditableWarning
                                      className="flex-1 focus:border-gray-300 focus:outline-none rounded-md p-1"
                                      onKeyDown={(e) =>
                                        handleKeyDown(
                                          e,
                                          speakerIndex,
                                          result?.json_file
                                        )
                                      }
                                    >
                                      {speakerNameUpdates[
                                        `speaker_${speakerIndex}`
                                      ] || speaker}
                                    </span>
                                    <button className="text-gray-600 hover:text-gray-800 ml-auto">
                                      <PencilSquareIcon className="h-4 w-4" />
                                    </button>
                                  </li>
                                )
                              )}
                            </ul>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-2">{segment.transcribed_text}</td>
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
          <div className="sticky bottom-0 w-full bg-white shadow-lg">
            <div className="max-w-full w-full">
              <CustomAudioPlayer
                audioUrl={audioUrl}
                onTimeUpdate={handleAudioTimeUpdate}
              />
            </div>
          </div>
        )
      )}
    </div>
  );
};

export default AudioResultComponent;
