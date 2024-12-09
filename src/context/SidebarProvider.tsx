import React, { createContext, useContext, useState, useEffect } from "react";

// Create the context
const SidebarContext = createContext<any>(null);

export const useSidebar = () => useContext(SidebarContext);

// SidebarProvider component to wrap around your app
export const SidebarProvider = ({ children }: { children: React.ReactNode }) => {
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(true);

  // Function to check screen size and set initial state
  const checkScreenSize = () => {
    if (window.innerWidth < 768) {
      setIsMenuOpen(false); // Close the menu on small screens by default
    } else {
      setIsMenuOpen(true); // Keep the menu open on larger screens by default
    }
  };

  useEffect(() => {
    // Check screen size on initial load
    checkScreenSize();

    // Add resize event listener to update menu state when screen size changes
    window.addEventListener("resize", checkScreenSize);

    // Clean up the event listener on component unmount
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
