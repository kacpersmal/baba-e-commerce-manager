import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { jwtDecode } from 'jwt-decode'

export type UserRole = 'USER' | 'ADMIN'

export interface JwtPayload {
  sub: string
  email: string
  role: UserRole
  isVerified: boolean
  iat: number
  exp: number
}

export interface AuthUser {
  id: string
  email: string
  role: UserRole
  isVerified: boolean
}

interface AuthStore {
  user: AuthUser | null
  accessToken: string | null
  refreshToken: string | null

  // Actions
  setTokens: (accessToken: string, refreshToken: string) => void
  clearAuth: () => void
  isAuthenticated: () => boolean
  isAdmin: () => boolean
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      refreshToken: null,

      setTokens: (accessToken: string, refreshToken: string) => {
        try {
          const decoded = jwtDecode<JwtPayload>(accessToken)

          set({
            accessToken,
            refreshToken,
            user: {
              id: decoded.sub,
              email: decoded.email,
              role: decoded.role,
              isVerified: decoded.isVerified,
            },
          })
        } catch (error) {
          console.error('Failed to decode JWT:', error)
          throw new Error('Invalid token')
        }
      },

      clearAuth: () => {
        set({
          user: null,
          accessToken: null,
          refreshToken: null,
        })

        // Also clear from localStorage (legacy keys)
        localStorage.removeItem('accessToken')
        localStorage.removeItem('refreshToken')
      },

      isAuthenticated: () => {
        const { accessToken, user } = get()
        return !!accessToken && !!user
      },

      isAdmin: () => {
        const { user } = get()
        return user?.role === 'ADMIN'
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
    },
  ),
)
