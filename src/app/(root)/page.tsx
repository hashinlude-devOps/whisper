

"use client";
import React, { useState } from "react";
import AudioUpload from "@/components/AudioUpload";
import History from "@/components/History";
import Loader from "@/components/Loader";
import AudioResult from "@/components/AudioResult";
import Header from "@/components/Header";

export default function Home() {
  const [audioUploadFetched, setAudioUploadFetched] = useState(null);
  const [loading, setIsLoading] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(true);

 

  return (
    <div className="flex h-screen">
      {loading && <Loader />}

      {/* Sidebar/History */}
      <History
        isMenuOpen={isMenuOpen}
        setIsMenuOpen={setIsMenuOpen}
        setIsLoading={setIsLoading}
        setAudioUploadFetched={setAudioUploadFetched} 
      />

      {/* Main Content */}
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
