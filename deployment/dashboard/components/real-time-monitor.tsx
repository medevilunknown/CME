"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { SatelliteDish, Loader2, Check } from "lucide-react"

/**
 * Displays live telemetry status for the SWIS-ASPEX data stream.
 * Fetches real-time data from the API while maintaining original UI.
 */
export default function RealTimeMonitor() {
  const [status, setStatus] = useState<"connecting" | "active" | "disconnected">("connecting")
  const [latency, setLatency] = useState<number | null>(null)

  useEffect(() => {
    const fetchRealTimeData = async () => {
      try {
        // Measure actual latency by pinging the API
        const startTime = performance.now()
        await fetch('http://localhost:8000/api/system-metrics')
        const endTime = performance.now()
        const measuredLatency = (endTime - startTime) / 1000 // Convert to seconds
        
        setLatency(measuredLatency)
        setStatus("active")
        
      } catch (err) {
        console.error('Error fetching real-time data:', err)
        setStatus("disconnected")
      }
    }

    // Initial fetch
    fetchRealTimeData()
    
    // Set up polling every 30 seconds
    const interval = setInterval(fetchRealTimeData, 30000)
    
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="space-y-6">
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <SatelliteDish className="h-5 w-5 text-blue-400" />
            Real-time Telemetry
          </CardTitle>
          <CardDescription>Live SWIS-ASPEX stream status and latency measurements</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Connection Status */}
            <div className="flex items-center gap-3">
              {status === "connecting" && <Loader2 className="h-4 w-4 animate-spin text-yellow-400" />}
              {status === "active" && <Check className="h-4 w-4 text-green-400" />}
              <span className="text-sm">
                {status === "connecting" && "Establishing link to Aditya-L1…"}
                {status === "active" && "Connection active"}
                {status === "disconnected" && "Disconnected"}
              </span>
            </div>

            {/* Latency Display */}
            {latency !== null && (
              <Alert className="border-blue-500/50 bg-blue-500/10">
                <AlertDescription>
                  Current end-to-end latency: <strong>{latency.toFixed(1)} s</strong>
                </AlertDescription>
              </Alert>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
