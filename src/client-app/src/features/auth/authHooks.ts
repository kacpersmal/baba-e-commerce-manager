import { useMutation } from '@tanstack/react-query'
import { apiClient } from '@/lib/api'
import { useAuthStore } from '@/lib/stores/auth-store'

type AuthRegisterBody = {
  email: string
  firstName: string
  lastName: string
  password: string
}

type AuthSignIn = {
  email: string
  password: string
}

export function useSignIn() {
  const setTokens = useAuthStore((state) => state.setTokens)

  return useMutation({
    mutationFn: async (body: AuthSignIn) => {
      const { data, error } = await apiClient.POST('/auth/login', { body })

      if (error) {
        throw new Error((error as any)?.message || 'Login failed')
      }

      if (!data?.accessToken || !data?.refreshToken) {
        throw new Error('Invalid response: missing tokens')
      }

      // Store tokens in Zustand store (also persists to localStorage)
      setTokens(data.accessToken, data.refreshToken)

      return data
    },
  })
}

export function useSignUp() {
  const setTokens = useAuthStore((state) => state.setTokens)

  return useMutation({
    mutationFn: async (body: AuthRegisterBody) => {
      const { data, error } = await apiClient.POST('/auth/register', { body })

      if (error) {
        throw new Error((error as any)?.message || 'Registration failed')
      }

      if (!data?.tokenPair?.accessToken || !data?.tokenPair?.refreshToken) {
        throw new Error('Invalid response: missing tokens')
      }

      // Store tokens in Zustand store (also persists to localStorage)
      setTokens(data.tokenPair.accessToken, data.tokenPair.refreshToken)

      return data
    },
  })
}

export function useSignOut() {
  const clearAuth = useAuthStore((state) => state.clearAuth)

  return () => {
    clearAuth()
  }
}
