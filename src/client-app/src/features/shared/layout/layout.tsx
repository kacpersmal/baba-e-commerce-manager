import { HeadContent, Outlet } from '@tanstack/react-router'
import { useAuthModalStore } from '@/features/auth/useAuthStore'

import { Header } from '@/features/shared/layout'
import AuthContainer from '@/features/auth/auth-container'
export default function Layout() {
  const authModalFlag = useAuthModalStore((s) => s.isAuthModalOpen)
  return (
    <>
      {authModalFlag && <AuthContainer />}
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
