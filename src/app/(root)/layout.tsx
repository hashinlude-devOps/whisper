import React from "react";
import AudioProviderWrapper from "@/components/AudioProviderWrapper";
import History from "@/components/History";
import Header from "@/components/Header";
import SidebarProviderWrapper from "@/components/SidebarProviderWrapper";

export default function RootLayout({ children }: { children: React.ReactNode }) {

  
  return (
    <SidebarProviderWrapper>
      <AudioProviderWrapper>
        <div className="flex h-screen">
          {/* Sidebar/History */}
          <History />

          {/* Main Content */}
          <div className="flex-1 flex flex-col overflow-hidden">
            <Header />
            <main className="flex-1 h-[calc(100vh-4rem)]">{children}</main>
          </div>
        </div>
      </AudioProviderWrapper>
    </SidebarProviderWrapper>
  );
}
