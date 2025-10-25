import { Outlet, createRootRouteWithContext } from '@tanstack/react-router'

import { Header } from '@/features/shared/layout'

import type { QueryClient } from '@tanstack/react-query'

interface MyRouterContext {
  queryClient: QueryClient
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  component: () => (
    <div className="min-h-screen bg-white">
      <Header />
      <main>
        <Outlet />
      </main>
    </div>
  ),
})
