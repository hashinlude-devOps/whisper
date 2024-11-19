import type { Metadata } from "next";
import localFont from "next/font/local";
import { Inter } from "next/font/google";
import "./globals.css";
import { AntdRegistry } from "@ant-design/nextjs-registry";

// export const metadata: Metadata = {
//   title: "WHISPER",
//   description: "WHISPER",
// };

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({ children }: any) {
  return (
    <html lang="en">
      <body className={inter.className} suppressHydrationWarning>
        <main>
          <AntdRegistry>{children}</AntdRegistry>
        </main>
      </body>
    </html>
  );
}
