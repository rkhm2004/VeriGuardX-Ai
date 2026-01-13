"use client"

import { useEffect, useRef } from "react"
import { MapPin, ArrowRight } from "lucide-react"

interface Location {
  code: string
  name: string
  lat: number
  lon: number
}

interface MapVisualizerProps {
  route: string[]
  currentStage: string
}

const locationData: Record<string, Location> = {
  "FACTORY_SIEMENS_DE": { code: "FACTORY_SIEMENS_DE", name: "Siemens Factory", lat: 48.7758, lon: 9.1829 },
  "HUB_BERLIN": { code: "HUB_BERLIN", name: "Berlin Hub", lat: 52.5200, lon: 13.4050 },
  "HUB_MUNICH": { code: "HUB_MUNICH", name: "Munich Hub", lat: 48.1351, lon: 11.5820 },
  "WAREHOUSE_DE": { code: "WAREHOUSE_DE", name: "Germany Warehouse", lat: 50.1109, lon: 8.6821 },
  "HUB_TOKYO": { code: "HUB_TOKYO", name: "Tokyo Hub", lat: 35.6762, lon: 139.6503 },
  "WAREHOUSE_JP": { code: "WAREHOUSE_JP", name: "Japan Warehouse", lat: 35.4437, lon: 139.6380 },
  "HUB_NYC": { code: "HUB_NYC", name: "New York Hub", lat: 40.7128, lon: -74.0060 },
  "FACTORY_US_EAST": { code: "FACTORY_US_EAST", name: "US East Factory", lat: 42.3601, lon: -71.0589 },
}

export function MapVisualizer({ route, currentStage }: MapVisualizerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas size
    canvas.width = canvas.offsetWidth
    canvas.height = canvas.offsetHeight

    // Clear canvas
    ctx.fillStyle = "#f8fafc"
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // Get location data for route
    const locations = route.map(code => locationData[code]).filter(Boolean)
    if (locations.length === 0) return

    // Calculate bounds for zooming
    const lats = locations.map(l => l.lat)
    const lons = locations.map(l => l.lon)
    const minLat = Math.min(...lats)
    const maxLat = Math.max(...lats)
    const minLon = Math.min(...lons)
    const maxLon = Math.max(...lons)

    // Add padding
    const padding = 50
    const latRange = maxLat - minLat || 10
    const lonRange = maxLon - minLon || 10

    // Scale function
    const scaleX = (lon: number) => 
      ((lon - minLon) / lonRange) * (canvas.width - 2 * padding) + padding
    const scaleY = (lat: number) => 
      canvas.height - (((lat - minLat) / latRange) * (canvas.height - 2 * padding) + padding)

    // Draw connections
    ctx.strokeStyle = "#cbd5e1"
    ctx.lineWidth = 2
    ctx.setLineDash([5, 5])
    for (let i = 0; i < locations.length - 1; i++) {
      const from = locations[i]
      const to = locations[i + 1]
      ctx.beginPath()
      ctx.moveTo(scaleX(from.lon), scaleY(from.lat))
      ctx.lineTo(scaleX(to.lon), scaleY(to.lat))
      ctx.stroke()
    }
    ctx.setLineDash([])

    // Draw locations
    locations.forEach((location, index) => {
      const x = scaleX(location.lon)
      const y = scaleY(location.lat)
      const isCurrent = location.code === currentStage
      const isPast = route.indexOf(currentStage) > index

      // Circle
      ctx.beginPath()
      ctx.arc(x, y, 12, 0, Math.PI * 2)
      ctx.fillStyle = isCurrent ? "#3b82f6" : isPast ? "#10b981" : "#e2e8f0"
      ctx.fill()
      ctx.strokeStyle = isCurrent ? "#1e40af" : isPast ? "#059669" : "#94a3b8"
      ctx.lineWidth = 2
      ctx.stroke()

      // Label
      ctx.fillStyle = "#1e293b"
      ctx.font = "12px sans-serif"
      ctx.textAlign = "center"
      ctx.fillText(location.name, x, y + 25)
    })
  }, [route, currentStage])

  return (
    <div className="space-y-4">
      <canvas
        ref={canvasRef}
        className="w-full h-96 border rounded-lg"
      />
      <div className="flex items-center gap-2 text-sm text-muted-foreground flex-wrap">
        {route.map((code, index) => (
          <div key={code} className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              <MapPin className={`w-4 h-4 ${
                code === currentStage ? "text-blue-600" : 
                route.indexOf(currentStage) > index ? "text-green-600" : 
                "text-gray-400"
              }`} />
              <span className={code === currentStage ? "font-semibold text-foreground" : ""}>
                {locationData[code]?.name || code}
              </span>
            </div>
            {index < route.length - 1 && <ArrowRight className="w-4 h-4" />}
          </div>
        ))}
      </div>
    </div>
  )
}