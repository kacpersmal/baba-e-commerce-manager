import { useHealthCheck, useReadinessCheck } from './hooks'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Skeleton } from '@/components/ui/skeleton'
import { Separator } from '@/components/ui/separator'
import { Activity, CheckCircle2, AlertCircle, Sparkles } from 'lucide-react'

export function HealthPage() {
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

  const getStatusBadge = (
    isLoading: boolean,
    error: unknown,
    data: unknown,
  ) => {
    if (isLoading) return <Badge variant="outline">Loading...</Badge>
    if (error) return <Badge variant="destructive">Error</Badge>
    if (data) return <Badge variant="default">Healthy</Badge>
    return null
  }

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8 space-y-8">
      <div className="space-y-2">
        <h1 className="text-4xl font-bold tracking-tight">System Health</h1>
        <p className="text-muted-foreground">
          Monitor your application's health and readiness status
        </p>
      </div>

      <Separator />

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Activity className="h-5 w-5" />
                <CardTitle>Health Check</CardTitle>
              </div>
              {getStatusBadge(healthLoading, healthError, health)}
            </div>
            <CardDescription>General application health status</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {healthLoading && (
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            )}
            {healthError && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{String(healthError)}</AlertDescription>
              </Alert>
            )}
            {health && (
              <div className="space-y-2">
                <div className="flex items-center space-x-2 text-sm">
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                  <span className="font-medium">System operational</span>
                </div>
                <pre className="rounded-md bg-muted p-4 text-xs overflow-auto">
                  {JSON.stringify(health, null, 2)}
                </pre>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Activity className="h-5 w-5" />
                <CardTitle>Readiness Check</CardTitle>
              </div>
              {getStatusBadge(readinessLoading, readinessError, readiness)}
            </div>
            <CardDescription>Application readiness for traffic</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {readinessLoading && (
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            )}
            {readinessError && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{String(readinessError)}</AlertDescription>
              </Alert>
            )}
            {readiness && (
              <div className="space-y-2">
                <div className="flex items-center space-x-2 text-sm">
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                  <span className="font-medium">Ready for requests</span>
                </div>
                <pre className="rounded-md bg-muted p-4 text-xs overflow-auto">
                  {JSON.stringify(readiness, null, 2)}
                </pre>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center space-x-2">
            <Sparkles className="h-5 w-5" />
            <CardTitle>Type-Safe API Client</CardTitle>
          </div>
          <CardDescription>Auto-generated from OpenAPI schema</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          <p className="text-sm text-muted-foreground">
            This demo uses auto-generated TypeScript types from your NestJS
            OpenAPI schema. All API calls are fully type-checked at compile
            time!
          </p>
          <div className="rounded-md bg-muted p-3 text-sm font-mono">
            npm run generate:api
          </div>
          <p className="text-xs text-muted-foreground">
            Run this command to regenerate types after backend changes.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
