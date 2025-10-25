import { createFileRoute } from '@tanstack/react-router'
import { useHealthCheck, useReadinessCheck } from '@/lib/api/hooks'

export const Route = createFileRoute('/health')({
  component: HealthPage,
})

function HealthPage() {
  const {
    data: health,
    isLoading: healthLoading,
    error: healthError,
  } = useHealthCheck()
  const {
    data: readiness,
    isLoading: readinessLoading,
    error: readinessError,
  } = useReadinessCheck()

  return (
    <div className="min-h-[calc(100vh-64px)] bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">
          Auto-Generated API Client Demo
        </h1>

        {/* Health Check Card */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">
            Health Check
          </h2>
          {healthLoading && (
            <p className="text-gray-600">Loading health status...</p>
          )}
          {healthError && (
            <p className="text-red-600">Error: {healthError.message}</p>
          )}
          {health && (
            <pre className="bg-gray-50 p-4 rounded overflow-auto text-sm">
              {JSON.stringify(health, null, 2)}
            </pre>
          )}
        </div>

        {/* Readiness Check Card */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">
            Readiness Check
          </h2>
          {readinessLoading && (
            <p className="text-gray-600">Loading readiness status...</p>
          )}
          {readinessError && (
            <p className="text-red-600">Error: {readinessError.message}</p>
          )}
          {readiness && (
            <pre className="bg-gray-50 p-4 rounded overflow-auto text-sm">
              {JSON.stringify(readiness, null, 2)}
            </pre>
          )}
        </div>

        {/* Info Card */}
        <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded">
          <h3 className="font-semibold text-blue-900 mb-2">
            ✨ Type-Safe API Client
          </h3>
          <p className="text-blue-800">
            This demo uses auto-generated TypeScript types from your NestJS
            OpenAPI schema. All API calls are fully type-checked at compile
            time!
          </p>
          <p className="text-blue-700 mt-2 text-sm">
            Run{' '}
            <code className="bg-blue-100 px-2 py-1 rounded">
              npm run generate:api
            </code>{' '}
            to regenerate types after backend changes.
          </p>
        </div>
      </div>
    </div>
  )
}
