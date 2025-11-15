import { createFileRoute } from '@tanstack/react-router'
import { Loader2, AlertCircle } from 'lucide-react'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { WarehouseDashboard } from '@/features/admin/warehouses/warehouse-dashboard'
import { useWarehouses } from '@/features/admin/warehouses/hooks'

export const Route = createFileRoute('/admin/warehouses/map')({
  component: RouteComponent,
})

function RouteComponent() {
  const { data: response, isLoading, error } = useWarehouses()

  if (isLoading) {
    return (
      <div className="flex h-[calc(100vh-4rem)] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Failed to load warehouses: {error.message}
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  const warehouses = response?.data || []

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Warehouse Map</h1>
        <p className="text-muted-foreground">
          View all warehouse locations and information
          {response && ` • ${response.meta.total} total warehouses`}
        </p>
      </div>

      <WarehouseDashboard warehouses={warehouses} />
    </div>
  )
}
