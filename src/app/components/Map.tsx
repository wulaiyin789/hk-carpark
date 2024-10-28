'use client'

import Link from 'next/link'
import { useTranslations } from 'next-intl'
import { usePathname } from 'next/navigation'
import { useState, useRef, useEffect } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import L from 'leaflet'
import { Button } from '@radix-ui/themes'

// Components
import MapMarker from './MapMarker'

// Types
import { CombinedCarParkData } from '../types/carpark'

type MapProps = {
  carParks: CombinedCarParkData[]
  selectedCarPark: CombinedCarParkData | null
}

const HONG_KONG_CENTER: [number, number] = [22.3193, 114.1694]
const INITIAL_ZOOM = 11
const ZOOMED_IN_LEVEL = 15
const MAX_PINS_PER_CLUSTER = 10
const CLUSTER_RADIUS = 0.01 // Approximately 1km

function ChangeView({ center, zoom }: { center: [number, number]; zoom: number }) {
  const map = useMap()
  useEffect(() => {
    map.setView(center, zoom)
  }, [center, zoom, map])
  return null
}

function createClusters(carParks: CombinedCarParkData[]): { [key: string]: CombinedCarParkData[] } {
  const clusters: { [key: string]: CombinedCarParkData[] } = {}

  carParks.forEach((carPark) => {
    const clusterKey = `${Math.round(carPark.latitude / CLUSTER_RADIUS)},${Math.round(
      carPark.longitude / CLUSTER_RADIUS
    )}`
    if (!clusters[clusterKey]) {
      clusters[clusterKey] = []
    }
    clusters[clusterKey].push(carPark)
  })

  return clusters
}

export default function Map({ carParks, selectedCarPark }: MapProps) {
  const t = useTranslations('map')
  const pathname = usePathname()
  const locale = pathname.split('/')[1]

  const [isZoomedIn, setIsZoomedIn] = useState(false)
  const [mapCenter, setMapCenter] = useState<[number, number]>(HONG_KONG_CENTER)
  const [mapZoom, setMapZoom] = useState(INITIAL_ZOOM)
  const mapRef = useRef<L.Map | null>(null)
  const markerRefs = useRef<{ [parkId: string]: L.Marker | null }>({});

  const clusters = createClusters(carParks)

  useEffect(() => {
    if (selectedCarPark) {
      setIsZoomedIn(true)
      setMapCenter([selectedCarPark.latitude, selectedCarPark.longitude])
      setMapZoom(ZOOMED_IN_LEVEL)
      const id = selectedCarPark.park_Id || ''

      if (id && markerRefs?.current && markerRefs.current[id]) {
        const markerToOpen = markerRefs.current[id]
        markerToOpen.openPopup()
      }
    }
  }, [selectedCarPark])

  const handleMarkerClick = (lat: number, lng: number) => {
    setIsZoomedIn(true)
    setMapCenter([lat, lng])
    setMapZoom(ZOOMED_IN_LEVEL)
  }

  const handleResetView = () => {
    setIsZoomedIn(false)
    setMapCenter(HONG_KONG_CENTER)
    setMapZoom(INITIAL_ZOOM)
  }

  return (
    <div className="relative h-full w-full">
      <MapContainer center={mapCenter} zoom={mapZoom} className="h-full w-full" ref={mapRef}>
        <ChangeView center={mapCenter} zoom={mapZoom} />
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {Object.entries(clusters).map(([key, clusterCarParks]) => {
          // const [lat, lng] = key.split(',').map(Number)
          const count = clusterCarParks.length
          const centerLat = clusterCarParks.reduce((sum, cp) => sum + cp.latitude, 0) / count
          const centerLng = clusterCarParks.reduce((sum, cp) => sum + cp.longitude, 0) / count

          if (!isZoomedIn || count > MAX_PINS_PER_CLUSTER) {
            return (
              <Marker
                key={key}
                position={[centerLat, centerLng]}
                icon={MapMarker}
                eventHandlers={{
                  click: () => handleMarkerClick(centerLat, centerLng),
                }}
              >
                <Popup className="pb-5">
                  <div className="text-center">
                    <p className="font-bold">{t('carparksInArea', { count })}</p>
                    <Button onClick={() => handleMarkerClick(centerLat, centerLng)}>{t('viewAll')}</Button>
                  </div>
                </Popup>
              </Marker>
            )
          } else {
            return clusterCarParks.map((carPark) => (
              <Marker
                ref={(ref) => {
                  markerRefs.current[carPark.park_Id] = ref
                }}
                key={carPark.park_Id}
                icon={MapMarker}
                position={[carPark.latitude, carPark.longitude]}
              >
                <Popup className="pb-5">
                  <div className="max-w-xs">
                    <h2 className="text-lg font-bold">{carPark.name}</h2>
                    <p className="text-sm">{carPark.displayAddress}</p>
                    <p className="text-sm mt-2">
                      {t('vacancies')}: {carPark.vacancy.privateCar?.[0]?.vacancy || 'N/A'}
                    </p>
                    <Link href={`/${locale}/${carPark.park_Id}`}>
                      <Button className="mt-2 w-full">{t('viewDetails')}</Button>
                    </Link>
                  </div>
                </Popup>
              </Marker>
            ))
          }
        })}
      </MapContainer>
      {isZoomedIn && (
        <Button className="absolute top-4 right-4 z-[1000]" onClick={handleResetView}>
          {t('resetView')}
        </Button>
      )}
    </div>
  )
}
