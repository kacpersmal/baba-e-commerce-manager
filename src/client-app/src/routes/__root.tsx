import {
  createRootRouteWithContext,
  HeadContent,
  Outlet,
} from '@tanstack/react-router'

import type { QueryClient } from '@tanstack/react-query'
import { Header } from '@/features/shared/layout'
import AuthContainer from '@/features/auth/auth-container'
import { useAuthModalStore } from '@/features/auth/useAuthStore'

interface MyRouterContext {
  queryClient: QueryClient
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  component: RootComponent,
})

function RootComponent() {
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
