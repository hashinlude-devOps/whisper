"use client";

import React, { useEffect, useState } from "react";
import { getSegmentAudio } from "@/lib/services/audiofetchService"; // Adjust the path to your service file
import { PencilSquareIcon } from "@heroicons/react/24/outline";

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
  const [audioUrls, setAudioUrls] = useState<Record<string, string>>({});
  const [openDropdownIndex, setOpenDropdownIndex] = useState<number | null>(
    null
  );

  // Helper function to format milliseconds to HH:mm:ss
  const formatTime = (ms: number) => {
    console.log("number is");
    console.log(ms);

    const date = new Date(ms * 1000); // Multiply by 1000 to convert to milliseconds
    const hours = date.getUTCHours().toString().padStart(2, "0");
    const minutes = date.getUTCMinutes().toString().padStart(2, "0");
    const seconds = date.getUTCSeconds().toString().padStart(2, "0");

    return `${hours}:${minutes}:${seconds}`;
  };

  // Fetch audio segments from the server
  const fetchSegmentAudio = async (segmentFile: string): Promise<string> => {
    try {
      const audioUrl = await getSegmentAudio(segmentFile);
      return audioUrl;
    } catch (error) {
      console.error("Error fetching segment audio:", error);
      return "";
    }
  };

  // Fetch audio files on mount and when result changes
  useEffect(() => {
    const fetchAudioFiles = async () => {
      // Implement logic to fetch audio files if needed
    };

    fetchAudioFiles();
  }, [result.result]);

  return (
    <div className="flex flex-col space-y-4 px-[2rem] py-[2rem]">
      <h2 className="text-l">Audio Transcription and Translation Results</h2>

      <div className="mt-4">
        <h3 className="font-semibold">Segments</h3>
        <div className="space-y-2">
          {result.result.map((segment, index) => {
            const startTime = segment.start_time; // Start time in milliseconds
            // For the first segment, set start time to 0
            const elapsedTime = formatTime(index === 0 ? 0 : startTime); // For first segment, always 00:00:00
            return (
              <div
                key={index}
                className="flex items-center space-x-4 hover:bg-gray-100 transition-colors duration-200 p-1 rounded-md"
              >
                {/* Show the elapsed time relative to total audio */}
                <div className="flex-1">
                  <span>{elapsedTime}</span>
                </div>

                {/* Dropdown Menu for Speakers */}
                <div className="relative">
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
                        <li className="px-4 py-2 hover:bg-gray-100 border-b cursor-pointer">
                          Speakers
                        </li>
                        {result.speaker_list.map(
                          (speaker: string, speakerIndex: number) => (
                            <li
                              key={speakerIndex}
                              className="flex items-center px-4 py-2 hover:bg-gray-100 cursor-pointer space-x-2"
                            >
                              <span
                                contentEditable
                                suppressContentEditableWarning
                                className="flex-1 focus:border-gray-300 focus:outline-none rounded-md p-1"
                              >
                                {speaker}
                              </span>
                              <button className="text-gray-600 hover:text-gray-800 ml-auto">
                                <PencilSquareIcon className="h-5 w-5" />
                              </button>
                            </li>
                          )
                        )}
                      </ul>
                    </div>
                  )}
                </div>

                {/* Speaker Name */}
                <div className="flex-1">
                  <span>{segment.speaker}</span>
                </div>

                {/* Transcribed Text */}
                <div className="flex-1">
                  <span>{segment.transcribed_text}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default AudioResultComponent;
