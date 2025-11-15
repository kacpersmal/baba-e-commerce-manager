import { useMutation } from '@tanstack/react-query'
import { apiClient } from '@/lib/api'

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
  return useMutation({
    mutationFn: async (body: AuthSignIn) => {
      const { data, error } = await apiClient.POST('/auth/login', { body })

      if (error) {
        throw new Error(error.message || 'Login failed')
      }

      if (data) {
        // Store tokens
        if (data.accessToken) {
          localStorage.setItem('accessToken', data.accessToken)
        }
        if (data.refreshToken) {
          localStorage.setItem('refreshToken', data.refreshToken)
        }
      }

      return data
    },
  })
}

export function useSignUp() {
  return useMutation({
    mutationFn: async (body: AuthRegisterBody) => {
      const { data, error } = await apiClient.POST('/auth/register', { body })

      if (error) {
        throw new Error(error.message || 'Registration failed')
      }

      if (data) {
        // Store tokens
        if (data.accessToken) {
          localStorage.setItem('accessToken', data.accessToken)
        }
        if (data.refreshToken) {
          localStorage.setItem('refreshToken', data.refreshToken)
        }
      }

      return data
    },
  })
}
