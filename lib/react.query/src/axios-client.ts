import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";
import { getSession } from "next-auth/react";
import { deleteCookie, getCookie, setCookie } from "cookies-next";
// import { useSession } from "next-auth";
import { useSession } from "next-auth/react";

// import { getSession } from 'next-auth/react';

import config from "../../confiq";

const configuration = config();
const baseUrl = `${configuration.apiBaseUrl}/`;

const client = axios.create({
  baseURL: baseUrl,
  timeout: 10000,

  headers: {
    "X-Custom-Header": "foobar",
    ln: "en",
  },
});

export const axiosClient = async <T>(options: AxiosRequestConfig) => {
  const instance = axios.create();

  // const refreshtoken = async () => {
  //   const token =
  //     localStorage.getItem('refreshToken') ?? getCookie('refreshToken');

  //   const data = JSON.stringify({
  //     refreshToken: token,
  //   });

  //   const config = {
  //     method: 'post',
  //     url: `${configuration.apiBaseUrl}/auth/v1/refresh`,
  //     headers: {
  //       'Content-Type': 'application/json',
  //     },
  //     data: data,
  //   };

  //   try {
  //     const response = await axios(config);
  //     if (getCookie('isRemember') === 'true') {
  //       setCookie('token', response?.data.tokens.accessToken);
  //       setCookie('refreshToken', response?.data.tokens.refreshToken);
  //     } else {
  //       localStorage.setItem('token', response?.data.tokens.accessToken);
  //       localStorage.setItem(
  //         'refreshToken',
  //         response?.data.tokens.refreshToken
  //       );
  //     }
  //     return response?.data;
  //   } catch (error) {
  //     deleteCookie('token');
  //     deleteCookie('id');
  //     deleteCookie('refreshToken');
  //     setCookie('status', 'unauthenticated');
  //     deleteCookie('type');
  //     deleteCookie('name');
  //     localStorage.clear();
  //     throw error;
  //   }
  // };

  // const tokenError = [
  //   'THERE_WAS_AN_ERROR_IN_AUTHORIZING_USER',
  //   'NO_PERMISSION',
  //   'NO_CREDENTIALS_SENT',
  //   'TOKEN_EXPIRED',
  //   'INVALID_TOKEN',
  // ];

  client.defaults.method = options?.method;
  client.defaults.data = options?.data;
  client.defaults.params = options?.params;

  const refreshToken = getCookie("refreshToken");

  // Attach access token to header
  const session = await getSession();

  //   if (session) {
  //     client.defaults.headers.Authorization = `Bearer ${session.tokens.accessToken}`;
  //   }

  const onSuccess = (success: AxiosResponse<T>) => {
    return success;
  };

  const onError = async (error: any) => {
    // if (!axios.isAxiosError(error)) return Promise.reject(error);

    // // Access to config, request, and response

    const originalRequest: any = error.response?.config;

    // if (
    //   originalRequest != undefined &&
    //   error?.response?.status === 401 &&
    //   tokenError.includes(error.response?.data?.message) &&
    //   !originalRequest._retry
    // ) {
    //   originalRequest._retry = true;
    //   const response = await refreshtoken();
    //   if (response === null) return Promise.reject(error);

    //   originalRequest.headers['Authorization'] =
    //     'Bearer ' + response.tokens.accessToken;
    //   setAuthHeaderForReq(originalRequest);
    //   return client(originalRequest);
    // } else {
    //   return Promise.reject(error);
    // }

    // if (error?.status === 401) {
    //   console.log(session?.tokens?.refreshToken, "error");
    //   const response = await axios.post(
    //     `${process.env.NEXT_PUBLIC_URL}/auth/v1/refresh`,
    //     {
    //       refreshToken: session?.tokens?.refreshToken,
    //     }
    //   );

    //   client.defaults.headers.Authorization = `Bearer ${response?.data.tokens?.accessToken}`;
    // }

    // instance.interceptors.response.use(
    //   (response) => {
    //     return response;
    //   },
    //   (error) => {
    //     const response: any = axios.post(
    //       `${process.env.NEXT_PUBLIC_URL}/auth/v1/refresh`,
    //       {
    //         refreshToken: session?.tokens?.refreshToken,
    //       }
    //     );

    //     return (client.defaults.headers.Authorization = `Bearer ${response?.data.tokens?.accessToken}`);
    //   }
    // );

    // if (error?.status === 401) {
    //   console.log(session?.tokens?.refreshToken, "error");

    //   const api = axios.create({
    //     baseURL: process.env.NEXT_PUBLIC_API_URL, // Your API URL
    //   });

    //   const response = await axios.post(
    //     `${process.env.NEXT_PUBLIC_URL}/auth/v1/refresh`,
    //     {
    //       refreshToken: session?.tokens?.refreshToken,
    //     }
    //   );

    //   console.log(session?.tokens?.refreshToken, "refreshToken error");
    //   console.log(response?.data.tokens?.accessToken, "accessToken error");

    //   // return setAuthHeaderForReq(
    //   //   `Bearer ${response?.data.tokens?.accessToken}`
    //   // );

    //   return (
    //     (api.defaults.headers.common[
    //       "Authorization"
    //     ] = `Bearer ${response?.data.tokens?.accessToken}`),
    //     (originalRequest.headers[
    //       "Authorization"
    //     ] = `Bearer ${response?.data.tokens?.accessToken}`)
    //   );

    //   // setAuthHeaderForReq(originalRequest);

    //   // return client(originalRequest);
    // } else {
    //   return Promise.reject(error);
    // }
  };

  return client(options).then(onSuccess, onError);
};

export const setAuthHeaderForReq = (token: any) => {
  axios.defaults.headers.common["Authorization"] = "Bearer " + token;
};
