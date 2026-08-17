import {
  type MutationOptions,
  type QueryKey,
  type UseQueryOptions,
  useMutation,
  useQuery,
} from '@tanstack/react-query';

import type { FormattedError } from '@/application/dto/response/ErrorResponse';

export type ApiError = FormattedError;

export type ApiQueryOptions<TResponse> = Omit<
  UseQueryOptions<TResponse, ApiError>,
  'queryKey' | 'queryFn'
>;

export const useApiQuery = <TResponse>({
  queryKey,
  queryFn,
  options = {},
}: {
  queryKey: QueryKey;
  queryFn: () => Promise<TResponse>;
  options?: ApiQueryOptions<TResponse>;
}) =>
  useQuery<TResponse, ApiError>({
    queryKey,
    queryFn,
    ...options,
  });

export const useApiMutation = <TRequest = void, TResponse = unknown>({
  mutationFn,
  options = {},
}: {
  mutationFn: (payload: TRequest) => Promise<TResponse>;
  options?: MutationOptions<TResponse, ApiError, TRequest>;
}) =>
  useMutation<TResponse, ApiError, TRequest>({
    mutationFn,
    retry: false,
    ...options,
  });
