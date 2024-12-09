import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ConfigProvider, ThemeConfig } from "antd"; // Ant Design's ConfigProvider and ThemeConfig
import { AntdRegistry } from "@ant-design/nextjs-registry";
import { Toaster } from "react-hot-toast";

export const metadata: Metadata = {
  title: "WHISPER",
  description: "WHISPER",
  icons: {
    icon: "/icons/logo.png",
  },
};

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({ children }: any) {
  const themeConfig: ThemeConfig = {
    token: {
      colorPrimary: "#000000", // Orange primary color (example customization)
      colorTextBase: "#FFFFFF", // White text
      colorBgBase: "#000000", // Black background
      colorLink: "#1E90FF",     // Blue color for links (this will apply for hover as well)
      colorBorder: "#FFFFFF",
    },
    cssVar: true, // Enable CSS variables for theme management
  };

  return (
    <html lang="en">
      <body className={inter.className} suppressHydrationWarning>
        <main>
          <AntdRegistry>
            <ConfigProvider theme={themeConfig}>
              {/* Apply the custom theme to Ant Design components */}
              <Toaster position="bottom-right" />
              {children}
            </ConfigProvider>
          </AntdRegistry>
        </main>
      </body>
    </html>
  );
}
