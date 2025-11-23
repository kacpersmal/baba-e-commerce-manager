import { HeadContent, Outlet } from '@tanstack/react-router'

import { Header } from '@/features/shared/layout'
export default function Layout() {
  return (
    <>
      <HeadContent />
      <div className="relative flex min-h-screen flex-col">
        <Header />
        <main className="flex-1">
          <Outlet />
        </main>
      </div>
    </>
  )
}
