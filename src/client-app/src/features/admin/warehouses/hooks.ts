import { useQuery, type UseQueryResult } from '@tanstack/react-query'
import { apiClient } from '@/lib/api/client'
import type { components } from '@/lib/api/schema'

type WarehouseResponse = components['schemas']['WarehouseResponseDto']

interface PaginationMeta {
  total: number
  page: number
  limit: number
  totalPages: number
}

interface PaginatedWarehouseResponse {
  data: WarehouseResponse[]
  meta: PaginationMeta
}

const warehousesKeys = {
  all: ['warehouses'] as const,
  lists: () => [...warehousesKeys.all, 'list'] as const,
  list: (page?: number, limit?: number) =>
    [...warehousesKeys.lists(), { page, limit }] as const,
}

export function useWarehouses(
  page?: number,
  limit?: number,
): UseQueryResult<PaginatedWarehouseResponse, Error> {
  return useQuery({
    queryKey: warehousesKeys.list(page, limit),
    queryFn: async () => {
      const { data, error } = await apiClient.GET('/warehouses/admin/all', {
        params: {
          query: {
            page,
            limit,
          },
        },
      })
      if (error) throw error
      if (!data) throw new Error('No data returned from API')
      return data as unknown as PaginatedWarehouseResponse
    },
  })
}
