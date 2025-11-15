import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Edit2, Trash2 } from 'lucide-react'
import type { components } from '@/lib/api/schema'

type WarehouseResponse = components['schemas']['WarehouseResponseDto']

interface WarehouseCardProps {
  warehouse: WarehouseResponse
  onEdit: (warehouse: WarehouseResponse) => void
  onDelete: (warehouse: WarehouseResponse) => void
}

export function WarehouseCard({
  warehouse,
  onEdit,
  onDelete,
}: WarehouseCardProps) {
  return (
    <Card className="transition-all hover:shadow-md">
      <CardContent className="p-6">
        <div className="space-y-4">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h3 className="font-semibold">{warehouse.name}</h3>
              <p className="text-sm text-muted-foreground">{warehouse.code}</p>
            </div>
            <Badge variant={warehouse.isActive ? 'default' : 'secondary'}>
              {warehouse.isActive ? 'Active' : 'Inactive'}
            </Badge>
          </div>

          {warehouse.description && (
            <p className="line-clamp-2 text-sm text-muted-foreground">
              {warehouse.description}
            </p>
          )}

          <div className="space-y-1 text-sm">
            <p className="font-medium">Location</p>
            <p className="text-muted-foreground">{warehouse.address}</p>
            <p className="text-muted-foreground">
              {warehouse.city}
              {warehouse.state && `, ${warehouse.state}`}
            </p>
            <p className="text-muted-foreground">
              {warehouse.country} {warehouse.postalCode}
            </p>
          </div>

          <div className="space-y-1 text-sm">
            <p className="font-medium">Contact</p>
            <p className="text-muted-foreground">{warehouse.contactName}</p>
            <p className="text-muted-foreground">{warehouse.contactEmail}</p>
            <p className="text-muted-foreground">{warehouse.contactPhone}</p>
          </div>

          <div className="flex gap-2 pt-2">
            <Button
              size="sm"
              variant="outline"
              className="flex-1"
              onClick={() => onEdit(warehouse)}
            >
              <Edit2 className="mr-2 h-3.5 w-3.5" />
              Edit
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="flex-1"
              onClick={() => onDelete(warehouse)}
            >
              <Trash2 className="mr-2 h-3.5 w-3.5 text-destructive" />
              Delete
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
