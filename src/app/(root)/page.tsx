// src/app/(root)/page.tsx
"use client";

import React, { useEffect, useState } from "react";
import AudioUpload from "@/components/AudioUpload";
import History from "@/components/History";
import { getRecordings } from "@/lib/services/audioService";
import Loader from "@/components/Loader";
import AudioResult from "@/components/AudioResult";
import Header from "@/components/Header";
import { useRouter } from "next/navigation"; // Importing router for navigation

export default function Home() {
  const [audioUploadFetched, setAudioUploadFetched] = useState(null);
  const [loading, setIsLoading] = useState(false);
  const [history, setHistory] = useState([]);
  const [isMenuOpen, setIsMenuOpen] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        setIsLoading(true);
        const response = await getRecordings();
        const fetchedHistory = response.data.recordings;
        setHistory(fetchedHistory);
      } catch (error) {
        console.error("Failed to fetch recordings:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchHistory();
  }, []);

 

  return (
    <div className="flex h-screen">
      {loading && <Loader />}

      {/* Sidebar/History */}
      <History
        isMenuOpen={isMenuOpen}
        setIsMenuOpen={setIsMenuOpen}
        history={history}
      />
      <div
        className={`flex-1 flex flex-col overflow-hidden transition-all duration-500 ease-in-out ${
          isMenuOpen ? "md:ml-64" : "md:ml-0"
        } sm:ml-0`}
      >
        <Header isMenuOpen={isMenuOpen} />

        <div className="flex-1 h-[calc(100vh-4rem)] overflow-y-auto">
          {audioUploadFetched ? (
            <AudioResult result={audioUploadFetched} />
          ) : (
            <AudioUpload
              setAudioUploadFetched={setAudioUploadFetched}
              setIsLoading={setIsLoading}
              loading={loading}
            />
          )}
        </div>
      </div>
    </div>
  );
}
