import {
  useQuery,
  useMutation,
  useQueryClient,
  type UseQueryResult,
  type UseMutationResult,
} from '@tanstack/react-query'
import { apiClient } from '@/lib/api/client'
import type { components } from '@/lib/api/schema'

type WarehouseResponse = components['schemas']['WarehouseResponseDto']
type CreateWarehouseDto = components['schemas']['CreateWarehouseDto']
type UpdateWarehouseDto = components['schemas']['UpdateWarehouseDto']

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

export function useCreateWarehouse(): UseMutationResult<
  WarehouseResponse,
  Error,
  CreateWarehouseDto
> {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (dto: CreateWarehouseDto) => {
      const { data, error } = await apiClient.POST('/warehouses', {
        body: dto,
      })
      if (error) throw error
      if (!data) throw new Error('No data returned from API')
      return data as unknown as WarehouseResponse
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: warehousesKeys.lists() })
    },
  })
}

export function useUpdateWarehouse(): UseMutationResult<
  WarehouseResponse,
  Error,
  { id: string; dto: UpdateWarehouseDto }
> {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      id,
      dto,
    }: {
      id: string
      dto: UpdateWarehouseDto
    }) => {
      const { data, error } = await apiClient.PATCH('/warehouses/{id}', {
        params: { path: { id } },
        body: dto,
      })
      if (error) throw error
      if (!data) throw new Error('No data returned from API')
      return data as unknown as WarehouseResponse
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: warehousesKeys.lists() })
    },
  })
}

export function useDeleteWarehouse(): UseMutationResult<void, Error, string> {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await apiClient.DELETE('/warehouses/{id}', {
        params: { path: { id } },
      })
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: warehousesKeys.lists() })
    },
  })
}
