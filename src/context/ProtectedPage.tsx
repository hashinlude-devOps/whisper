"use client"; // Mark the component as a client component to use hooks like useEffect

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getLoggedInUser } from "@/lib/services/authService";
import React from "react";

const ProtectedPage: React.FC = () => {
  const router = useRouter();
  const [loggedIn, setLoggedIn] = React.useState<boolean | null>(null); 

  useEffect(() => {
    const checkUserStatus = async () => {

      const user = await getLoggedInUser();

      if (!user) {
        router.push('/sign-in'); 
      }
    };
    checkUserStatus();
  }, [router]);

  

  return <></>;
};

export default ProtectedPage;
