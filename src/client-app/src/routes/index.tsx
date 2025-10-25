import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  component: HomePage,
})

function HomePage() {
  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-64px)]">
      <h1 className="text-4xl font-bold text-gray-900">Hello World</h1>
    </div>
  )
}
