import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '@/lib/api/client'

export const useCreateOrder = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async () => {
      const { data, error } = await apiClient.POST('/orders')
      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] })
      queryClient.invalidateQueries({ queryKey: ['orders'] })
    },
  })
}

export const useMyOrders = (params?: { page?: number; limit?: number }) => {
  return useQuery({
    queryKey: ['orders', 'my', params],
    queryFn: async () => {
      const { data, error } = await apiClient.GET('/orders/my', {
        params: { query: params },
      })
      if (error) throw error
      return data
    },
  })
}

export const useOrderByNumber = (orderNumber: string) => {
  return useQuery({
    queryKey: ['orders', 'number', orderNumber],
    queryFn: async () => {
      const { data, error } = await apiClient.GET('/orders/{orderNumber}', {
        params: { path: { orderNumber } },
      })
      if (error) throw error
      return data
    },
    enabled: !!orderNumber,
  })
}

// Admin hooks
export const useAllOrders = (params?: {
  page?: number
  limit?: number
  status?: string
}) => {
  return useQuery({
    queryKey: ['orders', 'admin', params],
    queryFn: async () => {
      const { data, error } = await apiClient.GET('/orders', {
        params: { query: params },
      })
      if (error) throw error
      return data
    },
  })
}

export const useUpdateOrderStatus = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      orderNumber,
      status,
    }: {
      orderNumber: string
      status: string
    }) => {
      const { data, error } = await apiClient.PATCH(
        '/orders/{orderNumber}/status',
        {
          params: { path: { orderNumber } },
          body: { status },
        },
      )
      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] })
    },
  })
}

export const useOrderStats = () => {
  return useQuery({
    queryKey: ['orders', 'stats'],
    queryFn: async () => {
      const { data, error } = await apiClient.GET('/orders/stats')
      if (error) throw error
      return data
    },
  })
}
