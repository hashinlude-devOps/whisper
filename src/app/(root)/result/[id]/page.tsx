"use client";

import React from "react";
import AudioResultComponent from "@/components/AudioResult";
import { useParams } from "next/navigation";

export default function AudioResultPage() {
  const params = useParams(); // Get dynamic route parameters
  const { id } = params;

  return <AudioResultComponent id={Number(id)} />;
}
