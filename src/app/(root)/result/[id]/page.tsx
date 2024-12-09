"use client";

import React from "react";
// import { useAudio } from "@/context/AudioContext";
import AudioResultComponent from "@/components/AudioResult";
import ProtectedPage from "@/context/ProtectedPage";
import { useParams,redirect } from "next/navigation";

export default function AudioResultPage() {
  const params = useParams();
  const { id } = params;
  // const { audioResult } = useAudio(); // Access the global state

  // // If audioResult is null, return a fallback or redirect
  // if (!audioResult) {
  //   redirect('/')
  // }

  return (
    <div>
      <AudioResultComponent id={Number(id)} />
      <ProtectedPage />
    </div>
  );
}
