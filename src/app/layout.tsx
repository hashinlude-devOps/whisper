import type { Metadata } from "next";
import localFont from "next/font/local";
import { Inter } from "next/font/google";
import "./globals.css";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import Layout from "@/components/Layout";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  title: "WHISPER",
  description: "WHISPER",
};

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({ children }: any) {
  return (
    <html lang="en">
      <body>
        <main>
          <AntdRegistry>
            <Layout>{children}</Layout>
          </AntdRegistry>
          <Toaster />
        </main>
      </body>
    </html>
  );
}
