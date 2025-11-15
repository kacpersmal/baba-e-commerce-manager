import { createFileRoute, Outlet } from '@tanstack/react-router'
import AdminNav from '../features/admin/admin-nav'
import { ProtectedRoute } from '../features/auth/ProtectedRoute'

export const Route = createFileRoute('/admin')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <ProtectedRoute requireAdmin>
      <AdminNav />
      <Outlet />
    </ProtectedRoute>
  )
}
