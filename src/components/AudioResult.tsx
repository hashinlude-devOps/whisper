"use client";

import React, { useEffect, useState } from "react";
import { getSegmentAudio } from "@/lib/services/audiofetchService"; // Adjust the path to your service file
import { updateSpeakerNames } from "@/lib/services/audioService"; // Import the update function

interface AudioResultProps {
  result: any;
}

const AudioResultComponent: React.FC<AudioResultProps> = ({ result }) => {
  const [audioUrls, setAudioUrls] = useState<Record<string, string>>({});
  const [speakerNames, setSpeakerNames] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

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

  // Handle speaker name changes
  const handleSpeakerNameChange = (speakerIndex: string, newName: string) => {
    setSpeakerNames((prevNames) => ({
      ...prevNames,
      [speakerIndex]: newName,
    }));
  };

  // API call to update speaker names
  const handleUpdateSpeakerNames = async () => {
    setIsLoading(true);
    try {
      const jsonPath = result.json_file; // Dynamic path from result
      const updatedNames = speakerNames;
      const response = await updateSpeakerNames(jsonPath, updatedNames);
      console.log("Speaker names updated:", response);
      setIsLoading(false);
    } catch (error) {
      console.error("Error updating speaker names:", error);
      setIsLoading(false);
    }
  };

  // Fetch audio files on mount and when result changes
  useEffect(() => {
    const fetchAudioFiles = async () => {
      const audioPromises = result.result.map(async (segment: any) => {
        const audioUrl = await fetchSegmentAudio(segment.segment_file);
        return { [segment.segment_file]: audioUrl };
      });

      const audioResults = await Promise.all(audioPromises);
      const audioMap = audioResults.reduce((acc, cur) => ({ ...acc, ...cur }), {});
      setAudioUrls(audioMap);
    };

    fetchAudioFiles();
  }, [result.result]);

  return (
    <div className="flex flex-col space-y-4 px-[2rem] py-[2rem]">
      <h2 className="text-l">Audio Transcription and Translation Results</h2>
      <div className="mt-4">
        <h3 className="font-semibold">Speaker List</h3>
        <ul>
          {result.speaker_list.map((speaker: string, index: number) => (
            <li key={index}>
              <div className="flex items-center">
                <input
                  type="text"
                  value={speakerNames[`speaker_${index}`] || speaker}
                  onChange={(e) => handleSpeakerNameChange(`speaker_${index}`, e.target.value)}
                  className="border p-1 rounded"
                />
              </div>
            </li>
          ))}
        </ul>
      </div>
      <div className="mt-4">
        <h3 className="font-semibold">Segments</h3>
        <div className="space-y-2">
          {result.result.map((segment: any, index: number) => (
            <div key={index} className="border p-2 rounded-md">
              <p>
                <strong>Speaker:</strong> {segment.speaker}
              </p>
              <p>
                <strong>Transcribed Text:</strong> {segment.transcribed_text}
              </p>
              <p>
                <strong>Translated Text:</strong> {segment.translated_text}
              </p>
              <audio controls className="mt-2">
                {audioUrls[segment.segment_file] ? (
                  <source src={audioUrls[segment.segment_file]} type="audio/wav" />
                ) : (
                  "Loading audio..."
                )}
              </audio>
            </div>
          ))}
        </div>
      </div>
      <button
        onClick={handleUpdateSpeakerNames}
        disabled={isLoading}
        className={`mt-4 ${isLoading ? "bg-gray-500" : "bg-blue-500"} text-white py-2 px-4 rounded`}
      >
        {isLoading ? "Updating..." : "Update Speaker Names"}
      </button>
    </div>
  );
};

export default AudioResultComponent;
