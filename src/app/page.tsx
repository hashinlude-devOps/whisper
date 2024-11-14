"use client";

import Reacts from "react";
import AudioUploadComponent from "@/components/AudioUploadComponent";
import SpeakerListToName from "@/components/SpeakerListToName";

export default function Home() {
  const data = [
    {
      speaker: "Abhijith",
      transcribed_text: " Hello.",
      translated_text: " Hello.",
      segment_file: "diarizationoutput/segment_1_speaker_0.wav",
    },
    {
      speaker: "Anas",
      transcribed_text: " Hello, how are you?",
      translated_text: " Hello, how are you?",
      segment_file: "diarizationoutput/segment_2_speaker_0.wav",
    },
    {
      speaker: "Rithvik",
      transcribed_text: " Doing good. What about you? I'm also good.",
      translated_text: " Doing good. What about you? I'm also good.",
      segment_file: "diarizationoutput/segment_3_speaker_0.wav",
    },
    {
      speaker: "Anas",
      transcribed_text: " had breakfast.",
      translated_text: " had breakfast.",
      segment_file: "diarizationoutput/segment_4_speaker_1.wav",
    },
    {
      speaker: "Rithvik",
      transcribed_text: " No, I hadn't.",
      translated_text: " No, I hadn't.",
      segment_file: "diarizationoutput/segment_5_speaker_0.wav",
    },
  ];

  return (
    <div className="px-[3rem] py-[2rem] -">
      <div className="text-black text-[26px] font-bold md:mb-0 sm:mb-[1rem] mb-[1rem]">
        WHISPER
      </div>

      <AudioUploadComponent />

      <SpeakerListToName />

      <div className="grid md:grid-cols-2 sm:grid-cols-1 grid-cols-1 gap-[2rem]">
        <div className="mt-[2rem]">
          <div className="border rounded-2xl p-[1rem]">
            <div className="font-[500]">Transcribed</div>
            {data?.map((item, index) => (
              <div className="mt-[1rem]" key={index}>
                <div className="underline">{item?.speaker}</div>
                <div>{item?.transcribed_text}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-[2rem]">
          <div className="border rounded-2xl p-[1rem]">
            <div className="font-[500]">Translated</div>
            {data?.map((item, index) => (
              <div key={index} className="mt-[1rem]">
                <div className="underline">{item?.speaker}</div>
                <div>{item?.translated_text}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
