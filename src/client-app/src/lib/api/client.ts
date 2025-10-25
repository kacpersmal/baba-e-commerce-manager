import createClient from 'openapi-fetch'
import type { paths } from './schema'

export const apiClient = createClient<paths>({
  baseUrl: '/api',
})

// Optional: Add request/response interceptors
apiClient.use({
  async onRequest({ request }) {
    // Add auth token if needed
    const token = localStorage.getItem('token')
    if (token) {
      request.headers.set('Authorization', `Bearer ${token}`)
    }
    return request
  },

  async onResponse({ response }) {
    // Handle errors globally
    if (!response.ok) {
      const error = await response.json().catch(() => ({}))
      throw new Error(error.message || 'API request failed')
    }
    return response
  },
})
