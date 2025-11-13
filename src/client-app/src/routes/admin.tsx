import { createFileRoute, Outlet } from '@tanstack/react-router'
import AdminNav from '../features/admin/admin-nav'

export const Route = createFileRoute('/admin')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <>
      <AdminNav />
      <Outlet />
    </>
  )
}
