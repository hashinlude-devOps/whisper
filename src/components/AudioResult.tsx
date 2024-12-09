"use client";
import React, { useEffect, useState, useRef } from "react";
import { getFullAudio } from "@/lib/services/audiofetchService";
import { PencilSquareIcon } from "@heroicons/react/24/outline";
import CustomAudioPlayer from "./CustomAudioPlayer";
import Loader from "@/components/Loader";
import { updateSpeakerNames } from "@/lib/services/audioService";
import CalendarIcon from "@heroicons/react/20/solid/CalendarIcon";
import ClockIcon from "@heroicons/react/20/solid/ClockIcon";
import ChatBox from "./ChatBox";

interface AudioResultProps {
  result: {
    json_file: string;
    num_speakers: number;
    recording_id: number;
    result: {
      segment_file: string;
      speaker: string;
      transcribed_text: string;
      translated_text: string;
      start_time: number;
      end_time: number;
    }[];
    speaker_list: string[];
    status: string;
  };
}

const AudioResultComponent: React.FC<AudioResultProps> = ({ result }) => {
  const [openDropdownIndex, setOpenDropdownIndex] = useState<number | null>(
    null
  );
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [loadingAudio, setLoadingAudio] = useState(true);
  const [speakerNameUpdates, setSpeakerNameUpdates] = useState<
    Record<string, string>
  >({});
  const [currentAudioTime, setCurrentAudioTime] = useState(0);
  const [showTranslation, setShowTranslation] = useState(false);


  const hasFetchedAudio = useRef(false);

  const formatTime = (ms: number) => {
    const date = new Date(ms * 1000);
    const hours = date.getUTCHours().toString().padStart(2, "0");
    const minutes = date.getUTCMinutes().toString().padStart(2, "0");
    const seconds = date.getUTCSeconds().toString().padStart(2, "0");

    return `${hours}:${minutes}:${seconds}`;
  };

  useEffect(() => {
    const fetchFullAudio = async () => {
      if (hasFetchedAudio.current) return;

      setLoadingAudio(true);
      try {
        const url = await getFullAudio(result.recording_id.toString());
        setAudioUrl(url);
        hasFetchedAudio.current = true;
      } catch (error) {
        console.error("Error fetching full audio:", error);
      } finally {
        setLoadingAudio(false);
      }
    };

    setAudioUrl(null);
    setLoadingAudio(true);
    hasFetchedAudio.current = false;

    if (result.recording_id) {
      fetchFullAudio();
    }
  }, [result]);

  const handleTextClick = () => {
    console.log("clicked")
    setShowTranslation(!showTranslation); // Toggle translation visibility
  };

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

  const handleFilenameChange = () => {};

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
      className="flex flex-col min-h-screen lg:ml-[16rem]"
    >
     
      <div className="flex flex-col space-y-4 px-[2rem] flex-1 mb-4">
        <div>
          <div className="flex items-center space-x-2 mt-2 py-4">
            <div className="flex items-center space-x-2">
              <span
                contentEditable
                suppressContentEditableWarning
                className="text-sm text-gray-50 font-bold focus:outline-none "
                onKeyDown={(e) => handleFilenameChange()}
              >
                {result.json_file}
              </span>
              <button className="text-white-1">
                <PencilSquareIcon className="h-5 w-5" />
              </button>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-1">
              <CalendarIcon className="h-5 w-5 text-gray-50" />
              <span className="text-sm text-gray-50">27/11/2024, 15:32:38</span>
            </div>
            <div className="flex items-center space-x-1">
              <ClockIcon className="h-5 w-5 text-gray-50" />
              <span className="text-sm text-gray-50">0:26</span>
            </div>
          </div>
        </div>

        {/* Table Container with Scrollable Content */}
        <div className="mt-4 overflow-y-auto max-h-[calc(100vh-160px)] hide-scrollable">
          <table className="min-w-full table-auto">
            <tbody>
              {result.result.map((segment, index) => {
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
                    <td className="px-4 py-2 text-blue-500">{elapsedTime}</td>
                    <td className="px-4 py-2 text-blue-500">
                      {segment.speaker}
                    </td>
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
                          <div className="absolute left-0 mt-2 text-white-1 border border-gray-300 bg-black-1 rounded-md shadow-lg z-10 w-48">
                            <ul>
                              <li className="px-4 py-1  border-b cursor-pointer">
                                Speakers
                              </li>
                              {result.speaker_list.map(
                                (speaker: string, speakerIndex: number) => (
                                  <li
                                    key={speakerIndex}
                                    className="flex items-center px-4 py-1 hover:bg-black-2 cursor-pointer space-x-2"
                                  >
                                    <span
                                      contentEditable
                                      suppressContentEditableWarning
                                      className="flex-1 focus:border-gray-300 focus:outline-none rounded-md p-1"
                                      onKeyDown={(e) =>
                                        handleKeyDown(
                                          e,
                                          speakerIndex,
                                          result.json_file
                                        )
                                      }
                                    >
                                      {speakerNameUpdates[
                                        `speaker_${speakerIndex}`
                                      ] || speaker}
                                    </span>
                                    <button className="text-white-1 hover:text-white-2 ml-auto">
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
                    <td className="px-4 py-2 text-white-1">
                      <span
                        onClick={handleTextClick}
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
          <div className="sticky bottom-0 w-full text-white-1 shadow-lg">
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
