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
      const audioPromises = result.result.map(async (segment) => {
        const audioUrl = await fetchSegmentAudio(segment.segment_file);
        return { [segment.segment_file]: audioUrl };
      });

      const audioResults = await Promise.all(audioPromises);
      const audioMap = audioResults.reduce(
        (acc, cur) => ({ ...acc, ...cur }),
        {}
      );
      setAudioUrls(audioMap);
    };

    fetchAudioFiles();
  }, [result.result]);

  return (
    <div className="flex flex-col space-y-4 px-[2rem] py-[2rem]">
      <h2 className="text-l">Audio Transcription and Translation Results</h2>

      <div className="mt-4">
        <h3 className="font-semibold">Segments</h3>
        <div className="space-y-2">
          {result.result.map((segment, index) => (
            <div
              key={index}
              className="flex items-center space-x-4 hover:bg-gray-100 transition-colors duration-200 p-1 rounded-md"
            >
              {/* Dropdown Menu for Speakers */}
              <div className="relative">
                <div
                  className="flex items-center justify-center cursor-pointer bg-gray-200 w-6 h-6 rounded-full"
                  onClick={() =>
                    setOpenDropdownIndex(
                      openDropdownIndex === index ? null : index
                    )
                  }
                  title="Select Speaker"
                >
                  {/* Icon as Dropdown Button */}
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
                {/* Dropdown List */}
                {openDropdownIndex === index && (
                 <div className="absolute left-0 mt-2 bg-white border border-gray-300 rounded-md shadow-lg z-10 w-48">
                 <ul>
                   {/* Header for Dropdown */}
                   <li className="px-4 py-2 hover:bg-gray-100 border-b cursor-pointer">
                     Speakers
                   </li>
                   {result.speaker_list.map((speaker: string, speakerIndex: number) => (
                    <li
                    key={speakerIndex}
                    className="flex items-center px-4 py-2 hover:bg-gray-100 cursor-pointer space-x-2"
                  >
                    {/* Editable Speaker Name */}
                    <span
                      contentEditable
                      suppressContentEditableWarning
                      className="flex-1 focus:border-gray-300 focus:outline-none rounded-md p-1"
                    >
                      {speaker}
                    </span>
                  
                    {/* Pencil Icon aligned to the right */}
                    <button className="text-gray-600 hover:text-gray-800 ml-auto">
                      <PencilSquareIcon className="h-5 w-5" />
                    </button>
                  </li>
                  
                   ))}
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
          ))}
        </div>
      </div>
    </div>
  );
};

export default AudioResultComponent;
