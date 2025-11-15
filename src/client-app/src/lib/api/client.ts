import createClient from 'openapi-fetch'
import type { paths } from './schema'
import { useAuthStore } from '../stores/auth-store'

export const apiClient = createClient<paths>({
  baseUrl: '/api',
})

// Optional: Add request/response interceptors
apiClient.use({
  async onRequest({ request }) {
    // Get token from Zustand store
    const token = useAuthStore.getState().accessToken
    if (token) {
      request.headers.set('Authorization', `Bearer ${token}`)
    }
    return request
  },

  async onResponse({ response }) {
    // Handle 401 Unauthorized - clear auth state
    if (response.status === 401) {
      useAuthStore.getState().clearAuth()
    }

    return response
  },
})
