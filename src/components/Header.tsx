"use client";

import React, { useState, useEffect } from "react";
import { UserIcon, CogIcon, ArrowRightIcon } from "@heroicons/react/20/solid";
import { useRouter } from "next/navigation";
import { useSidebar } from "@/context/SidebarProvider";

export default function Header() {
  const router = useRouter();
  const { isMenuOpen } = useSidebar(); // Access sidebar context
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [userInitial, setUserInitial] = useState<string>("A");

  useEffect(() => {
    // This will run only in the browser after the component has mounted
    const name = localStorage.getItem("name");
    if (name) {
      setUserInitial(name.charAt(0).toUpperCase());
    }
  }, []);

  const logout = async () => {
    try {
      localStorage.removeItem("access_token");
      localStorage.removeItem("name");
      router.push("/sign-in");
    } catch (error: any) {
      error;
    }
  };

  return (
    <header className="h-16 bg-white flex items-center px-4  justify-between">
      {/* Profile Icon */}
      <div className="relative ml-auto mt-3">
        {/* Use ml-auto for right alignment */}
        <button
          className="w-10 h-10 flex items-center justify-center bg-gray-800 text-white rounded-full focus:outline-none"
          onClick={() => setDropdownOpen(!dropdownOpen)}
        >
          {userInitial}
        </button>
        {/* Dropdown Menu */}
        {dropdownOpen && (
          <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-300 rounded shadow-lg">
            <ul className="py-1">
              <li
                className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer relative flex items-center space-x-2"
                onClick={logout}
              >
                <UserIcon className="h-5 w-5 text-gray-700" />
                <span>Profile</span>
              </li>
              <li
                className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer relative flex items-center space-x-2"
                onClick={logout}
              >
                <CogIcon className="h-5 w-5 text-gray-700" />
                <span>Settings</span>
              </li>
              <li
                className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer relative flex items-center space-x-2"
                onClick={logout}
              >
                <ArrowRightIcon className="h-5 w-5 text-gray-700" />
                <span>Logout</span>
              </li>
            </ul>
          </div>
        )}
      </div>
    </header>
  );
}
