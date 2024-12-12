"use client"; // Mark this file as a client component

import React from "react";
import { SidebarProvider } from "@/context/SidebarProvider";

// Wrapper component to make sure AudioProvider is only used in client components
const SidebarProviderWrapper: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return <SidebarProvider>{children}</SidebarProvider>;
};

export default SidebarProviderWrapper;
