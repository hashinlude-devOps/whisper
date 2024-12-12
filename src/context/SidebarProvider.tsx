import React, { createContext, useContext, useState, useEffect } from "react";

const SidebarContext = createContext<any>(null);

export const useSidebar = () => useContext(SidebarContext);

export const SidebarProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(true);
  const [refreshKey, setRefreshKey] = useState(0);
  const [activeItem, setActiveItem] = useState<number | null>(null);

  const checkScreenSize = () => {
    if (window.innerWidth < 768) {
      setIsMenuOpen(false);
    } else {
      setIsMenuOpen(true);
    }
  };

  const refreshHistory = () => {
    setRefreshKey((prev) => prev + 1); // Increment key to trigger a refresh
  };

  useEffect(() => {
    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);

    return () => {
      window.removeEventListener("resize", checkScreenSize);
    };
  }, []);

  return (
    <SidebarContext.Provider
      value={{
        isMenuOpen,
        setIsMenuOpen,
        refreshHistory,
        refreshKey,
        activeItem,
        setActiveItem, 
      }}
    >
      {children}
    </SidebarContext.Provider>
  );
};
