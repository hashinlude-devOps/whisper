import React, { createContext, useContext, useState } from "react";

// Create the context
const SidebarContext = createContext<any>(null);

export const useSidebar = () => useContext(SidebarContext);

// SidebarProvider component to wrap around your app
export const SidebarProvider = ({ children }: { children: React.ReactNode }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <SidebarContext.Provider value={{ isMenuOpen, setIsMenuOpen }}>
      {children}
    </SidebarContext.Provider>
  );
};
