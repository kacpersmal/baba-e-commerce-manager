import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { MapPin, Building2, Phone, Mail } from 'lucide-react'
import type { components } from '@/lib/api/schema'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'

// Fix Leaflet default marker icons
delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
})

type WarehouseResponse = components['schemas']['WarehouseResponseDto']

interface WarehouseDashboardProps {
  warehouses: WarehouseResponse[]
  onSelectWarehouse?: (warehouse: WarehouseResponse) => void
}

export function WarehouseDashboard({
  warehouses,
  onSelectWarehouse,
}: WarehouseDashboardProps) {
  // Ensure warehouses is always an array
  console.log('Warehouses:', warehouses)
  const warehouseList = Array.isArray(warehouses) ? warehouses : []

  // Calculate center point
  const center: [number, number] =
    warehouseList.length > 0
      ? [
          warehouseList.reduce((sum, w) => sum + w.latitude, 0) /
            warehouseList.length,
          warehouseList.reduce((sum, w) => sum + w.longitude, 0) /
            warehouseList.length,
        ]
      : [52.237049, 21.017532] // Default to Warsaw

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      {/* Map */}
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Warehouse Locations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[600px] overflow-hidden rounded-lg border">
            <MapContainer
              center={center}
              zoom={6}
              style={{ height: '100%', width: '100%' }}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              {warehouseList.map((warehouse) => (
                <Marker
                  key={warehouse.id}
                  position={[warehouse.latitude, warehouse.longitude]}
                  eventHandlers={{
                    click: () => onSelectWarehouse?.(warehouse),
                  }}
                >
                  <Popup>
                    <div className="space-y-2">
                      <div>
                        <p className="font-semibold">{warehouse.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {warehouse.code}
                        </p>
                      </div>
                      <div className="text-sm">
                        <p>{warehouse.address}</p>
                        <p>
                          {warehouse.city}, {warehouse.country}
                        </p>
                      </div>
                      <Badge
                        variant={warehouse.isActive ? 'default' : 'secondary'}
                      >
                        {warehouse.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          </div>
        </CardContent>
      </Card>

      {/* Warehouse List */}
      <Card className="lg:col-span-1">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Warehouses ({warehouseList.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="max-h-[600px] space-y-3 overflow-y-auto">
            {warehouseList.map((warehouse) => (
              <Card
                key={warehouse.id}
                className="cursor-pointer transition-all hover:shadow-md"
                onClick={() => onSelectWarehouse?.(warehouse)}
              >
                <CardContent className="p-4">
                  <div className="space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <h4 className="font-semibold">{warehouse.name}</h4>
                        <p className="text-sm text-muted-foreground">
                          {warehouse.code}
                        </p>
                      </div>
                      <Badge
                        variant={warehouse.isActive ? 'default' : 'secondary'}
                      >
                        {warehouse.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                    </div>

                    {warehouse.description && (
                      <p className="line-clamp-2 text-sm text-muted-foreground">
                        {warehouse.description}
                      </p>
                    )}

                    <div className="space-y-1 text-sm">
                      <div className="flex items-center gap-1.5 text-muted-foreground">
                        <MapPin className="h-3.5 w-3.5 shrink-0" />
                        <span className="line-clamp-1">
                          {warehouse.city}, {warehouse.country}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 text-muted-foreground">
                        <Phone className="h-3.5 w-3.5 shrink-0" />
                        <span className="line-clamp-1">
                          {warehouse.contactPhone}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 text-muted-foreground">
                        <Mail className="h-3.5 w-3.5 shrink-0" />
                        <span className="line-clamp-1">
                          {warehouse.contactEmail}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            {warehouseList.length === 0 && (
              <div className="py-8 text-center text-muted-foreground">
                No warehouses found
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
