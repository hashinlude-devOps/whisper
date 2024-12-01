// src/app/api/auth/[...nextauth]/route.ts
"use server";

import NextAuth, { Session } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import axios from "axios";
import { setCookie } from "cookies-next";

async function refreshAccessToken(token: any) {
  try {
    const url = `${process.env.NEXT_PUBLIC_URL}/auth/v1/refresh`;

    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      method: "POST",
    });

    const refreshedTokens = await response.json();

    if (!response.ok) {
      throw refreshedTokens;
    }

    return {
      ...token,
      accessToken: refreshedTokens.accessToken,
      // accessTokenExpires: Date.now() + refreshedTokens.expires_in * 1000,
      refreshToken: refreshedTokens.refreshToken, // Fall back to old refresh token
    };
  } catch (error) {
    console.log(error);

    return {
      ...token,
      error: "RefreshAccessTokenError",
    };
  }
}

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      type: "credentials",
      credentials: {
        email: { label: "email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        const response = await axios.post(`http://44.223.235.101:5000/login`, {
          email: credentials?.email,
          password: credentials?.password,
        });

        console.log(credentials?.email, "-- response -- response --");

        if (response.status === 200) {
          setCookie("refreshToken", response.data.tokens.refreshToken);
          const user = {
            id: response.data.data.id,
            name: response.data.data.name,
            accessToken: response.data.tokens.accessToken,
            refreshToken: response.data.tokens.refreshToken,
          };
          return user;
        } else if (response?.status === 401) {
          const responseRef: any = axios.post(
            `${process.env.NEXT_PUBLIC_URL}/auth/v1/refresh`,
            {
              refreshToken: response.data.tokens.refreshToken,
            }
          );

          const user = {
            id: response.data.data.id,
            name: response.data.data.name,
            role: response.data.data.role,
            accessToken: responseRef.data.tokens.accessToken,
            refreshToken: responseRef.data.tokens.refreshToken,
          };

          return user;
        } else {
          return null;
        }
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET, // Ensure this is set in your .env file

  // session: {
  //   maxAge: 6 * 60 * 60,
  // },

  // jwt: {
  //   maxAge: 6 * 60 * 60,
  // },

  pages: {
    signIn: "/login",
  },
  callbacks: {
    jwt: async ({ token, user }: { token: any; user: any }) => {
      if (user) {
        return {
          accessToken: user.accessToken,
          refreshToken: user.refreshToken,
          // id: user.id,
          // name: user.name,
          // emai: user.role,
        };
      } else if (token) {
        return token;
      }

      // return refreshAccessToken(token);
    },

    session: async ({ session, token }: { session: Session; token: any }) => {
      if (token) {
        const user = {
          id: token.id,
          email: token?.name,
        };
        session.user = user;
        // session.tokens = {
        //   accessToken: token.accessToken,
        //   refreshToken: token.refreshToken,
        // };
      }

      return session;
    },
  },
});

export { handler as GET, handler as POST };
