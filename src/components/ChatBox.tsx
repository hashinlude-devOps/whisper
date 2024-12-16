"use client";

import { useSidebar } from "@/context/ContextProvider";
import {
  getEmbeddingStatus,
  globalSearch,
  querySearch,
} from "@/lib/services/audioService";
import React, { useEffect, useRef, useState } from "react";

const ChatBox: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"all" | "current">("current");
  const [isSending, setIsSending] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  const switchTab = (tab: "all" | "current") => {
    setActiveTab(tab);
  };

  const { currentMeetingId, embeddingStatusKey } = useSidebar();
  const [embeddingStatus, setEmbeddingStatus] = useState<string | null>(null);
  const chatboxRef = useRef<HTMLDivElement>(null);

  const [currentMessages, setCurrentMessages] = useState<string[]>([]);
  const [allMessages, setAllMessages] = useState<string[]>([]);
  const [inputMessage, setInputMessage] = useState<string>("");

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    // Scroll to the bottom when messages change
    if (chatboxRef.current) {
      chatboxRef.current.scrollTop = chatboxRef.current.scrollHeight;
    }
  }, [currentMessages, allMessages]);

  useEffect(() => {
    const fetchEmbeddingStatus = async () => {
      if (currentMeetingId !== null) {
        try {
          const response = await getEmbeddingStatus(currentMeetingId);
          const status = response?.data?.embedding_status;
          setEmbeddingStatus(status);
          if (status === "Completed") {
            setActiveTab("current");
          } else {
            setActiveTab("all");
          }
        } catch (error) {
          // console.error("Error fetching embedding status:", error);
          setActiveTab("all");
        }
      } else {
        setActiveTab("all");
      }
    };

    fetchEmbeddingStatus();
  }, [embeddingStatusKey, currentMeetingId]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;
    setIsSending(true);
    setInputMessage("");
    const query = inputMessage;
    // Add the user's message to the appropriate tab
    if (activeTab === "current") {
      setCurrentMessages([...currentMessages, query]);
    } else if (activeTab === "all") {
      setAllMessages([...allMessages, query]);
    }
    setIsTyping(true);
    try {
      let response;
      if (activeTab === "current" && currentMeetingId) {
        response = await querySearch(query, currentMeetingId);
      } else if (activeTab === "all") {
        response = await globalSearch(query);
      }

      if (response && response.data?.answer) {
        if (activeTab === "current") {
          setCurrentMessages((prevMessages) => [
            ...prevMessages,
            response.data.answer,
          ]);
        } else if (activeTab === "all") {
          setAllMessages((prevMessages) => [
            ...prevMessages,
            response.data.answer,
          ]);
        }
      } else {
        const defaultAnswer =
          "Sorry, something went wrong. Please try again later.";
        if (activeTab === "current") {
          setCurrentMessages((prevMessages) => [
            ...prevMessages,
            defaultAnswer,
          ]);
        } else if (activeTab === "all") {
          setAllMessages((prevMessages) => [...prevMessages, defaultAnswer]);
        }
      }
      setIsTyping(false);
      setIsSending(false);
    } catch (error) {
      const defaultAnswer =
        "Sorry, something went wrong. Please try again later.";
      if (activeTab === "current") {
        setCurrentMessages((prevMessages) => [...prevMessages, defaultAnswer]);
      } else if (activeTab === "all") {
        setAllMessages((prevMessages) => [...prevMessages, defaultAnswer]);
      }
      setIsSending(false);
      setIsTyping(false);
    }
  };

  return (
    <>
      {/* Chat Icon - Only show when the chatbox is closed */}
      {!isOpen && (
        <button
          onClick={toggleChat}
          className="z-20 text-white-1 flex flex-col shrink-0 grow-0 justify-around 
            fixed bottom-0 right-0 mb-5 mr-2 rounded-lg"
        >
          <div className="p-1 rounded-full border-4 border-white bg-blue-600">
            <svg
              className="w-8 h-8 lg:w-9 lg:h-9 xl:w-10 xl:h-10"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z"
                clipRule="evenodd"
              ></path>
            </svg>
          </div>
        </button>
      )}

      {/* Chat Box */}
      {isOpen && (
        <div
          id="chat-container"
          className="fixed bottom-4 right-4 w-96 sm:max-w-full xs:max-w-full md:max-w-96 lg:max-w-lg max-w-xs bg-black-2 shadow-md rounded-lg"
        >
          <div className="p-4 border-b bg-blue-500 text-white-1 rounded-t-lg flex justify-between items-center">
            <p className="text-lg font-semibold">Whisper Bot</p>
            <button
              onClick={toggleChat}
              className="text-white-1 hover:text-gray-400 focus:outline-none focus:text-gray-400"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-6 h-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                ></path>
              </svg>
            </button>
          </div>

          {/* Tab Navigation */}
          <div className="flex items-center justify-center bg-black-1 rounded-md px-2 py-2 shadow-sm hover:shadow-md transition-shadow cursor-pointer gap-2">
            <button
              disabled={embeddingStatus !== "Completed" || !currentMeetingId}
              className={`flex-1 py-2 text-center bg-black-2  rounded-md text-sm  ${
                activeTab === "current" ? "text-blue-500" : "text-gray-400"
              } ${
                embeddingStatus === "Completed" && currentMeetingId
                  ? "cursor-pointer"
                  : "cursor-not-allowed text-gray-500"
              }`}
              onClick={() =>
                embeddingStatus === "Completed" &&
                currentMeetingId &&
                switchTab("current")
              }
            >
              Current
            </button>
            <button
              className={`flex-1 py-2 text-center bg-black-2 rounded-md text-sm cursor-pointer ${
                activeTab === "all" ? "text-blue-500" : "text-gray-400"
              }`}
              onClick={() => switchTab("all")}
            >
              All Recording
            </button>
          </div>

          <div
            id="chatbox"
            className="p-4 h-96 overflow-y-auto hide-scrollable"
            ref={chatboxRef}
          >
            {activeTab === "current" &&
              currentMessages.map((message, index) => {
                // Check if this is the user message
                const isUserMessage = index % 2 === 0;

                return (
                  <div
                    key={index}
                    className={`mb-2 ${
                      isUserMessage
                        ? "text-right user-message"
                        : "other-message"
                    }`}
                  >
                    <p
                      className={`${
                        isUserMessage
                          ? "bg-blue-500 text-white-1"
                          : "bg-gray-200 text-gray-700"
                      } rounded-lg py-2 px-4 inline-block max-w-[90%]`}
                    >
                      {message}
                    </p>
                  </div>
                );
              })}

            {activeTab === "all" &&
              allMessages.map((message, index) => {
                const isUserMessage = index % 2 === 0;

                return (
                  <div
                    key={index}
                    className={`mb-2 ${
                      isUserMessage
                        ? "text-right user-message"
                        : "other-message"
                    }`}
                  >
                    <p
                      className={`${
                        isUserMessage
                          ? "bg-blue-500 text-white-1"
                          : "bg-gray-200 text-gray-700"
                      } rounded-lg py-2 px-4 inline-block max-w-[90%]`}
                    >
                      {message}
                    </p>
                  </div>
                );
              })}

            {isTyping && (
              <div className="mb-1 text-left other-message ">
                <p className="bg-gray-200 text-gray-700 rounded-lg py-1 px-2 inline-block max-w-[90%]">
                  <span className="inline-block w-2 h-2 bg-gray-600 rounded-full animate-bounce delay-75 mr-1"></span>
                  <span className="inline-block w-2 h-2 bg-gray-600 rounded-full animate-bounce delay-150 mr-1"></span>
                  <span className="inline-block w-2 h-2 bg-gray-600 rounded-full animate-bounce delay-300"></span>
                </p>
              </div>
            )}
          </div>

          <div className="p-4 border-t flex">
            <input
              id="user-input"
              type="text"
              placeholder="Type a message"
              className="w-full px-3 py-2 border  bg-gray-100 rounded-l-md text-gray-700 focus:outline-none "
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !isSending) {
                  handleSendMessage();
                  e.preventDefault();
                }
              }}
              autoComplete="off"
            />
            <button
              id="send-button"
              className={`bg-blue-500 text-white-1 px-4 py-2 rounded-r-md transition duration-300 ${
                isSending
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:bg-blue-600"
              }`}
              onClick={handleSendMessage}
              disabled={isSending}
            >
              Send
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatBox;

{
  /* {activeTab === "all" && (
              <div className="flex flex-col items-center justify-center h-full">
                <img
                  src="/progress.png" // Replace with your icon or animation path
                  alt="Upcoming Feature"
                  className="w-24 h-24 mb-4"
                />
                <p className="text-gray-500 text-center text-sm">
                  This feature is coming soon! Stay tuned!
                </p>
              </div>
            ) } */
}
