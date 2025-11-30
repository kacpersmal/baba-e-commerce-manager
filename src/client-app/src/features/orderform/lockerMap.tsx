"use client"

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet"
import L from "leaflet"
import "leaflet/dist/leaflet.css"


import markerIconPng from "leaflet/dist/images/marker-icon.png"
import markerShadowPng from "leaflet/dist/images/marker-shadow.png"


export type Locker = {
    id: number
    name: string
    lat: number
    lng: number
    street: string
    city: string
    postalCode: string
    country: string
}


type LockerMapProps = {
    onSelectLocker: (locker: Locker) => void
}

// Lista przykładowych paczkomatów

const lockers: Locker[] = [
    {
        id: 1,
        name: "Paczkomat WAW125M – Kasprzaka 11",
        lat: 52.2245,
        lng: 20.9790,
        street: "Kasprzaka 11",
        city: "Warszawa",
        postalCode: "01-211",
        country: "Polska"
    },
    {
        id: 2,
        name: "Paczkomat WAW404M – pl. Wojska Polskiego 114",
        lat: 52.2240,
        lng: 21.0510,
        street: "pl. Wojska Polskiego 114",
        city: "Warszawa",
        postalCode: "00-909",
        country: "Polska"
    },
    {
        id: 3,
        name: "Paczkomat WAW183M – Wspólna 22A",
        lat: 52.2467,
        lng: 21.1878,
        street: "Wspólna 22A",
        city: "Warszawa",
        postalCode: "00-516",
        country: "Polska"
    },
    {
        id: 4,
        name: "Paczkomat WAW156M – Międzynarodowa 32",
        lat: 52.2307,
        lng: 21.0684,
        street: "Międzynarodowa 32",
        city: "Warszawa",
        postalCode: "02-844",
        country: "Polska"
    },
    {
        id: 5,
        name: "Paczkomat WAW35M – Warszawska 58C",
        lat: 52.2150,
        lng: 20.9920,
        street: "Warszawska 58C",
        city: "Warszawa",
        postalCode: "01-201",
        country: "Polska"
    }
]



const defaultIcon = L.icon({
    iconUrl: markerIconPng,
    shadowUrl: markerShadowPng,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
})

L.Marker.prototype.options.icon = defaultIcon

export default function LockerMap({ onSelectLocker }: LockerMapProps) {
    return (
        <div className="mt-4 w-full">
            <div className="h-80 w-full">
                <MapContainer
                    center={[52.2297, 21.0122]}
                    zoom={14}
                    className="h-full w-full"
                >
                    <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        attribution='&copy; OpenStreetMap contributors'
                    />

                    {lockers.map((locker) => (
                        <Marker
                            key={locker.id}
                            position={[locker.lat, locker.lng]}
                            eventHandlers={{
                                click: () => onSelectLocker(locker),
                            }}
                        >
                            <Popup>{locker.name}</Popup>
                        </Marker>
                    ))}
                </MapContainer>
            </div>
        </div>
    )
}
