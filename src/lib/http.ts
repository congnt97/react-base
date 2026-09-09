import axios from 'axios';
import type { AxiosRequestConfig, InternalAxiosRequestConfig } from 'axios';

import { ApiError } from '@/lib/api-error';
import type { ApiResponse } from '@/lib/api-response';
import {
  clearAuthStorage,
  getStoredAccessToken,
  getStoredRefreshToken,
  notifySessionExpired,
  persistAuthTokens,
  type AuthTokens,
} from '@/lib/auth-storage';
import { env } from '@/lib/env';
import { Endpoints } from '@/lib/endpoints';
import { buildUrl, type QueryParams, type UrlParams } from '@/lib/url';

type RetriableRequestConfig = InternalAxiosRequestConfig & {
  _retry?: boolean;
};

type ErrorResponseBody = {
  error?: string;
  statusCode?: number;
  message?: string | string[];
};

export type HttpRequestOptions = {
  urlParams?: UrlParams;
  queryParams?: QueryParams;
  config?: AxiosRequestConfig;
};

let refreshTokenRequest: Promise<AuthTokens | null> | null = null;

export const axiosInstance = axios.create({
  baseURL: env.VITE_API_BASE_URL,
  timeout: 30_000,
});

axiosInstance.interceptors.request.use((config) => {
  const token = getStoredAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// Gom mọi request 401 đồng thời vào một lần refresh duy nhất.
const refreshAuthTokens = (refreshToken: string) => {
  refreshTokenRequest ??= axiosInstance
    .post<ApiResponse<AuthTokens>>(Endpoints.Auth.REFRESH_TOKEN, {
      refreshToken,
    })
    .then((response) => {
      const tokens = response.data.data ?? response.data.result;

      if (tokens && getStoredRefreshToken() === refreshToken) {
        persistAuthTokens(tokens);
        return tokens;
      }

      return null;
    })
    .catch(() => {
      if (getStoredRefreshToken() === refreshToken) {
        clearAuthStorage();
        notifySessionExpired();
      }
      return null;
    })
    .finally(() => {
      refreshTokenRequest = null;
    });

  return refreshTokenRequest;
};

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error: unknown) => {
    if (!axios.isAxiosError<ErrorResponseBody>(error)) {
      throw error;
    }

    const originalRequest = error.config as RetriableRequestConfig | undefined;
    const refreshToken = getStoredRefreshToken();

    if (
      error.response?.status === 401 &&
      originalRequest &&
      !originalRequest._retry &&
      originalRequest.url !== Endpoints.Auth.REFRESH_TOKEN &&
      refreshToken
    ) {
      originalRequest._retry = true;
      const tokens = await refreshAuthTokens(refreshToken);

      if (tokens) {
        originalRequest.headers.Authorization = `Bearer ${tokens.accessToken}`;
        return axiosInstance(originalRequest);
      }
    }

    const body = error.response?.data;
    const message = Array.isArray(body?.message)
      ? body.message.join(', ')
      : body?.message;

    throw new ApiError(
      message ?? error.message,
      body?.statusCode ?? error.response?.status,
    );
  },
);

const resolveUrl = (endpoint: string, options?: HttpRequestOptions) =>
  buildUrl(endpoint, options?.urlParams, options?.queryParams);

export const http = {
  async get<TResponse>(endpoint: string, options?: HttpRequestOptions) {
    const response = await axiosInstance.get<TResponse>(
      resolveUrl(endpoint, options),
      options?.config,
    );
    return response.data;
  },

  async post<TResponse, TBody = unknown>(
    endpoint: string,
    body?: TBody,
    options?: HttpRequestOptions,
  ) {
    const response = await axiosInstance.post<TResponse>(
      resolveUrl(endpoint, options),
      body,
      options?.config,
    );
    return response.data;
  },

  async put<TResponse, TBody = unknown>(
    endpoint: string,
    body?: TBody,
    options?: HttpRequestOptions,
  ) {
    const response = await axiosInstance.put<TResponse>(
      resolveUrl(endpoint, options),
      body,
      options?.config,
    );
    return response.data;
  },

  async patch<TResponse, TBody = unknown>(
    endpoint: string,
    body?: TBody,
    options?: HttpRequestOptions,
  ) {
    const response = await axiosInstance.patch<TResponse>(
      resolveUrl(endpoint, options),
      body,
      options?.config,
    );
    return response.data;
  },

  async delete<TResponse, TBody = unknown>(
    endpoint: string,
    body?: TBody,
    options?: HttpRequestOptions,
  ) {
    const response = await axiosInstance.delete<TResponse>(
      resolveUrl(endpoint, options),
      { ...options?.config, data: body },
    );
    return response.data;
  },
};
