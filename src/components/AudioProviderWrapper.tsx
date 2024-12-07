"use client"; // Mark this file as a client component

import React from "react";
import { AudioProvider } from "@/context/AudioContext";

// Wrapper component to make sure AudioProvider is only used in client components
const AudioProviderWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <AudioProvider>{children}</AudioProvider>;
};

export default AudioProviderWrapper;