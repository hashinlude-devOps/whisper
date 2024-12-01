interface IConfig {
  apiBaseUrl: string;
  apiPathPrefix: string;
}

const config = (): IConfig => {
  switch (process.env["NODE_ENV"]) {
    case "production":
      return {
        apiBaseUrl: `${process.env["NEXT_PUBLIC_URL"]}`,
        apiPathPrefix: "api",
      };
    case "development":
      return {
        apiBaseUrl: `${process.env["NEXT_PUBLIC_URL"]}`,
        apiPathPrefix: "api",
      };
    default:
      return {
        apiBaseUrl: "http://localhost:8000",
        apiPathPrefix: "api",
      };
  }
};

export default config;
