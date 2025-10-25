import {
  useQuery,
  useMutation,
  type UseQueryOptions,
  type UseMutationOptions,
} from '@tanstack/react-query'
import { apiClient } from './client'
import type { paths } from './schema'

// Health check hook example
export function useHealthCheck() {
  return useQuery({
    queryKey: ['health'],
    queryFn: async () => {
      const { data, error } = await apiClient.GET('/health')
      if (error) throw error
      return data
    },
  })
}

// Readiness probe hook example
export function useReadinessCheck() {
  return useQuery({
    queryKey: ['health', 'readiness'],
    queryFn: async () => {
      const { data, error } = await apiClient.GET('/health/readiness')
      if (error) throw error
      return data
    },
  })
}

// Generic query hook factory for type-safe API calls
export function createQueryHook<TPath extends keyof paths>(
  path: TPath,
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH',
) {
  return <TParams = unknown>(
    params?: TParams,
    options?: Omit<UseQueryOptions, 'queryKey' | 'queryFn'>,
  ) => {
    return useQuery({
      queryKey: [path, method, params],
      queryFn: async () => {
        // @ts-expect-error - Dynamic method call
        const { data, error } = await apiClient[method](path, params)
        if (error) throw error
        return data
      },
      ...options,
    })
  }
}

// Generic mutation hook factory
export function createMutationHook<TPath extends keyof paths>(
  path: TPath,
  method: 'POST' | 'PUT' | 'DELETE' | 'PATCH',
) {
  return <TBody = unknown, TResponse = unknown>(
    options?: UseMutationOptions<TResponse, Error, TBody>,
  ) => {
    return useMutation({
      mutationFn: async (body: TBody) => {
        // @ts-expect-error - Dynamic method call
        const { data, error } = await apiClient[method](path, { body })
        if (error) throw error
        return data as TResponse
      },
      ...options,
    })
  }
}
