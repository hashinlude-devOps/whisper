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
      console.log(error);
    }
  };

  return (
    <header className="h-16 bg-black-3 flex items-center px-4 border-b border-gray-700 justify-between sticky top-0 z-10">
      {/* Profile Icon */}
      <div className="relative ml-auto ">
        {/* Use ml-auto for right alignment */}
        <button
          className="w-10 h-10 flex items-center justify-center bg-[#C4245C] text-white-1 rounded-full focus:outline-none"
          onClick={() => setDropdownOpen(!dropdownOpen)}
        >
          {userInitial}
        </button>
        {/* Dropdown Menu */}
        {dropdownOpen && (
          <div className="absolute right-0 mt-2 w-48 text-white-1 border bg-black-1 border-gray-300 rounded shadow-lg">
            <ul className="py-1">
              <li
                className="px-4 py-2 text-sm text-white-1 hover:bg-black-2 cursor-pointer relative flex items-center space-x-2"
                onClick={logout}
              >
                <UserIcon className="h-5 w-5 text-white-1" />
                <span>Profile</span>
              </li>
              <li
                className="px-4 py-2 text-sm text-white-1 hover:bg-black-2 cursor-pointer relative flex items-center space-x-2"
                onClick={logout}
              >
                <CogIcon className="h-5 w-5 text-white-1" />
                <span>Settings</span>
              </li>
              <li
                className="px-4 py-2 text-sm text-white-1 hover:bg-black-2 cursor-pointer relative flex items-center space-x-2"
                onClick={logout}
              >
                <ArrowRightIcon className="h-5 w-5 text-white-1" />
                <span>Logout</span>
              </li>
            </ul>
          </div>
        )}
      </div>
    </header>
  );
}
