import {
  useQuery,
  useMutation,
  useQueryClient,
  type UseQueryResult,
  type UseMutationResult,
} from '@tanstack/react-query'
import { apiClient } from '@/lib/api/client'
import type { components } from '@/lib/api/schema'

type UserResponse = components['schemas']['UserResponseDto']
type CreateUserDto = components['schemas']['CreateUserDto']
type UpdateUserDto = components['schemas']['UpdateUserDto']
type ChangeRoleDto = components['schemas']['ChangeRoleDto']

interface PaginationMeta {
  total: number
  page: number
  limit: number
  totalPages: number
}

interface PaginatedUserResponse {
  data: UserResponse[]
  meta: PaginationMeta
}

const usersKeys = {
  all: ['users'] as const,
  lists: () => [...usersKeys.all, 'list'] as const,
  list: (page?: number, limit?: number, search?: string) =>
    [...usersKeys.lists(), { page, limit, search }] as const,
  detail: (id: string) => [...usersKeys.all, 'detail', id] as const,
}

export function useUsers(
  page?: number,
  limit?: number,
  search?: string,
): UseQueryResult<PaginatedUserResponse, Error> {
  return useQuery({
    queryKey: usersKeys.list(page, limit, search),
    queryFn: async () => {
      const { data, error } = await apiClient.GET('/users', {
        params: {
          query: {
            page,
            limit,
            search,
          },
        },
      })
      if (error) throw error
      if (!data) throw new Error('No data returned from API')
      return data as unknown as PaginatedUserResponse
    },
  })
}

export function useUser(id: string): UseQueryResult<UserResponse, Error> {
  return useQuery({
    queryKey: usersKeys.detail(id),
    queryFn: async () => {
      const { data, error } = await apiClient.GET('/users/{id}', {
        params: { path: { id } },
      })
      if (error) throw error
      if (!data) throw new Error('No data returned from API')
      return data as unknown as UserResponse
    },
    enabled: !!id,
  })
}

export function useCreateUser(): UseMutationResult<
  UserResponse,
  Error,
  CreateUserDto
> {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (dto: CreateUserDto) => {
      const { data, error } = await apiClient.POST('/auth/register', {
        body: dto,
      })
      if (error) throw error
      if (!data) throw new Error('No data returned from API')
      return data as unknown as UserResponse
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: usersKeys.lists() })
    },
  })
}

export function useUpdateUser(): UseMutationResult<
  UserResponse,
  Error,
  { id: string; dto: UpdateUserDto }
> {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, dto }: { id: string; dto: UpdateUserDto }) => {
      const { data, error } = await apiClient.PATCH('/users/{id}', {
        params: { path: { id } },
        body: dto,
      })
      if (error) throw error
      if (!data) throw new Error('No data returned from API')
      return data as unknown as UserResponse
    },
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: usersKeys.lists() })
      queryClient.invalidateQueries({ queryKey: usersKeys.detail(id) })
    },
  })
}

export function useChangeUserRole(): UseMutationResult<
  UserResponse,
  Error,
  { id: string; dto: ChangeRoleDto }
> {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, dto }: { id: string; dto: ChangeRoleDto }) => {
      const { data, error } = await apiClient.POST('/users/{id}/role', {
        params: { path: { id } },
        body: dto,
      })
      if (error) throw error
      if (!data) throw new Error('No data returned from API')
      return data as unknown as UserResponse
    },
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: usersKeys.lists() })
      queryClient.invalidateQueries({ queryKey: usersKeys.detail(id) })
    },
  })
}

export function useVerifyUser(): UseMutationResult<
  UserResponse,
  Error,
  string
> {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      const { data, error } = await apiClient.POST('/users/{id}/verify', {
        params: { path: { id } },
      })
      if (error) throw error
      if (!data) throw new Error('No data returned from API')
      return data as unknown as UserResponse
    },
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: usersKeys.lists() })
      queryClient.invalidateQueries({ queryKey: usersKeys.detail(id) })
    },
  })
}

export function useUnverifyUser(): UseMutationResult<
  UserResponse,
  Error,
  string
> {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      const { data, error } = await apiClient.POST('/users/{id}/unverify', {
        params: { path: { id } },
      })
      if (error) throw error
      if (!data) throw new Error('No data returned from API')
      return data as unknown as UserResponse
    },
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: usersKeys.lists() })
      queryClient.invalidateQueries({ queryKey: usersKeys.detail(id) })
    },
  })
}

export function useDeleteUser(): UseMutationResult<void, Error, string> {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await apiClient.DELETE('/users/{id}', {
        params: { path: { id } },
      })
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: usersKeys.lists() })
    },
  })
}
