import { useQuery } from '@tanstack/react-query'
import { apiClient } from '@/lib/api/client'

// Health check hook
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

// Readiness probe hook
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
