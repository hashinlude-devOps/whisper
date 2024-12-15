"use client";
import React, { useEffect, useState } from "react";
import { PlusOutlined } from "@ant-design/icons";
import { getRecordings } from "@/lib/services/audioService";
import { useRouter } from "next/navigation";
import { format, isToday, subDays } from "date-fns";
import { useSidebar } from "@/context/ContextProvider";
import toast from "react-hot-toast";
import { Tooltip } from "antd";

export default function History() {
  const router = useRouter();
  const [groupedHistory, setGroupedHistory] = useState<Record<string, any[]>>(
    {}
  );
  const {
    setResetKey,
    activeItem,
    setActiveItem,
    refreshKey,
    isMenuOpen,
    setIsMenuOpen,
    setCurrentMeetingId,
  } = useSidebar();

  const [isSmallScreen, setIsSmallScreen] = useState(false);

  const checkScreenSize = () => {
    setIsSmallScreen(window.innerWidth < 1025);
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
      toast.error("Error fetching transcription", { duration: 5000 });
    }
  };

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await getRecordings();
        const recordings = response.data.recordings;
        const categorized = categorizeRecordings(recordings);
        setGroupedHistory(categorized);
      } catch (error) {}
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

    // Filter out empty categories
    return Object.fromEntries(
      Object.entries(categories).filter(([key, value]) => value.length > 0)
    );
  };

  const toggleMenu = () => setIsMenuOpen((prev: any) => !prev);
  const uploadnew = () => {
    if (isSmallScreen) setIsMenuOpen(false);
    setActiveItem(null);
    setCurrentMeetingId(null);
    setResetKey((prevKey: any) => prevKey + 1);
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
            className="p-2 rounded-lg block xl:hidden sm:block"
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
          <button
            className="p-2 rounded-lg xl:hidden sm:block hover:bg-black-2"
            onClick={uploadnew}
          >
            <PlusOutlined className="text-white-1 text-3xl font-medium" />
          </button>
          <button
            className="p-2 hidden rounded-lg xl:block sm:hidden hover:bg-black-2 px-4"
            onClick={uploadnew}
          >
            <span className="text-lg font-medium">
              <span className="text-2xl">+</span> New Recording
            </span>
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
                            ? "bg-black-2 rounded-md cursor-pointer"
                            : item.recording_status === "Completed" &&
                              "hover:bg-black-2 cursor-pointer"
                        } hover:rounded-md`}
                        onClick={() => {
                          if (item.recording_status === "Completed") {
                            setActiveItem(item.id);
                            handleHistoryClick(item.id);
                          }
                        }}
                      >
                        <Tooltip
                          title={
                            item.recording_status === "Failed"
                              ? "Try reupload audio"
                              : item.recording_status === "Completed"
                              ? "View Results"
                              : "Processing, please wait"
                          }
                        >
                          <div className="relative">
                            <span
                              className={`text-sm font-medium  ${
                                activeItem === item.id
                                  ? "text-gray-100 font-semibold"
                                  : "hover:text-gray-200"
                              }`}
                            >
                              {item.recordingname
                                .split("/")
                                .pop()
                                ?.replace(/\.[^/.]+$/, "")}
                            </span>
                            <div className="flex justify-between items-center text-xs text-gray-400">
                              <span>
                                {new Date(
                                  item.timestamp + " UTC"
                                ).toLocaleDateString("en-US", {
                                  month: "short",
                                  day: "numeric",
                                  year: "numeric",
                                })}
                              </span>

                              <span>
                                {new Date(
                                  item.timestamp + " UTC"
                                ).toLocaleString("en-US", {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                  hour12: true,
                                })}
                              </span>
                            </div>

                            {item.recording_status === "Failed" && (
                              <>
                                <div className="text-xs text-red-500 font-medium absolute bottom-[-13px] left-0">
                                  Failed!
                                </div>
                              </>
                            )}

                            {item.recording_status === "Pending" && (
                              <div className="relative w-full mt-2">
                                <div className="w-[90%] bg-gray-600 rounded h-1">
                                  <div
                                    className="bg-green-500 h-1 rounded"
                                    style={{ width: "70%" }} // Controls the progress width, 70% will fill the bar up to 70%
                                  ></div>
                                </div>
                              </div>
                            )}
                          </div>
                        </Tooltip>
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
        </>
      )}
    </>
  );
}
