import axios, { type AxiosError } from 'axios';
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

const REQUEST_ID_HEADER = 'X-Request-Id';

type RetriableRequestConfig = InternalAxiosRequestConfig & {
  _retry?: boolean;
};

type ErrorResponseBody = {
  error?: string;
  statusCode?: number;
  message?: string | string[];
  /** Lỗi theo field: `{ email: 'Email đã tồn tại' }` hoặc `{ email: ['...'] }`. */
  errors?: Record<string, string | string[]>;
};

const joinMessages = (value: string | string[]) =>
  Array.isArray(value) ? value.join(', ') : value;

const toFieldErrors = (errors: ErrorResponseBody['errors']) => {
  if (!errors || Object.keys(errors).length === 0) {
    return undefined;
  }
  return Object.fromEntries(
    Object.entries(errors).map(([field, value]) => [
      field,
      joinMessages(value),
    ]),
  );
};

export type HttpRequestOptions = {
  urlParams?: UrlParams;
  queryParams?: QueryParams;
  /** Truyền `signal` của TanStack Query vào đây để huỷ request khi query bị bỏ. */
  signal?: AbortSignal;
  config?: AxiosRequestConfig;
};

let refreshTokenRequest: Promise<AuthTokens | null> | null = null;

const axiosInstance = axios.create({
  baseURL: env.VITE_API_BASE_URL,
  timeout: 30_000,
});

axiosInstance.interceptors.request.use((config) => {
  const token = getStoredAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  // Mỗi request một id để đối chiếu log FE (monitoring) với log BE.
  config.headers[REQUEST_ID_HEADER] = crypto.randomUUID();

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

/** 401 lần đầu, không phải chính request refresh, và đang có refresh token. */
const canRetryWithRefresh = (
  error: AxiosError<ErrorResponseBody>,
  request: RetriableRequestConfig | undefined,
): request is RetriableRequestConfig =>
  error.response?.status === 401 &&
  request !== undefined &&
  !request._retry &&
  request.url !== Endpoints.Auth.REFRESH_TOKEN &&
  getStoredRefreshToken() !== null;

const toApiError = (
  error: AxiosError<ErrorResponseBody>,
  request: RetriableRequestConfig | undefined,
) => {
  const body = error.response?.data;
  const message = body?.message ? joinMessages(body.message) : undefined;
  const requestId = request?.headers.get(REQUEST_ID_HEADER);

  return new ApiError(message ?? error.message, {
    statusCode: body?.statusCode ?? error.response?.status,
    requestId: typeof requestId === 'string' ? requestId : undefined,
    fieldErrors: toFieldErrors(body?.errors),
  });
};

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error: unknown) => {
    if (!axios.isAxiosError<ErrorResponseBody>(error)) {
      throw error;
    }

    const originalRequest = error.config as RetriableRequestConfig | undefined;

    if (canRetryWithRefresh(error, originalRequest)) {
      originalRequest._retry = true;
      const tokens = await refreshAuthTokens(getStoredRefreshToken() ?? '');

      if (tokens) {
        originalRequest.headers.Authorization = `Bearer ${tokens.accessToken}`;
        return axiosInstance(originalRequest);
      }
    }

    throw toApiError(error, originalRequest);
  },
);

const resolveUrl = (endpoint: string, options?: HttpRequestOptions) =>
  buildUrl(endpoint, options?.urlParams, options?.queryParams);

const resolveConfig = (options?: HttpRequestOptions): AxiosRequestConfig => ({
  ...options?.config,
  signal: options?.signal ?? options?.config?.signal,
});

export const http = {
  async get<TResponse>(endpoint: string, options?: HttpRequestOptions) {
    const response = await axiosInstance.get<TResponse>(
      resolveUrl(endpoint, options),
      resolveConfig(options),
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
      resolveConfig(options),
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
      resolveConfig(options),
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
      resolveConfig(options),
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
      { ...resolveConfig(options), data: body },
    );
    return response.data;
  },
};
