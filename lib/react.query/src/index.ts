import {
  useMutation,
  UseMutationResult,
  useQuery,
} from "@tanstack/react-query";
import { AxiosError, AxiosResponse } from "axios";

// import {
//   UseQueryOptions,
//   UseQueryResult,
// } from "../../../utils/types/react-query.types";

import {
  UseQueryOptions,
  UseQueryResult,
} from "../../../utils/types/react-query.types";

import { axiosClient as request } from "./axios-client";

export function useCustomQuery<T>(
  queryKey: any[],
  url: string,
  options?: Omit<
    UseQueryOptions<any, any, any, any>,
    "queryKey" | "queryFn" | "initialData"
  > & { initialData?: () => undefined },
  params?: any
): UseQueryResult<AxiosResponse<T>> {
  const queryFn = async () => request<T>({ url, ...params });
  return useQuery({
    queryKey,
    queryFn,
    ...options,
    retry: (failureCount, error: AxiosError) => {
      if (error?.response?.status === 403) return false;
      return true;
    },
  });
}

export function useCustomQueryV2<T>(
  queryKey: any[],
  url: string,
  options?: Omit<
    UseQueryOptions<any, any, any, any>,
    "queryKey" | "queryFn" | "initialData"
  > & { initialData?: () => undefined },
  params?: any
): UseQueryResult<T> {
  const queryFn = async () => {
    const data: any = await request<T>({ url, ...params });
    return data?.data;
  };
  return useQuery({ queryKey, queryFn, ...options });
}

export function useCustomMutation<T>(
  url: string,
  method: Method,
  data?: any,
  options?: any
): UseMutationResult<AxiosResponse<T> | undefined> {
  const queryFn = async () => request<T>({ url, method, data });

  return useMutation({ queryFn, ...options });
}

export function useCustomMutationV2<T>(
  url: string,
  method: Method,
  options?: any
): UseMutationResult<AxiosResponse<T> | undefined> {
  const queryFn = async (mutateData: any) =>
    request<T>({ url, method, data: mutateData });

  return useMutation({
    mutationFn: (mutateData) => queryFn(mutateData),
    ...options,
  });
}

export function useCustomDelete<T>(
  url: string,
  method: Method,
  options?: any
): UseMutationResult<AxiosResponse<T> | undefined> {
  const queryFn = async (mutateData: any, appendUrl = "") => {
    const completeUrl = url + appendUrl;
    return request<T>({ url: completeUrl, method, data: mutateData });
  };

  return useMutation({
    mutationFn: ({ data, url }: any) => queryFn(data, url),
    ...options,
  });
}

export default useCustomQuery;

export type Method =
  | "get"
  | "GET"
  | "delete"
  | "DELETE"
  | "head"
  | "HEAD"
  | "options"
  | "OPTIONS"
  | "post"
  | "POST"
  | "put"
  | "PUT"
  | "patch"
  | "PATCH"
  | "purge"
  | "PURGE"
  | "link"
  | "LINK"
  | "unlink"
  | "UNLINK";
