import type { Metadata } from "next";
import localFont from "next/font/local";
import { Inter } from "next/font/google";
import "./globals.css";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import { Toaster } from "react-hot-toast";

export const metadata: Metadata = {
  title: "WHISPER",
  description: "WHISPER",
  icons: {
    icon: '/icons/logo.png'
  }
};

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({ children }: any) {
  return (
    <html lang="en">
      <body className={inter.className} suppressHydrationWarning>
        <main>
          <AntdRegistry><Toaster position="bottom-right" />{children}</AntdRegistry>
        </main>
      </body>
    </html>
  );
}
