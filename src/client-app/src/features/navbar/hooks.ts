import { useQuery } from '@tanstack/react-query'
import { apiClient } from '@/lib/api'

export interface Category {
  id: string
  name: string
  slug: string
  icon?: string
  color?: string
  order: number
  parentId?: string
  children?: Category[]
  createdAt: string
  updatedAt: string
}

/**
 * Hook to fetch all categories with 5 minute cache
 */
export function useCategories() {
  return useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const response = await apiClient.GET('/categories')

      if (response.error) {
        throw new Error('Failed to fetch categories')
      }

      return response.data as Category[]
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
  })
}

/**
 * Hook to fetch a single category by ID
 */
export function useCategory(id: string) {
  return useQuery({
    queryKey: ['categories', id],
    queryFn: async () => {
      const response = await apiClient.GET('/categories/{id}', {
        params: {
          path: { id },
        },
      })

      if (response.error) {
        throw new Error('Failed to fetch category')
      }

      return response.data as Category
    },
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  })
}

/**
 * Hook to fetch a category by slug
 */
export function useCategoryBySlug(slug: string) {
  return useQuery({
    queryKey: ['categories', 'slug', slug],
    queryFn: async () => {
      const response = await apiClient.GET('/categories/slug/{slug}', {
        params: {
          path: { slug },
        },
      })

      if (response.error) {
        throw new Error('Failed to fetch category')
      }

      return response.data as Category
    },
    enabled: !!slug,
    staleTime: 5 * 60 * 1000,
  })
}
