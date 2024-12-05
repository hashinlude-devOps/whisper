"use client";

import React, { useEffect, useState } from "react";
import { AudioOutlined } from "@ant-design/icons";
import { getRecordings, getTranscription } from "@/lib/services/audioService"; // Import the service

export default function History({
  isMenuOpen,
  setIsMenuOpen,
  setIsLoading,
  setAudioUploadFetched, // Add this prop to pass data to the parent,
}: {
  isMenuOpen: boolean;
  setIsMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setAudioUploadFetched: React.Dispatch<React.SetStateAction<any>>; // For updating the result in the parent
}) {
  const [historyData, setHistoryData] = useState<any[]>([]);

  const handleHistoryClick = async (id: string) => {
    try {
      setIsLoading(true);
      const response = await getTranscription(id); // Call the transcription API
      setAudioUploadFetched(response.data.result); // Pass the transcription data to the parent
    } catch (error) {
      console.error("Error fetching transcription:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        setIsLoading(true);
        const response = await getRecordings();
        const fetchedHistory = response.data.recordings;
        setHistoryData(fetchedHistory);
      } catch (error) {
        console.error("Failed to fetch recordings:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchHistory();
  }, [setIsLoading]);

  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };

  return (
    <>
      {/* Menu */}
      <div
        className={`fixed top-0 left-0 h-full bg-gray-800 text-white transition-all duration-500 ease-in-out transform ${
          isMenuOpen ? "w-64" : "w-0"
        }`}
        style={{
          zIndex: isMenuOpen ? 20 : -1,
        }}
      >
        {/* Menu Header */}
        <div
          className={`flex justify-between items-center p-4 border-b h-16 border-gray-700 transition-all duration-300 ease-in-out ${
            isMenuOpen ? "opacity-100" : "opacity-0"
          }`}
        >
          {/* Close Icon */}
          <button onClick={toggleMenu} className="p-2 rounded-lg">
            <div className="w-6 h-6 flex flex-col justify-between items-center space-y-1">
              <div
                className={`w-full h-1 bg-white rounded transition-all duration-300 ${
                  isMenuOpen ? "rotate-45 translate-y-2" : ""
                }`}
              ></div>

              <div
                className={`w-full h-1 bg-white rounded transition-all duration-300 ${
                  isMenuOpen ? "-rotate-45 -translate-y-2" : ""
                }`}
              ></div>
            </div>
          </button>
          <button className="p-2 rounded-lg">
            <AudioOutlined className="text-white text-2xl" />
          </button>
        </div>

        {/* Menu Content */}
        <div
          className={`overflow-y-auto transition-all duration-500 ease-in-out ${
            isMenuOpen ? "h-full opacity-100" : "h-0 opacity-0"
          }`}
        >
          <div className="h-full max-h-[calc(100vh-4rem)] overflow-y-auto hide-scrollable ">
            {historyData.length > 0 ? (
              <ul className="space-y-2 p-4">
                {historyData.map((item) => (
                  <li key={item.id} className="flex flex-col space-y-1 p-2">
                    <span
                      className="text-gray-300 text-sm hover:text-gray-200 font-medium cursor-pointer"
                      onClick={() => handleHistoryClick(item.id)} // Call handleHistoryClick on click
                    >
                      {item.audio_file
                        .split("/")
                        .pop()
                        ?.replace(/\.[^/.]+$/, "")}{" "}
                      {/* Display file name without extension */}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-400 p-4">No history available</p>
            )}
          </div>
        </div>
      </div>

      {/* Button when menu is closed */}
      {!isMenuOpen && (
        <>
          <button
            onClick={toggleMenu}
            className="fixed top-4 left-4 p-4 rounded-lg z-20 transition-all duration-300 ease-in-out"
          >
            <div className="w-6 h-6 flex flex-col justify-between items-center space-y-2">
              <div
                className={`w-full h-1 bg-gray-800 rounded transition-all duration-300`}
              ></div>
              <div
                className={`w-full h-1 bg-gray-800 rounded transition-all duration-300`}
              ></div>
              <div
                className={`w-full h-1 bg-gray-800 rounded transition-all duration-300`}
              ></div>
            </div>
          </button>
          <button className="fixed top-4 left-16 p-4 rounded-lg z-20">
            <AudioOutlined className="text-gray-800 text-2xl" />
          </button>
        </>
      )}
    </>
  );
}
