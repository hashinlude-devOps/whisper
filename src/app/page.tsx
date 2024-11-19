"use client";

import React from "react";
import AudioUploadComponent from "@/components/AudioUploadComponent";
import SpeakerListToName from "@/components/SpeakerListToName";
import TranslateComponent from "@/components/TranslateComponent";

export default function Home() {
  const [audioUploadFetched, setAudioUploadFetched] = React.useState<any>([]);
  const [script, setScript] = React.useState();

  return (
    <div className="px-[3rem] py-[2rem] -">
      <div className="text-black text-[26px] font-bold md:mb-0 sm:mb-[1rem] mb-[1rem]">
        WHISPER
      </div>

      <AudioUploadComponent
        audioUploadFetched={audioUploadFetched}
        setAudioUploadFetched={setAudioUploadFetched}
      />

      {audioUploadFetched && (
        <SpeakerListToName
          audioUploadFetched={audioUploadFetched}
          setScript={setScript}
        />
      )}

      {script && <TranslateComponent script={script} />}
    </div>
  );
}
