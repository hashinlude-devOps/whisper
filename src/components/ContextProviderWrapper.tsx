"use client"; 

import React from "react";
import { ContextProvider } from "@/context/ContextProvider";

const ContextProviderWrapper: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return <ContextProvider>{children}</ContextProvider>;
};

export default ContextProviderWrapper;
