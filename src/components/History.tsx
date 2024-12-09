"use client";
import React, { useEffect, useState } from "react";
import { AudioOutlined } from "@ant-design/icons";
import { getRecordings, getTranscription } from "@/lib/services/audioService"; // Import the service
import { useRouter } from "next/navigation";
import { useAudio } from "@/context/AudioContext";
import message from "antd/es/message";
import { useSidebar } from "@/context/SidebarProvider";

export default function History() {
  const [historyData, setHistoryData] = useState<any[]>([]);
  const [activeItem, setActiveItem] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const [isSmallScreen, setIsSmallScreen] = useState(false); // State to track screen size


  // Access the context here
  const { setAudioResult } = useAudio();
  const { isMenuOpen, setIsMenuOpen } = useSidebar(); // Access sidebar context

  const handleItemClick = (id: any) => {
    setActiveItem(id); // Set the active item when clicked
    handleHistoryClick(id); // Call the external handler
  };

  // Function to handle window resizing and check screen size
  const checkScreenSize = () => {
    if (window.innerWidth < 768) {
      setIsSmallScreen(true);
    } else {
      setIsSmallScreen(false);
    }
  };

  // Set up listener for screen size changes on mount
  useEffect(() => {
    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);

    return () => {
      window.removeEventListener("resize", checkScreenSize);
    };
  }, []);

  const handleHistoryClick = async (id: string) => {
    try {
      setIsLoading(true);
      if (isSmallScreen) {
        setIsMenuOpen(false);
      }
      const response = await getTranscription(id);
      const fetchedResult = response.data.result;
      console.log(fetchedResult);
      if (fetchedResult) {
        // Now setAudioResult works as expected because it's inside the functional component
        setAudioResult(fetchedResult);
        router.push("/result");
      } else {
        message.error("No results found for this transcription.");
      }
    } catch (error) {
      console.error("Error fetching transcription:", error);
      message.error("Failed to fetch transcription.");
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
    setIsMenuOpen((prev: any) => !prev);
  };

  const uploadnew = () => {
    router.push("/"); // Redirect to the home page
  };

  return (
    <>
      {/* Menu */}
      <div
        className={`fixed top-0 left-0 h-full bg-black-1 text-white-1 transition-all duration-500 ease-in-out transform ${
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
          {/* Close Icon, show only on small screens */}
          <button
            onClick={toggleMenu}
            className="p-2 rounded-lg block sm:hidden" // Hide on large screens (above 768px)
          >
            <div className="w-6 h-6 flex flex-col justify-between items-center space-y-1">
              <div
                className={`w-full h-1 bg-white-1 rounded transition-all duration-300 ${
                  isMenuOpen ? "rotate-45 translate-y-2" : ""
                }`}
              ></div>

              <div
                className={`w-full h-1 bg-white-1 rounded transition-all duration-300 ${
                  isMenuOpen ? "-rotate-45 -translate-y-2" : ""
                }`}
              ></div>
            </div>
          </button>
          <button className="p-2 rounded-lg" onClick={uploadnew}>
            <AudioOutlined className="text-white-1 text-2xl" />
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
                  <li
                    key={item.id}
                    className={`flex flex-col space-y-1 p-2 
                      ${
                        activeItem === item.id
                          ? "bg-gray-700 rounded-md"
                          : "hover:bg-gray-700"
                      } 
                      hover:rounded-md`} // Apply hover effect and active state effect
                  >
                    <span
                      className="text-gray-300 text-sm hover:text-gray-200 font-medium cursor-pointer"
                      onClick={() => handleItemClick(item.id)} // Set active on click
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
            className="fixed  left-4 p-4 rounded-lg z-20 transition-all duration-300 ease-in-out"
          >
            <div className="w-6 h-6 flex flex-col justify-between items-center space-y-2">
              <div
                className={`w-full h-1 bg-white-1 rounded transition-all duration-300`}
              ></div>
              <div
                className={`w-full h-1 bg-white-1 rounded transition-all duration-300`}
              ></div>
              <div
                className={`w-full h-1 bg-white-1 rounded transition-all duration-300`}
              ></div>
            </div>
          </button>
          <button
            className="fixed left-16 p-4 rounded-lg z-20"
            onClick={uploadnew}
          >
            <AudioOutlined className="text-white-1 text-2xl" />
          </button>
        </>
      )}
    </>
  );
}
