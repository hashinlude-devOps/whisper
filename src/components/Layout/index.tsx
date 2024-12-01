"use client";

import React, { useEffect } from "react";
import { SessionProvider } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Image from "next/image";

import Loading from "@/components/svg/loading.svg";

import Login from "../../app/page";

interface Props {
  children: React.ReactNode;
}

export default function Layout({ children, ...delegated }: Props) {
  return (
    <div className="h-screen" {...delegated}>
      <SessionProvider>
        <AuthLayout>{children}</AuthLayout>
      </SessionProvider>
    </div>
  );
}

const AuthLayout = ({ children }: Props) => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  console.log(session, "Njan ivide thane inde");

  React.useEffect(() => {
    if (session === null) {
      router.push("/login");
    }
  }, [status, router, pathname]);

  if (status === "loading") {
    return (
      <div className="flex flex-col justify-center items-center h-screen">
        <Image src={Loading} alt="" />
        <div className="font-bold text-[24px] animate-bounce">Loading..</div>
      </div>
    );
  }

  // if (session) {
  //   return <>{children}</>;
  // }

  return children;
};
