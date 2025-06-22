"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Database, Filter, TrendingUp, CheckCircle, AlertCircle, Download, Upload, Settings, AlertTriangle } from "lucide-react"
import { fetchDataMetrics, fetchPipelineSteps, DataMetrics, PipelineStep } from "@/lib/api"

export default function DataPipeline() {
  const [pipelineStatus, setPipelineStatus] = useState("running")
  const [dataMetrics, setDataMetrics] = useState<DataMetrics | null>(null)
  const [pipelineSteps, setPipelineSteps] = useState<PipelineStep[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true)
        const [metrics, steps] = await Promise.all([
          fetchDataMetrics(),
          fetchPipelineSteps()
        ])
        setDataMetrics(metrics)
        setPipelineSteps(steps)
        setError(null)
      } catch (err) {
        setError('Failed to load pipeline data')
        console.error('Error loading pipeline data:', err)
      } finally {
        setLoading(false)
      }
    }

    loadData()
    
    // Refresh data every 60 seconds
    const interval = setInterval(loadData, 60000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="space-y-6">
      {/* Error Alert */}
      {error && (
        <Alert className="border-red-500/50 bg-red-500/10">
          <AlertTriangle className="h-4 w-4 text-red-400" />
          <AlertDescription>
            {error} - Please ensure the API server is running
          </AlertDescription>
        </Alert>
      )}

      {/* Pipeline Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Total Volume</p>
                <p className="text-xl font-bold text-blue-400">
                  {loading ? "..." : dataMetrics?.totalVolume}
                </p>
              </div>
              <Database className="h-6 w-6 text-blue-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Daily Ingestion</p>
                <p className="text-xl font-bold text-green-400">
                  {loading ? "..." : dataMetrics?.dailyIngestion}
                </p>
              </div>
              <TrendingUp className="h-6 w-6 text-green-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Quality Score</p>
                <p className="text-xl font-bold text-purple-400">
                  {loading ? "..." : dataMetrics?.qualityScore.toFixed(1) + "%"}
                </p>
              </div>
              <CheckCircle className="h-6 w-6 text-purple-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Missing Data</p>
                <p className="text-xl font-bold text-orange-400">
                  {loading ? "..." : dataMetrics?.missingDataRate.toFixed(1) + "%"}
                </p>
              </div>
              <AlertCircle className="h-6 w-6 text-orange-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Pipeline Steps */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle>Data Processing Pipeline</CardTitle>
          <CardDescription>Real-time processing of SWIS-ASPEX particle data from Aditya-L1</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {loading ? (
              <div className="text-center py-8 text-slate-400">Loading pipeline data...</div>
            ) : (
              pipelineSteps.map((step) => {
                const Icon = step.icon || Database
              return (
                <div key={step.id} className="flex items-center gap-4 p-4 rounded-lg bg-slate-700/30">
                  <Icon
                    className={`h-6 w-6 ${
                      step.status === "completed"
                        ? "text-green-400"
                        : step.status === "running"
                          ? "text-blue-400"
                          : "text-slate-400"
                    }`}
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold">{step.name}</h3>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-slate-400">{step.throughput}</span>
                        <Badge variant={step.status === "completed" ? "default" : "secondary"}>{step.status}</Badge>
                      </div>
                    </div>
                    <p className="text-sm text-slate-400 mb-2">{step.description}</p>
                    <Progress value={step.progress} className="h-2" />
                  </div>
                </div>
              )
              })
            )}
          </div>
        </CardContent>
      </Card>

      {/* Data Sources */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle>SWIS Data Streams</CardTitle>
            <CardDescription>Solar Wind Ion Spectrometer</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm">Proton Density</span>
                <Badge variant="outline" className="bg-green-500/20 text-green-300">
                  Active
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Alpha Particle Flux</span>
                <Badge variant="outline" className="bg-green-500/20 text-green-300">
                  Active
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Velocity Vectors</span>
                <Badge variant="outline" className="bg-green-500/20 text-green-300">
                  Active
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Temperature</span>
                <Badge variant="outline" className="bg-yellow-500/20 text-yellow-300">
                  Intermittent
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle>STEPS Data Streams</CardTitle>
            <CardDescription>Supra Thermal & Energetic Particle Spectrometer</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm">Energetic Protons</span>
                <Badge variant="outline" className="bg-green-500/20 text-green-300">
                  Active
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Energetic Electrons</span>
                <Badge variant="outline" className="bg-green-500/20 text-green-300">
                  Active
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Heavy Ions</span>
                <Badge variant="outline" className="bg-yellow-500/20 text-yellow-300">
                  Intermittent
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Directional Flux</span>
                <Badge variant="outline" className="bg-green-500/20 text-green-300">
                  Active
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Control Panel */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle>Pipeline Controls</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <Button variant="outline" className="bg-green-500/20 text-green-300 border-green-500">
              <Upload className="h-4 w-4 mr-2" />
              Start Ingestion
            </Button>
            <Button variant="outline" className="bg-orange-500/20 text-orange-300 border-orange-500">
              Pause Pipeline
            </Button>
            <Button variant="outline" className="bg-blue-500/20 text-blue-300 border-blue-500">
              <Settings className="h-4 w-4 mr-2" />
              Configure
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
