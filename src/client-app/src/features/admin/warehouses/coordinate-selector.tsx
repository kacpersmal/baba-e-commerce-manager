import { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import { MapPin, Search } from 'lucide-react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

// Fix Leaflet default marker icon
delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
})

interface CoordinateSelectorProps {
  latitude?: number
  longitude?: number
  address?: string
  city?: string
  country?: string
  onSelect: (lat: number, lng: number) => void
}

export function CoordinateSelector({
  latitude,
  longitude,
  address,
  city,
  country,
  onSelect,
}: CoordinateSelectorProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [mapCenter, setMapCenter] = useState<[number, number]>([
    latitude || 52.237049,
    longitude || 21.017532,
  ])
  const [markerPosition, setMarkerPosition] = useState<[number, number] | null>(
    latitude && longitude ? [latitude, longitude] : null,
  )
  const [searchAddress, setSearchAddress] = useState('')
  const mapRef = useRef<L.Map | null>(null)
  const markerRef = useRef<L.Marker | null>(null)
  const mapContainerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (latitude && longitude) {
      setMapCenter([latitude, longitude])
      setMarkerPosition([latitude, longitude])
    }
  }, [latitude, longitude])

  useEffect(() => {
    // Auto-populate search with current address
    if (address || city || country) {
      const parts = [address, city, country].filter(Boolean)
      setSearchAddress(parts.join(', '))
    }
  }, [address, city, country])

  // Initialize map when dialog opens
  useEffect(() => {
    if (!isOpen || !mapContainerRef.current || mapRef.current) return

    // Small delay to ensure the container has dimensions
    const timer = setTimeout(() => {
      if (!mapContainerRef.current) return

      const map = L.map(mapContainerRef.current).setView(
        mapCenter,
        markerPosition ? 15 : 6,
      )

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19,
      }).addTo(map)

      // Force map to recalculate size
      setTimeout(() => {
        map.invalidateSize()
      }, 100)

      if (markerPosition) {
        const marker = L.marker(markerPosition, { draggable: true }).addTo(map)
        markerRef.current = marker

        marker.on('dragend', () => {
          const pos = marker.getLatLng()
          setMarkerPosition([pos.lat, pos.lng])
        })
      }

      map.on('click', (e: L.LeafletMouseEvent) => {
        const { lat, lng } = e.latlng
        setMarkerPosition([lat, lng])

        if (markerRef.current) {
          markerRef.current.setLatLng([lat, lng])
        } else {
          const marker = L.marker([lat, lng], { draggable: true }).addTo(map)
          markerRef.current = marker

          marker.on('dragend', () => {
            const pos = marker.getLatLng()
            setMarkerPosition([pos.lat, pos.lng])
          })
        }
      })

      mapRef.current = map
    }, 100)

    return () => {
      clearTimeout(timer)
      if (mapRef.current) {
        mapRef.current.remove()
        mapRef.current = null
        markerRef.current = null
      }
    }
  }, [isOpen])

  // Update map center when search results change
  useEffect(() => {
    if (mapRef.current && markerPosition) {
      mapRef.current.setView(markerPosition, 15)
      if (markerRef.current) {
        markerRef.current.setLatLng(markerPosition)
      }
    }
  }, [markerPosition])

  const handleSearch = async () => {
    if (!searchAddress) return

    try {
      // Use Nominatim API for geocoding
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchAddress)}`,
      )
      const data = await response.json()

      if (data && data.length > 0) {
        const { lat, lon } = data[0]
        const newPosition: [number, number] = [parseFloat(lat), parseFloat(lon)]
        setMapCenter(newPosition)
        setMarkerPosition(newPosition)
      }
    } catch (error) {
      console.error('Geocoding error:', error)
    }
  }

  const handleConfirm = () => {
    if (markerPosition) {
      onSelect(markerPosition[0], markerPosition[1])
      setIsOpen(false)
    }
  }

  const displayValue =
    latitude && longitude
      ? `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`
      : 'Click to select coordinates'

  return (
    <>
      <Button
        type="button"
        variant="outline"
        className="w-full justify-start text-left font-normal"
        onClick={() => setIsOpen(true)}
      >
        <MapPin className="mr-2 h-4 w-4" />
        {displayValue}
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Select Coordinates</DialogTitle>
            <DialogDescription>
              Search for an address or click on the map to set coordinates
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {/* Search */}
            <div className="flex gap-2">
              <div className="flex-1">
                <Input
                  placeholder="Search address..."
                  value={searchAddress}
                  onChange={(e) => setSearchAddress(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault()
                      handleSearch()
                    }
                  }}
                />
              </div>
              <Button type="button" onClick={handleSearch}>
                <Search className="mr-2 h-4 w-4" />
                Search
              </Button>
            </div>

            {/* Map */}
            <div
              ref={mapContainerRef}
              className="h-[400px] overflow-hidden rounded-lg border"
            />

            {/* Coordinate Display */}
            {markerPosition && (
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Latitude</Label>
                  <Input
                    type="number"
                    step="any"
                    value={markerPosition[0]}
                    onChange={(e) =>
                      setMarkerPosition([
                        parseFloat(e.target.value),
                        markerPosition[1],
                      ])
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>Longitude</Label>
                  <Input
                    type="number"
                    step="any"
                    value={markerPosition[1]}
                    onChange={(e) =>
                      setMarkerPosition([
                        markerPosition[0],
                        parseFloat(e.target.value),
                      ])
                    }
                  />
                </div>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleConfirm}
              disabled={!markerPosition}
            >
              Confirm Location
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
