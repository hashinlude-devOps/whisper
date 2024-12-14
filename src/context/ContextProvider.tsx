import React, { createContext, useContext, useState, useEffect } from "react";

const Context = createContext<any>(null);

export const useSidebar = () => useContext(Context);

export const ContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(true);
  const [refreshKey, setRefreshKey] = useState(0);
  const [activeItem, setActiveItem] = useState<number | null>(null);
  const [resetKey, setResetKey] = useState(0);

  const checkScreenSize = () => {
    if (window.innerWidth <1025) {
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
    <Context.Provider
      value={{
        isMenuOpen,
        setIsMenuOpen,
        refreshHistory,
        refreshKey,
        activeItem,
        setActiveItem,
        resetKey,
        setResetKey,
      }}
    >
      {children}
    </Context.Provider>
  );
};
