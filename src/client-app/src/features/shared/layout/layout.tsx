import { HeadContent, Outlet } from '@tanstack/react-router'

import { Header } from '@/features/shared/layout'
import AuthContainer from '@/features/auth/auth-container'
import { useAuthModalStore } from '@/features/auth/useAuthStore'

export default function Layout() {
  const isAuthModalOpen = useAuthModalStore((s) => s.isAuthModalOpen)

  return (
    <>
      <HeadContent />
      <div className="relative flex min-h-screen flex-col">
        <Header />
        <main className="flex-1">
          <Outlet />
        </main>
      </div>
      {isAuthModalOpen && <AuthContainer />}
    </>
  )
}
