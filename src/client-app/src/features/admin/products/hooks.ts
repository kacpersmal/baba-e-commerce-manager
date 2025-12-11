import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '@/lib/api/client'
import type { components } from '@/lib/api/schema'

type ProductResponse = components['schemas']['ProductResponseDto']
type ProductWithStock = components['schemas']['ProductWithStockDto']
type PaginatedProductResponse =
  components['schemas']['PaginatedProductResponse']
type CreateProductDto = components['schemas']['CreateProductDto']
type UpdateProductDto = components['schemas']['UpdateProductDto']
type CreateStockDto = components['schemas']['CreateStockDto']
type UpdateStockDto = components['schemas']['UpdateStockDto']
type AdjustStockDto = components['schemas']['AdjustStockDto']
type ProductStockSummary = components['schemas']['ProductStockSummaryDto']

// Query keys
export const productKeys = {
  all: ['products'] as const,
  lists: () => [...productKeys.all, 'list'] as const,
  list: (filters?: {
    page?: number
    limit?: number
    search?: string
    categoryId?: string
    isActive?: boolean
  }) => [...productKeys.lists(), filters] as const,
  details: () => [...productKeys.all, 'detail'] as const,
  detail: (id: string) => [...productKeys.details(), id] as const,
  stock: (productId: string) =>
    [...productKeys.all, 'stock', productId] as const,
}

// Get all products with pagination and filters
export function useProducts(
  page?: number,
  limit?: number,
  search?: string,
  categoryId?: string,
  isActive?: boolean,
) {
  return useQuery({
    queryKey: productKeys.list({ page, limit, search, categoryId, isActive }),
    queryFn: async () => {
      const { data, error } = await apiClient.GET('/products', {
        params: {
          query: { page, limit, search, categoryId, isActive },
        },
      })
      if (error) throw error
      return data as PaginatedProductResponse
    },
  })
}

// Get single product by ID
export function useProduct(id: string) {
  return useQuery({
    queryKey: productKeys.detail(id),
    queryFn: async () => {
      const { data, error } = await apiClient.GET('/products/{id}', {
        params: { path: { id } },
      })
      if (error) throw error
      return data as ProductResponse
    },
    enabled: !!id,
  })
}

// Get product stock summary
export function useProductStock(productId: string) {
  return useQuery({
    queryKey: productKeys.stock(productId),
    queryFn: async () => {
      const { data, error } = await apiClient.GET('/products/{id}/stock', {
        params: { path: { id: productId } },
      })
      if (error) throw error
      return data as ProductStockSummary
    },
    enabled: !!productId,
  })
}

// Create product mutation
export function useCreateProduct() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (newProduct: CreateProductDto) => {
      const { data, error } = await apiClient.POST('/products', {
        body: newProduct,
      })
      if (error) throw error
      return data as ProductResponse
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: productKeys.lists() })
    },
  })
}

// Update product mutation
export function useUpdateProduct() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string
      data: UpdateProductDto
    }) => {
      const { data: response, error } = await apiClient.PATCH(
        '/products/{id}',
        {
          params: { path: { id } },
          body: data,
        },
      )
      if (error) throw error
      return response as ProductResponse
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: productKeys.lists() })
      queryClient.invalidateQueries({
        queryKey: productKeys.detail(variables.id),
      })
    },
  })
}

// Delete product mutation
export function useDeleteProduct() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await apiClient.DELETE('/products/{id}', {
        params: { path: { id } },
      })
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: productKeys.lists() })
    },
  })
}

// Create stock mutation
export function useCreateStock() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (stockData: CreateStockDto) => {
      const { data, error } = await apiClient.POST('/products/stock', {
        body: stockData,
      })
      if (error) throw error
      return data
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: productKeys.stock(variables.productId),
      })
      queryClient.invalidateQueries({ queryKey: productKeys.lists() })
    },
  })
}

// Update stock mutation
export function useUpdateStock() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      productId,
      warehouseId,
      quantity,
    }: {
      productId: string
      warehouseId: string
      quantity: number
    }) => {
      const { data, error } = await apiClient.PATCH(
        '/products/stock/{productId}/{warehouseId}',
        {
          params: { path: { productId, warehouseId } },
          body: { quantity },
        },
      )
      if (error) throw error
      return data
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: productKeys.stock(variables.productId),
      })
      queryClient.invalidateQueries({ queryKey: productKeys.lists() })
    },
  })
}

// Adjust stock mutation (add/subtract)
export function useAdjustStock() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      productId,
      warehouseId,
      adjustment,
    }: {
      productId: string
      warehouseId: string
      adjustment: number
    }) => {
      const { data, error } = await apiClient.POST(
        '/products/stock/{productId}/{warehouseId}/adjust',
        {
          params: { path: { productId, warehouseId } },
          body: { adjustment },
        },
      )
      if (error) throw error
      return data
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: productKeys.stock(variables.productId),
      })
      queryClient.invalidateQueries({ queryKey: productKeys.lists() })
    },
  })
}

// Delete stock mutation
export function useDeleteStock() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      productId,
      warehouseId,
    }: {
      productId: string
      warehouseId: string
    }) => {
      const { error } = await apiClient.DELETE(
        '/products/stock/{productId}/{warehouseId}',
        {
          params: { path: { productId, warehouseId } },
        },
      )
      if (error) throw error
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: productKeys.stock(variables.productId),
      })
      queryClient.invalidateQueries({ queryKey: productKeys.lists() })
    },
  })
}
