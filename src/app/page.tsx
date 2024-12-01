"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

import AudioUploadComponent from "@/components/AudioUploadComponent";
import SpeakerListToName from "@/components/SpeakerListToName";
import TranslateComponent from "@/components/TranslateComponent";
import Loading from "@/components/svg/loading.svg";

export default function Home() {
  const session = useSession();
  const router = useRouter();

  if (!session?.data) {
    return router?.push("/login");
  }

  console.log(session, "-- session --");

  const [audioUploadFetched, setAudioUploadFetched] = useState<any>([]);
  const [script, setScript] = useState(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  if (isLoading) {
    return (
      <div className="flex flex-col justify-center items-center h-screen">
        <Image src={Loading} alt="" />
        <div className="font-bold text-[24px] animate-bounce">Loading..</div>
      </div>
    );
  }

  return (
    <div className="px-[3rem] py-[2rem] -">
      <div className="text-black text-[26px] font-bold md:mb-0 sm:mb-[1rem] mb-[1rem]">
        WHISPER
      </div>

      <AudioUploadComponent
        audioUploadFetched={audioUploadFetched}
        setAudioUploadFetched={setAudioUploadFetched}
        setIsLoading={setIsLoading}
        isLoading={isLoading}
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
