"use client";

import React from "react";
import AudioResultComponent from "@/components/AudioResult";
import { useParams } from "next/navigation";

export default function AudioResultPage() {
  const params = useParams();
  const { id } = params;

  return <AudioResultComponent id={Number(id)} />;
}
