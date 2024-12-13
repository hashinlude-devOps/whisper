// src/types/next-auth.d.ts
import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    accessToken?: string; // Add accessToken to the session
  }

  interface User {
    access_token?: string; // Add access_token to the user
  }

  interface JWT {
    accessToken?: string; // Add accessToken to the JWT
  }
}
