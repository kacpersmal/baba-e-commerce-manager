import { createFileRoute } from '@tanstack/react-router'
import AuthContainer from '@/features/auth/auth-container'
import { useAuthModalStore } from '@/features/auth/useAuthStore'

export const Route = createFileRoute('/authDebug')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div className="h-full flex items-center justify-center"></div>
}
