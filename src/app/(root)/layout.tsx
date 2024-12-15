import React from "react";
import History from "@/components/History";
import Header from "@/components/Header";
import SidebarProviderWrapper from "@/components/ContextProviderWrapper";
import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import ProtectedPage from "@/context/ProtectedPage";
import ChatBox from "@/components/ChatBox";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session) {
    // If no session exists, redirect to the sign-in page
    redirect("/sign-in");
  }
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
        </div>
         {/* Chat Box */}
         <ChatBox />
      </SidebarProviderWrapper>
    </>
  );
}
