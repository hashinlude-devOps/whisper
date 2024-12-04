"use client";

import React from "react";
import { AudioOutlined } from "@ant-design/icons";

export default function History({
  history,
  isMenuOpen,
  setIsMenuOpen,
}: {
  history: any[];
  isMenuOpen: boolean;
  setIsMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
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
            {history.length > 0 ? (
              <ul className="space-y-2 p-4">
                {history.map((item) => (
                  <li key={item.id} className="flex flex-col space-y-1 p-2">
                    <a
                      href={item.audio_file}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-400 hover:underline text-sm"
                    >
                      <span className="text-gray-300 text-sm hover:text-gray-200 font-medium">
                        {item.audio_file.split("/").pop()}
                      </span>
                    </a>
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
