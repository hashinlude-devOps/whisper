import React from "react";
import History from "@/components/History";
import Header from "@/components/Header";
import SidebarProviderWrapper from "@/components/SidebarProviderWrapper";
import ProtectedPage from "@/context/ProtectedPage";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <ProtectedPage />
      <SidebarProviderWrapper>
        <div className="flex h-screen">
          {/* Sidebar/History */}
          <History />

          {/* Main Content */}
          <div className="flex-1 flex flex-col overflow-hidden">
            <Header />
            <main className="flex-1 h-[calc(100vh-4rem)] bg-black-3 ">
              {children}
            </main>
          </div>
        </div>{" "}
      </SidebarProviderWrapper>
    </>
  );
}
