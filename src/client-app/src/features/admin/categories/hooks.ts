import {
  useQuery,
  useMutation,
  useQueryClient,
  type UseQueryOptions,
} from '@tanstack/react-query'
import { apiClient } from '@/lib/api/client'
import type { components } from '@/lib/api/schema'

type CategoryResponse = components['schemas']['CategoryResponseDto']
type CreateCategoryDto = components['schemas']['CreateCategoryDto']
type UpdateCategoryDto = components['schemas']['UpdateCategoryDto']

// Query keys for cache management
export const categoryKeys = {
  all: ['categories'] as const,
  lists: () => [...categoryKeys.all, 'list'] as const,
  list: (filters?: unknown) => [...categoryKeys.lists(), filters] as const,
  details: () => [...categoryKeys.all, 'detail'] as const,
  detail: (id: string) => [...categoryKeys.details(), id] as const,
}

// Get all categories
export function useCategories(
  options?: Omit<UseQueryOptions<CategoryResponse[]>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: categoryKeys.lists(),
    queryFn: async () => {
      const { data, error } = await apiClient.GET('/categories')
      if (error) throw error
      return data as CategoryResponse[]
    },
    ...options,
  })
}

// Get single category by ID
export function useCategory(
  id: string,
  options?: Omit<UseQueryOptions<CategoryResponse>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: categoryKeys.detail(id),
    queryFn: async () => {
      const { data, error } = await apiClient.GET('/categories/{id}', {
        params: { path: { id } },
      })
      if (error) throw error
      return data as CategoryResponse
    },
    enabled: !!id,
    ...options,
  })
}

// Create category mutation
export function useCreateCategory() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (newCategory: CreateCategoryDto) => {
      const { data, error } = await apiClient.POST('/categories', {
        body: newCategory,
      })
      if (error) throw error
      return data as CategoryResponse
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: categoryKeys.lists() })
    },
  })
}

// Update category mutation
export function useUpdateCategory() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string
      data: UpdateCategoryDto
    }) => {
      const { data: response, error } = await apiClient.PATCH(
        '/categories/{id}',
        {
          params: { path: { id } },
          body: data,
        },
      )
      if (error) throw error
      return response as CategoryResponse
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: categoryKeys.lists() })
      queryClient.invalidateQueries({
        queryKey: categoryKeys.detail(variables.id),
      })
    },
  })
}

// Delete category mutation
export function useDeleteCategory() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await apiClient.DELETE('/categories/{id}', {
        params: { path: { id } },
      })
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: categoryKeys.lists() })
    },
  })
}
