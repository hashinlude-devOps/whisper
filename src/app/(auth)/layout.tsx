"use client"
import AuthForm from "@/components/AuthForm";
import { redirect } from "next/navigation";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const isLoggedIn = typeof window !== "undefined" && localStorage.getItem("isLoggedIn");
  if (isLoggedIn) {
    redirect("/sign-in")
  }
  return (
    <main className="relative h-screen w-full overflow-hidden flex flex-col justify-between bg-black-3">
      {/* Hide the logo on small screens and show it on medium screens and up */}
      <p className="text-white-1 text-[26px] font-bold absolute top-8 left-1/2 transform -translate-x-1/2 md:top-8 md:left-8 md:translate-x-0 md:translate-y-0 hidden md:block">
        WHISPER
      </p>
      {children}
    </main>
  );
}
