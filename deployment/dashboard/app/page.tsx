"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import { Activity, Brain, Database, Zap, AlertTriangle, CheckCircle, TrendingUp, Satellite, Sun, Sparkles } from "lucide-react"
import DataPipeline from "@/components/data-pipeline"
import ModelDashboard from "@/components/model-dashboard"
import AnomalyDetection from "@/components/anomaly-detection"
import XAIExplainer from "@/components/xai-explainer"
import RealTimeMonitor from "@/components/real-time-monitor"
import { fetchSystemMetrics, SystemMetrics } from "@/lib/api"

export default function PIGADEXDashboard() {
  const [activePhase, setActivePhase] = useState("setup")
  const [systemMetrics, setSystemMetrics] = useState<SystemMetrics | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadSystemMetrics = async () => {
      try {
        setLoading(true)
        const metrics = await fetchSystemMetrics()
        setSystemMetrics(metrics)
        setError(null)
      } catch (err) {
        setError('Failed to load system metrics')
        console.error('Error loading system metrics:', err)
      } finally {
        setLoading(false)
      }
    }

    loadSystemMetrics()
    
    // Refresh metrics every 30 seconds
    const interval = setInterval(loadSystemMetrics, 30000)
    return () => clearInterval(interval)
  }, [])

  const phases = [
    {
      id: "setup",
      name: "Phase 1: Setup & Data Prep",
      duration: "3 months",
      status: "active",
      progress: 75,
      icon: Database,
    },
    {
      id: "development",
      name: "Phase 2: Model Development",
      duration: "6 months",
      status: "pending",
      progress: 0,
      icon: Brain,
    },
    {
      id: "deployment",
      name: "Phase 3: XAI & Deployment",
      duration: "8 months",
      status: "pending",
      progress: 0,
      icon: Zap,
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-indigo-950 text-white relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-orange-500/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-3/4 left-1/2 w-64 h-64 bg-purple-500/5 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      <div className="container mx-auto p-6 relative z-10">
        {/* Enhanced Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="relative">
              <div className="p-3 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl shadow-lg">
                <Sun className="h-10 w-10 text-white" />
              </div>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full animate-ping"></div>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full"></div>
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
                PIGADE-X System
              </h1>
              <p className="text-xl text-blue-200/80 font-medium">
                Physics-Informed Generative Anomaly Detection with Explainable AI
              </p>
              <div className="flex items-center gap-2 mt-2">
                <Sparkles className="h-4 w-4 text-yellow-400" />
                <span className="text-sm text-yellow-400 font-medium">Advanced Space Weather Intelligence</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-6 text-sm">
            <div className="flex items-center gap-2 px-3 py-1 bg-orange-500/20 rounded-full border border-orange-500/30">
              <Satellite className="h-4 w-4 text-orange-400" />
              <span className="text-orange-200">Aditya-L1 SWIS-ASPEX</span>
            </div>
            <Badge variant="outline" className="bg-green-500/20 text-green-300 border-green-500/50 px-3 py-1">
              <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></div>
              Real-time Monitoring
            </Badge>
            <Badge variant="outline" className="bg-blue-500/20 text-blue-300 border-blue-500/50 px-3 py-1">
              Halo CME Detection
            </Badge>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <Alert className="mb-6 border-red-500/50 bg-red-500/10 backdrop-blur-sm">
            <AlertTriangle className="h-4 w-4 text-red-400" />
            <AlertDescription className="text-red-200">
              {error} - Please ensure the API server is running on http://localhost:8000
            </AlertDescription>
          </Alert>
        )}

        {/* Enhanced System Status */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-slate-800/40 border-slate-700/50 backdrop-blur-sm hover:bg-slate-800/60 transition-all duration-300 group">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400 mb-1">Data Ingestion</p>
                  <p className="text-3xl font-bold text-green-400 group-hover:scale-105 transition-transform">
                    {loading ? "..." : systemMetrics?.dataIngestion.toFixed(1) + "%"}
                  </p>
                  <div className="w-full bg-slate-700/50 rounded-full h-1 mt-2">
                    <div 
                      className="bg-green-400 h-1 rounded-full transition-all duration-1000"
                      style={{ width: `${systemMetrics?.dataIngestion || 0}%` }}
                    ></div>
                  </div>
                </div>
                <Activity className="h-10 w-10 text-green-400 group-hover:animate-pulse" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/40 border-slate-700/50 backdrop-blur-sm hover:bg-slate-800/60 transition-all duration-300 group">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400 mb-1">Model Accuracy</p>
                  <p className="text-3xl font-bold text-blue-400 group-hover:scale-105 transition-transform">
                    {loading ? "..." : systemMetrics?.modelAccuracy.toFixed(1) + "%"}
                  </p>
                  <div className="w-full bg-slate-700/50 rounded-full h-1 mt-2">
                    <div 
                      className="bg-blue-400 h-1 rounded-full transition-all duration-1000"
                      style={{ width: `${systemMetrics?.modelAccuracy || 0}%` }}
                    ></div>
                  </div>
                </div>
                <Brain className="h-10 w-10 text-blue-400 group-hover:animate-pulse" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/40 border-slate-700/50 backdrop-blur-sm hover:bg-slate-800/60 transition-all duration-300 group">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400 mb-1">Detection Latency</p>
                  <p className="text-3xl font-bold text-yellow-400 group-hover:scale-105 transition-transform">
                    {loading ? "..." : systemMetrics?.latency.toFixed(1) + "min"}
                  </p>
                  <p className="text-xs text-yellow-300/70 mt-1">Target: &lt;15min</p>
                </div>
                <Zap className="h-10 w-10 text-yellow-400 group-hover:animate-pulse" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/40 border-slate-700/50 backdrop-blur-sm hover:bg-slate-800/60 transition-all duration-300 group">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400 mb-1">System Uptime</p>
                  <p className="text-3xl font-bold text-purple-400 group-hover:scale-105 transition-transform">
                    {loading ? "..." : systemMetrics?.uptime.toFixed(1) + "%"}
                  </p>
                  <div className="w-full bg-slate-700/50 rounded-full h-1 mt-2">
                    <div 
                      className="bg-purple-400 h-1 rounded-full transition-all duration-1000"
                      style={{ width: `${systemMetrics?.uptime || 0}%` }}
                    ></div>
                  </div>
                </div>
                <TrendingUp className="h-10 w-10 text-purple-400 group-hover:animate-pulse" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Enhanced Project Phases */}
        <Card className="bg-slate-800/40 border-slate-700/50 backdrop-blur-sm mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-xl">
              <CheckCircle className="h-6 w-6 text-green-400" />
              Project Timeline & Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {phases.map((phase, index) => {
                const Icon = phase.icon
                return (
                  <div key={phase.id} className="relative">
                    <div className="flex items-center gap-6 p-6 rounded-xl bg-slate-700/30 hover:bg-slate-700/50 transition-all duration-300 border border-slate-600/50">
                      <div className="relative">
                        <Icon
                          className={`h-8 w-8 ${
                            phase.status === "active"
                              ? "text-orange-400"
                              : phase.status === "completed"
                                ? "text-green-400"
                                : "text-slate-400"
                          }`}
                        />
                        {phase.status === "active" && (
                          <div className="absolute -inset-2 bg-orange-400/20 rounded-full animate-ping"></div>
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-3">
                          <h3 className="font-semibold text-lg">{phase.name}</h3>
                          <div className="flex items-center gap-3">
                            <span className="text-sm text-slate-400">{phase.duration}</span>
                            <Badge 
                              variant={phase.status === "active" ? "default" : "secondary"}
                              className={phase.status === "active" ? "bg-orange-500/20 text-orange-300 border-orange-500/50" : ""}
                            >
                              {phase.status}
                            </Badge>
                          </div>
                        </div>
                        <Progress value={phase.progress} className="h-3 mb-2" />
                        <p className="text-sm text-slate-400">{phase.progress}% complete</p>
                      </div>
                    </div>
                    {index < phases.length - 1 && (
                      <div className="absolute left-10 top-full w-0.5 h-6 bg-slate-600"></div>
                    )}
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* Enhanced Main Dashboard */}
        <Tabs defaultValue="pipeline" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5 bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 p-1">
            <TabsTrigger value="pipeline" className="data-[state=active]:bg-slate-700 data-[state=active]:text-white">
              Data Pipeline
            </TabsTrigger>
            <TabsTrigger value="model" className="data-[state=active]:bg-slate-700 data-[state=active]:text-white">
              Model Training
            </TabsTrigger>
            <TabsTrigger value="detection" className="data-[state=active]:bg-slate-700 data-[state=active]:text-white">
              Anomaly Detection
            </TabsTrigger>
            <TabsTrigger value="xai" className="data-[state=active]:bg-slate-700 data-[state=active]:text-white">
              XAI Explainer
            </TabsTrigger>
            <TabsTrigger value="monitor" className="data-[state=active]:bg-slate-700 data-[state=active]:text-white">
              Real-time Monitor
            </TabsTrigger>
          </TabsList>

          <TabsContent value="pipeline">
            <DataPipeline />
          </TabsContent>

          <TabsContent value="model">
            <ModelDashboard />
          </TabsContent>

          <TabsContent value="detection">
            <AnomalyDetection />
          </TabsContent>

          <TabsContent value="xai">
            <XAIExplainer />
          </TabsContent>

          <TabsContent value="monitor">
            <RealTimeMonitor />
          </TabsContent>
        </Tabs>

        {/* Enhanced Recent Alerts */}
        <Card className="bg-slate-800/40 border-slate-700/50 backdrop-blur-sm mt-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-xl">
              <AlertTriangle className="h-6 w-6 text-orange-400" />
              Recent CME Detection Alerts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Alert className="border-orange-500/50 bg-orange-500/10 backdrop-blur-sm">
                <AlertTriangle className="h-4 w-4 text-orange-400" />
                <AlertDescription className="text-orange-200">
                  <strong>Halo CME Detected</strong> - Anomaly score: 0.87 | Confidence: 94% | Key features: High proton
                  density, elevated alpha/proton ratio
                </AlertDescription>
              </Alert>

              <Alert className="border-yellow-500/50 bg-yellow-500/10 backdrop-blur-sm">
                <AlertTriangle className="h-4 w-4 text-yellow-400" />
                <AlertDescription className="text-yellow-200">
                  <strong>Partial Halo CME</strong> - Anomaly score: 0.72 | Confidence: 87% | Key features: Directional
                  flux enhancement, temperature depression
                </AlertDescription>
              </Alert>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}