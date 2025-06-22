"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Database, Filter, TrendingUp, CheckCircle, AlertCircle, Download, Upload, Settings, AlertTriangle, Cpu, HardDrive, Zap } from "lucide-react"
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

  const getStepIcon = (stepId: string) => {
    switch (stepId) {
      case 'ingestion': return Download
      case 'cleaning': return Filter
      case 'preprocessing': return Cpu
      case 'storage': return HardDrive
      default: return Database
    }
  }

  return (
    <div className="space-y-6">
      {/* Error Alert */}
      {error && (
        <Alert className="border-red-500/50 bg-red-500/10 backdrop-blur-sm">
          <AlertTriangle className="h-4 w-4 text-red-400" />
          <AlertDescription className="text-red-200">
            {error} - Please ensure the API server is running
          </AlertDescription>
        </Alert>
      )}

      {/* Enhanced Pipeline Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-slate-800/40 border-slate-700/50 backdrop-blur-sm hover:bg-slate-800/60 transition-all duration-300 group">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400 mb-1">Total Volume</p>
                <p className="text-2xl font-bold text-blue-400 group-hover:scale-105 transition-transform">
                  {loading ? "..." : dataMetrics?.totalVolume}
                </p>
                <p className="text-xs text-blue-300/70 mt-1">Processed data</p>
              </div>
              <Database className="h-8 w-8 text-blue-400 group-hover:animate-pulse" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/40 border-slate-700/50 backdrop-blur-sm hover:bg-slate-800/60 transition-all duration-300 group">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400 mb-1">Daily Ingestion</p>
                <p className="text-2xl font-bold text-green-400 group-hover:scale-105 transition-transform">
                  {loading ? "..." : dataMetrics?.dailyIngestion}
                </p>
                <p className="text-xs text-green-300/70 mt-1">Average rate</p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-400 group-hover:animate-pulse" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/40 border-slate-700/50 backdrop-blur-sm hover:bg-slate-800/60 transition-all duration-300 group">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400 mb-1">Quality Score</p>
                <p className="text-2xl font-bold text-purple-400 group-hover:scale-105 transition-transform">
                  {loading ? "..." : dataMetrics?.qualityScore.toFixed(1) + "%"}
                </p>
                <div className="w-full bg-slate-700/50 rounded-full h-1 mt-2">
                  <div 
                    className="bg-purple-400 h-1 rounded-full transition-all duration-1000"
                    style={{ width: `${dataMetrics?.qualityScore || 0}%` }}
                  ></div>
                </div>
              </div>
              <CheckCircle className="h-8 w-8 text-purple-400 group-hover:animate-pulse" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/40 border-slate-700/50 backdrop-blur-sm hover:bg-slate-800/60 transition-all duration-300 group">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400 mb-1">Missing Data</p>
                <p className="text-2xl font-bold text-orange-400 group-hover:scale-105 transition-transform">
                  {loading ? "..." : dataMetrics?.missingDataRate.toFixed(1) + "%"}
                </p>
                <div className="w-full bg-slate-700/50 rounded-full h-1 mt-2">
                  <div 
                    className="bg-orange-400 h-1 rounded-full transition-all duration-1000"
                    style={{ width: `${dataMetrics?.missingDataRate || 0}%` }}
                  ></div>
                </div>
              </div>
              <AlertCircle className="h-8 w-8 text-orange-400 group-hover:animate-pulse" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Enhanced Pipeline Steps */}
      <Card className="bg-slate-800/40 border-slate-700/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-xl">Data Processing Pipeline</CardTitle>
          <CardDescription>Real-time processing of SWIS-ASPEX particle data from Aditya-L1</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {loading ? (
              <div className="text-center py-8 text-slate-400">Loading pipeline data...</div>
            ) : (
              pipelineSteps.map((step, index) => {
                const Icon = getStepIcon(step.id)
                return (
                  <div key={step.id} className="relative">
                    <div className="flex items-center gap-6 p-6 rounded-xl bg-slate-700/30 hover:bg-slate-700/50 transition-all duration-300 border border-slate-600/50">
                      <div className="relative">
                        <Icon
                          className={`h-8 w-8 ${
                            step.status === "completed"
                              ? "text-green-400"
                              : step.status === "running"
                                ? "text-blue-400"
                                : "text-slate-400"
                          }`}
                        />
                        {step.status === "running" && (
                          <div className="absolute -inset-2 bg-blue-400/20 rounded-full animate-ping"></div>
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-3">
                          <h3 className="font-semibold text-lg">{step.name}</h3>
                          <div className="flex items-center gap-3">
                            <span className="text-sm text-slate-400 font-mono">{step.throughput}</span>
                            <Badge 
                              variant={step.status === "completed" ? "default" : "secondary"}
                              className={
                                step.status === "completed"
                                  ? "bg-green-500/20 text-green-300 border-green-500/50"
                                  : step.status === "running"
                                    ? "bg-blue-500/20 text-blue-300 border-blue-500/50"
                                    : ""
                              }
                            >
                              {step.status}
                            </Badge>
                          </div>
                        </div>
                        <p className="text-sm text-slate-400 mb-3">{step.description}</p>
                        <div className="space-y-2">
                          <Progress value={step.progress} className="h-3" />
                          <p className="text-xs text-slate-500">{step.progress}% complete</p>
                        </div>
                      </div>
                    </div>
                    {index < pipelineSteps.length - 1 && (
                      <div className="absolute left-10 top-full w-0.5 h-6 bg-slate-600"></div>
                    )}
                  </div>
                )
              })
            )}
          </div>
        </CardContent>
      </Card>

      {/* Enhanced Data Sources */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-slate-800/40 border-slate-700/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-orange-400" />
              SWIS Data Streams
            </CardTitle>
            <CardDescription>Solar Wind Ion Spectrometer</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { name: "Proton Density", status: "active" },
                { name: "Alpha Particle Flux", status: "active" },
                { name: "Velocity Vectors", status: "active" },
                { name: "Temperature", status: "intermittent" }
              ].map((stream, index) => (
                <div key={index} className="flex justify-between items-center p-3 rounded-lg bg-slate-700/30">
                  <span className="text-sm font-medium">{stream.name}</span>
                  <Badge 
                    variant="outline" 
                    className={
                      stream.status === "active"
                        ? "bg-green-500/20 text-green-300 border-green-500/50"
                        : "bg-yellow-500/20 text-yellow-300 border-yellow-500/50"
                    }
                  >
                    <div className={`w-2 h-2 rounded-full mr-2 ${
                      stream.status === "active" ? "bg-green-400 animate-pulse" : "bg-yellow-400"
                    }`}></div>
                    {stream.status}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/40 border-slate-700/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-blue-400" />
              STEPS Data Streams
            </CardTitle>
            <CardDescription>Supra Thermal & Energetic Particle Spectrometer</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { name: "Energetic Protons", status: "active" },
                { name: "Energetic Electrons", status: "active" },
                { name: "Heavy Ions", status: "intermittent" },
                { name: "Directional Flux", status: "active" }
              ].map((stream, index) => (
                <div key={index} className="flex justify-between items-center p-3 rounded-lg bg-slate-700/30">
                  <span className="text-sm font-medium">{stream.name}</span>
                  <Badge 
                    variant="outline" 
                    className={
                      stream.status === "active"
                        ? "bg-green-500/20 text-green-300 border-green-500/50"
                        : "bg-yellow-500/20 text-yellow-300 border-yellow-500/50"
                    }
                  >
                    <div className={`w-2 h-2 rounded-full mr-2 ${
                      stream.status === "active" ? "bg-green-400 animate-pulse" : "bg-yellow-400"
                    }`}></div>
                    {stream.status}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Enhanced Control Panel */}
      <Card className="bg-slate-800/40 border-slate-700/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle>Pipeline Controls</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <Button variant="outline" className="bg-green-500/20 text-green-300 border-green-500/50 hover:bg-green-500/30">
              <Upload className="h-4 w-4 mr-2" />
              Start Ingestion
            </Button>
            <Button variant="outline" className="bg-orange-500/20 text-orange-300 border-orange-500/50 hover:bg-orange-500/30">
              Pause Pipeline
            </Button>
            <Button variant="outline" className="bg-blue-500/20 text-blue-300 border-blue-500/50 hover:bg-blue-500/30">
              <Settings className="h-4 w-4 mr-2" />
              Configure
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}