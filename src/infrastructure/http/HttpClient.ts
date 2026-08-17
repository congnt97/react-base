import axios from 'axios';
import type { AxiosRequestConfig, InternalAxiosRequestConfig } from 'axios';

import type { FormattedError } from '@/application/dto/response/ErrorResponse';
import type { ResponseCommon } from '@/application/dto/response/ResponseCommon';
import type { LoginResponse } from '@/domain/models/Auth';
import {
  clearAuthStorage,
  getStoredAccessToken,
  getStoredRefreshToken,
  persistAuthTokens,
} from '@/shared/auth-storage';
import { env } from '@/env';
import { Endpoints } from '@/shared/endpoints';
import { buildUrl } from '@/shared/url';

type RetriableRequestConfig = InternalAxiosRequestConfig & {
  _retry?: boolean;
};

let refreshTokenRequest: Promise<LoginResponse | null> | null = null;

export type HttpRequestOptions = {
  urlParams?: Record<string, string | number>;
  queryParams?: Record<string, string | number | boolean | undefined>;
  config?: AxiosRequestConfig;
};

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

const refreshAuthTokens = (refreshToken: string) => {
  refreshTokenRequest ??= axiosInstance
    .post<ResponseCommon<LoginResponse>>(Endpoints.Auth.REFRESH_TOKEN, {
      refreshToken,
    })
    .then((response) => {
      const auth = response.data.data ?? response.data.result;

      if (auth && getStoredRefreshToken() === refreshToken) {
        persistAuthTokens(auth);
        return auth;
      }

      return null;
    })
    .catch(() => {
      if (getStoredRefreshToken() === refreshToken) {
        clearAuthStorage();
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
    if (axios.isAxiosError(error)) {
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

        const auth = await refreshAuthTokens(refreshToken);

        if (auth) {
          originalRequest.headers.Authorization = `Bearer ${auth.accessToken}`;
          return axiosInstance(originalRequest);
        }
      }

      const responseData = error.response?.data as
        | Partial<FormattedError> & {
            error?: string;
            statusCode?: number;
            message?: string | string[];
          }
        | undefined;
      const message = Array.isArray(responseData?.message)
        ? responseData.message.join(', ')
        : responseData?.message;

      return Promise.reject({
        message: message ?? error.message,
        statusCode: responseData?.statusCode ?? error.response?.status,
      } satisfies FormattedError);
    }

    return Promise.reject(error);
  },
);

const resolveUrl = (endpoint: string, options?: HttpRequestOptions) =>
  buildUrl(endpoint, options?.urlParams, options?.queryParams);

export const httpClient = {
  async get<TResponse>(
    endpoint: string,
    options?: HttpRequestOptions,
  ): Promise<TResponse> {
    const response = await axiosInstance.get<TResponse>(
      resolveUrl(endpoint, options),
      options?.config,
    );

    return response.data;
  },

  async post<TResponse, TRequest = unknown>(
    endpoint: string,
    payload?: TRequest,
    options?: HttpRequestOptions,
  ): Promise<TResponse> {
    const response = await axiosInstance.post<TResponse>(
      resolveUrl(endpoint, options),
      payload,
      options?.config,
    );

    return response.data;
  },

  async put<TResponse, TRequest = unknown>(
    endpoint: string,
    payload?: TRequest,
    options?: HttpRequestOptions,
  ): Promise<TResponse> {
    const response = await axiosInstance.put<TResponse>(
      resolveUrl(endpoint, options),
      payload,
      options?.config,
    );

    return response.data;
  },

  async patch<TResponse, TRequest = unknown>(
    endpoint: string,
    payload?: TRequest,
    options?: HttpRequestOptions,
  ): Promise<TResponse> {
    const response = await axiosInstance.patch<TResponse>(
      resolveUrl(endpoint, options),
      payload,
      options?.config,
    );

    return response.data;
  },

  async delete<TResponse, TRequest = unknown>(
    endpoint: string,
    payload?: TRequest,
    options?: HttpRequestOptions,
  ): Promise<TResponse> {
    const response = await axiosInstance.delete<TResponse>(
      resolveUrl(endpoint, options),
      {
        ...options?.config,
        data: payload,
      },
    );

    return response.data;
  },
};
