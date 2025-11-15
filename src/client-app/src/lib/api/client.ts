import createClient from 'openapi-fetch'
import type { paths } from './schema'

export const apiClient = createClient<paths>({
  baseUrl: '/api',
})

// Optional: Add request/response interceptors
apiClient.use({
  async onRequest({ request }) {
    // Add auth token if needed
    const token = localStorage.getItem('accessToken')
    if (token) {
      request.headers.set('Authorization', `Bearer ${token}`)
    }
    return request
  },

  async onResponse({ response }) {
    // Don't throw errors globally - let the caller handle them
    // Just return the response as-is
    return response
  },
})
