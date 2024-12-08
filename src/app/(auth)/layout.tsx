import AuthForm from "@/components/AuthForm";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="relative h-screen w-full overflow-hidden flex flex-col justify-between">
      {/* Hide the logo on small screens and show it on medium screens and up */}
      <p className="text-gray-800 text-[26px] font-bold absolute top-8 left-1/2 transform -translate-x-1/2 md:top-8 md:left-8 md:translate-x-0 md:translate-y-0 hidden md:block">
        WHISPER
      </p>
      {children}
    </main>
  );
}
