import React, { createContext, useContext, useState, ReactNode } from "react";

interface AudioResult {
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
}

interface AudioContextType {
  audioResult: AudioResult | null;
  setAudioResult: React.Dispatch<React.SetStateAction<AudioResult | null>>;
}

const AudioContext = createContext<AudioContextType | undefined>(undefined);

export const AudioProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [audioResult, setAudioResult] = useState<AudioResult | null>(null);

  return (
    <AudioContext.Provider value={{ audioResult, setAudioResult }}>
      {children}
    </AudioContext.Provider>
  );
};

export const useAudio = () => {
  const context = useContext(AudioContext);
  if (!context) {
    throw new Error("useAudio must be used within an AudioProvider");
  }
  return context;
};
