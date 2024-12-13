import type { NextConfig } from "next";
const withLess = require("next-with-less");

const nextConfig: NextConfig = {
  reactStrictMode: true,
  transpilePackages: [
    "antd",
    "@ant-design",
    "rc-util",
    "rc-pagination",
    "rc-picker",
    "rc-notification",
    "rc-tooltip",
    "rc-tree",
    "rc-table",
  ],
  experimental: {
    serverActions: {
      bodySizeLimit: "100mb",
    },
  },
};

module.exports = withLess({
  ...nextConfig,
  lessLoaderOptions: {
    lessOptions: {
      modifyVars: {
        "@primary-color": "#000000", // Orange primary color
        "@text-color": "#FFFFFF", // White text color
        "@background-color": "#000000", // Black background
        "@link-color": "#FFA500", // Orange link color
        "@layout-body-background": "#1A1A1A", // Darker black background
        "@border-color-base": "#FFA500", // Orange border color
      },
      javascriptEnabled: true, // Allow JavaScript in Less files
    },
  },
});
