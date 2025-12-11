import { useQuery } from '@tanstack/react-query'
import { apiClient } from '@/lib/api/client'

export const usePublicProducts = (params?: {
  page?: number
  limit?: number
  search?: string
  category?: string
  isActive?: boolean
}) => {
  return useQuery({
    queryKey: ['products', 'public', params],
    queryFn: async () => {
      const { data, error } = await apiClient.GET('/products', {
        params: { query: params as any },
      })
      if (error) throw error
      return data
    },
  })
}
