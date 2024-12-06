"use client";

import React from "react";
import { useAudio } from "@/context/AudioContext";
import AudioResultComponent from "@/components/AudioResult";
import { redirect } from "next/navigation";

export default function AudioResultPage() {
  const { audioResult } = useAudio();  // Access the global state

  // If audioResult is null, return a fallback or redirect
  if (!audioResult ) {
    return (
      <p>No audio result available. Please try again later.</p>
    );
  }

  return (
    <div>
      <AudioResultComponent result={audioResult} />
    </div>
  );
}
