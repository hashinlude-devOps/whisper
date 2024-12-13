"use client";

import React from "react";
import AudioResultComponent from "@/components/AudioResult";
import ProtectedPage from "@/context/ProtectedPage";
import { useParams,redirect } from "next/navigation";

export default function AudioResultPage() {
  const params = useParams();
  const id = params?.id;

  return (
    <div>
      <AudioResultComponent id={Number(id)} />
      <ProtectedPage />
    </div>
  );
}
