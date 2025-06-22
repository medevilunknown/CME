"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import { Activity, Brain, Database, Zap, AlertTriangle, CheckCircle, TrendingUp, Satellite, Sun } from "lucide-react"
import DataPipeline from "@/components/data-pipeline"
import ModelDashboard from "@/components/model-dashboard"
import AnomalyDetection from "@/components/anomaly-detection"
import XAIExplainer from "@/components/xai-explainer"
import RealTimeMonitor from "@/components/real-time-monitor"

export default function PIGADEXDashboard() {
  const [activePhase, setActivePhase] = useState("setup")

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

  const systemMetrics = {
    dataIngestion: 98.5,
    modelAccuracy: 94.2,
    latency: 12.3,
    uptime: 99.8,
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 text-white">
      <div className="container mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-orange-500 rounded-lg">
              <Sun className="h-8 w-8" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">PIGADE-X System</h1>
              <p className="text-blue-200">Physics-Informed Generative Anomaly Detection with Explainable AI</p>
            </div>
          </div>

          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <Satellite className="h-4 w-4 text-orange-400" />
              <span>Aditya-L1 SWIS-ASPEX</span>
            </div>
            <Badge variant="outline" className="bg-green-500/20 text-green-300 border-green-500">
              Real-time Monitoring
            </Badge>
            <Badge variant="outline" className="bg-blue-500/20 text-blue-300 border-blue-500">
              Halo CME Detection
            </Badge>
          </div>
        </div>

        {/* System Status */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400">Data Ingestion</p>
                  <p className="text-2xl font-bold text-green-400">{systemMetrics.dataIngestion}%</p>
                </div>
                <Activity className="h-8 w-8 text-green-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400">Model Accuracy</p>
                  <p className="text-2xl font-bold text-blue-400">{systemMetrics.modelAccuracy}%</p>
                </div>
                <Brain className="h-8 w-8 text-blue-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400">Detection Latency</p>
                  <p className="text-2xl font-bold text-yellow-400">{systemMetrics.latency}min</p>
                </div>
                <Zap className="h-8 w-8 text-yellow-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400">System Uptime</p>
                  <p className="text-2xl font-bold text-purple-400">{systemMetrics.uptime}%</p>
                </div>
                <TrendingUp className="h-8 w-8 text-purple-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Project Phases */}
        <Card className="bg-slate-800/50 border-slate-700 mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-400" />
              Project Timeline & Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {phases.map((phase) => {
                const Icon = phase.icon
                return (
                  <div key={phase.id} className="flex items-center gap-4 p-4 rounded-lg bg-slate-700/30">
                    <Icon
                      className={`h-6 w-6 ${
                        phase.status === "active"
                          ? "text-orange-400"
                          : phase.status === "completed"
                            ? "text-green-400"
                            : "text-slate-400"
                      }`}
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold">{phase.name}</h3>
                        <span className="text-sm text-slate-400">{phase.duration}</span>
                      </div>
                      <Progress value={phase.progress} className="h-2" />
                      <p className="text-sm text-slate-400 mt-1">{phase.progress}% complete</p>
                    </div>
                    <Badge variant={phase.status === "active" ? "default" : "secondary"}>{phase.status}</Badge>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* Main Dashboard */}
        <Tabs defaultValue="pipeline" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5 bg-slate-800/50">
            <TabsTrigger value="pipeline">Data Pipeline</TabsTrigger>
            <TabsTrigger value="model">Model Training</TabsTrigger>
            <TabsTrigger value="detection">Anomaly Detection</TabsTrigger>
            <TabsTrigger value="xai">XAI Explainer</TabsTrigger>
            <TabsTrigger value="monitor">Real-time Monitor</TabsTrigger>
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

        {/* Recent Alerts */}
        <Card className="bg-slate-800/50 border-slate-700 mt-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-orange-400" />
              Recent CME Detection Alerts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <Alert className="border-orange-500/50 bg-orange-500/10">
                <AlertTriangle className="h-4 w-4 text-orange-400" />
                <AlertDescription>
                  <strong>Halo CME Detected</strong> - Anomaly score: 0.87 | Confidence: 94% | Key features: High proton
                  density, elevated alpha/proton ratio
                </AlertDescription>
              </Alert>

              <Alert className="border-yellow-500/50 bg-yellow-500/10">
                <AlertTriangle className="h-4 w-4 text-yellow-400" />
                <AlertDescription>
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
