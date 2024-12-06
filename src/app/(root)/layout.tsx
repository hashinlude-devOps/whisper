"use client";
import React, { useState } from "react";
import History from "@/components/History";
import Header from "@/components/Header";
import { AudioProvider } from "@/context/AudioContext";
import { redirect } from "next/navigation";
import { getLoggedInUser } from "@/lib/action";


export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isMenuOpen, setIsMenuOpen] = useState(true);
  const loggedIn = await getLoggedInUser();

  if(!loggedIn) redirect('/sign-in')

  return (
    <AudioProvider> 

    <div className="flex h-screen">
      {/* Sidebar/History */}
      <History isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />

      {/* Main Content */}
      <div
        className={`flex-1 flex flex-col overflow-hidden transition-all duration-500 ease-in-out ${
          isMenuOpen ? "md:ml-64" : "md:ml-0"
        } sm:ml-0 `}
      >
        <Header isMenuOpen={isMenuOpen} />
        <main className="flex-1 h-[calc(100vh-4rem)]  mt-4">
          {children}
        </main>
      </div>
    </div>
    </AudioProvider>

  );
}
