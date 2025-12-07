import { useQuery } from '@tanstack/react-query'
import { apiClient } from '@/lib/api/client'

export const useProductBySlug = (slug: string) => {
  return useQuery({
    queryKey: ['products', 'slug', slug],
    queryFn: async () => {
      const { data, error } = await apiClient.GET('/products/slug/{slug}', {
        params: { path: { slug } },
      })
      if (error) throw error
      return data
    },
    enabled: !!slug,
  })
}
