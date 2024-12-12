import React, { createContext, useContext, useState, useEffect } from "react";

const SidebarContext = createContext<any>(null);

export const useSidebar = () => useContext(SidebarContext);

export const SidebarProvider = ({ children }: { children: React.ReactNode }) => {
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(true);

  const checkScreenSize = () => {
    if (window.innerWidth < 768) {
      setIsMenuOpen(false); 
    } else {
      setIsMenuOpen(true); 
    }
  };

  useEffect(() => {
    checkScreenSize();

    window.addEventListener("resize", checkScreenSize);

    return () => {
      window.removeEventListener("resize", checkScreenSize);
    };
  }, []);

  return (
    <SidebarContext.Provider value={{ isMenuOpen, setIsMenuOpen }}>
      {children}
    </SidebarContext.Provider>
  );
};
