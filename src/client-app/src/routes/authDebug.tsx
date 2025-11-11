import { createFileRoute } from '@tanstack/react-router'
import AuthContainer from '@/features/auth/auth-container'

export const Route = createFileRoute('/authDebug')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className="h-full flex items-center justify-center">
      <AuthContainer />
    </div>
  )
}
