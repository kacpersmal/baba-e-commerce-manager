import { useEffect } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { useAuthStore } from '@/lib/stores/auth-store'
import { toast } from 'sonner'

interface ProtectedRouteProps {
  children: React.ReactNode
  requireAdmin?: boolean
}

export function ProtectedRoute({
  children,
  requireAdmin = false,
}: ProtectedRouteProps) {
  const navigate = useNavigate()
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated())
  const isAdmin = useAuthStore((state) => state.isAdmin())

  useEffect(() => {
    if (!isAuthenticated) {
      toast.error('Please log in to access this page')
      navigate({ to: '/' })
      return
    }

    if (requireAdmin && !isAdmin) {
      toast.error('You do not have permission to access this page')
      navigate({ to: '/' })
    }
  }, [isAuthenticated, isAdmin, requireAdmin, navigate])

  if (!isAuthenticated) {
    return null
  }

  if (requireAdmin && !isAdmin) {
    return null
  }

  return <>{children}</>
}
