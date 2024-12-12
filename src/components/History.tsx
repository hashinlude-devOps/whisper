"use client";
import React, { useEffect, useState } from "react";
import { PlusOutlined } from "@ant-design/icons";
import { getRecordings } from "@/lib/services/audioService";
import { useRouter } from "next/navigation";
import { format, isToday, subDays } from "date-fns";
import message from "antd/es/message";
import { useSidebar } from "@/context/SidebarProvider";

export default function History() {
  const [groupedHistory, setGroupedHistory] = useState<Record<string, any[]>>(
    {}
  );
  const { activeItem, setActiveItem, refreshKey, isMenuOpen, setIsMenuOpen } =
    useSidebar();

  const router = useRouter();
  const [isSmallScreen, setIsSmallScreen] = useState(false);

  const checkScreenSize = () => {
    setIsSmallScreen(window.innerWidth < 768);
  };

  useEffect(() => {
    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);

    return () => {
      window.removeEventListener("resize", checkScreenSize);
    };
  }, []);

  const handleHistoryClick = async (id: string) => {
    try {
      if (isSmallScreen) setIsMenuOpen(false);
      router.push(`/result/${id}`);
    } catch (error) {
      console.error("Error fetching transcription:", error);
      message.error("Failed to fetch transcription.");
    }
  };

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await getRecordings();
        const recordings = response.data.recordings;

        const categorized = categorizeRecordings(recordings);
        setGroupedHistory(categorized);
      } catch (error) {
        console.error("Failed to fetch recordings:", error);
      }
    };

    fetchHistory();

    const intervalId = setInterval(() => {
      fetchHistory();
    }, 60000);

    return () => clearInterval(intervalId);
  }, [refreshKey]);

  const categorizeRecordings = (recordings: any[]) => {
    const today = new Date();
    const weekAgo = subDays(today, 7);
    const monthAgo = subDays(today, 30);

    const categories: Record<string, any[]> = {
      Today: [],
      "Previous 7 Days": [],
      "Previous 30 Days": [],
    };

    const sortedRecordings = recordings.sort((a, b) => {
      return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
    });

    sortedRecordings.forEach((recording) => {
      const date = new Date(recording.timestamp);

      if (isToday(date)) {
        categories["Today"].push(recording);
      } else if (date > weekAgo) {
        categories["Previous 7 Days"].push(recording);
      } else if (date > monthAgo) {
        categories["Previous 30 Days"].push(recording);
      } else {
        const monthYear = format(date, "MMMM yyyy");
        if (!categories[monthYear]) {
          categories[monthYear] = [];
        }
        categories[monthYear].push(recording);
      }
    });

    return categories;
  };

  const toggleMenu = () => setIsMenuOpen((prev: any) => !prev);
  const uploadnew = () => {
    setActiveItem(null);
    router.push("/");
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
          {/* Close Icon */}
          <button
            onClick={toggleMenu}
            className="p-2 rounded-lg block sm:hidden"
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
            <PlusOutlined className="text-white-1 text-2xl" />
          </button>
        </div>

        {/* Menu Content */}
        <div className="overflow-y-auto h-full max-h-[calc(100vh-4rem)] p-4 hide-scrollable">
          {Object.keys(groupedHistory).length > 0 ? (
            Object.keys(groupedHistory)
              .filter((category) => groupedHistory[category].length > 0)
              .map((category) => (
                <div key={category} className="mb-4">
                  <p className="text-gray-300 text-sm font-bold mb-2">
                    {category}
                  </p>
                  <ul className="space-y-2">
                    {groupedHistory[category].map((item) => (
                      <li
                        key={item.id}
                        className={`flex flex-col space-y-1 p-2 ${
                          activeItem === item.id
                            ? "bg-black-2 rounded-md"
                            : item.recording_status === "Completed" &&
                              "hover:bg-black-2"
                        } hover:rounded-md`}
                      >
                        <div className="relative">
                          <span
                            key={item.id}
                            className={`text-sm font-medium cursor-pointer ${
                              activeItem === item.id
                                ? "text-gray-100 font-semibold"
                                : "hover:text-gray-200"
                            }`}
                            onClick={() => {
                              if (item.recording_status === "Completed") {
                                setActiveItem(item.id);
                                handleHistoryClick(item.id);
                              }
                            }}
                          >
                            {item.recordingname
                              .split("/")
                              .pop()
                              ?.replace(/\.[^/.]+$/, "")}
                          </span>

                          {item.recording_status === "Failed" && (
                            <>
                              <div className="text-xs text-red-500 font-medium absolute bottom-[-9px] right-0 tooltip">
                                Failed!
                                <div className="tooltip-text">
                                  Please reupload
                                </div>
                              </div>
                            </>
                          )}

                          {item.recording_status === "Pending" && (
                            <div className="absolute bottom-[-8px] right-0 w-[80%]">
                              <div className="w-full bg-gray-600 rounded h-1 mt-2">
                                <div
                                  className="bg-green-500 h-1 rounded"
                                  style={{ width: "70%" }}
                                ></div>
                              </div>
                            </div>
                          )}
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              ))
          ) : (
            <p className="text-gray-400">No history available</p>
          )}
        </div>
      </div>

      {/* Button when menu is closed */}
      {!isMenuOpen && (
        <>
          <button
            onClick={toggleMenu}
            className="fixed left-4 p-4 rounded-lg z-20 transition-all duration-300 ease-in-out"
          >
            <div className="w-6 h-6 flex flex-col justify-between items-center space-y-2">
              <div className={`w-full h-1 bg-white-1 rounded`}></div>
              <div className={`w-full h-1 bg-white-1 rounded`}></div>
              <div className={`w-full h-1 bg-white-1 rounded`}></div>
            </div>
          </button>
          <button
            className="fixed left-16 p-4 rounded-lg z-20"
            onClick={uploadnew}
          >
            <PlusOutlined className="text-white-1 text-2xl" />
          </button>
        </>
      )}
    </>
  );
}
