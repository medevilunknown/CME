"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertTriangle, CheckCircle, TrendingUp, Zap, Eye, Settings, Activity } from "lucide-react"

export default function AnomalyDetection() {
  const [currentAnomalyScore, setCurrentAnomalyScore] = useState(0.23)
  const [threshold, setThreshold] = useState(0.65)

  // Simulate real-time anomaly score updates
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentAnomalyScore((prev) => {
        const change = (Math.random() - 0.5) * 0.1
        return Math.max(0, Math.min(1, prev + change))
      })
    }, 2000)

    return () => clearInterval(interval)
  }, [])

  const detectionMetrics = {
    totalDetections: 47,
    truePositives: 42,
    falsePositives: 5,
    precision: 89.4,
    recall: 91.3,
    f1Score: 90.3,
  }

  const recentDetections = [
    {
      id: 1,
      timestamp: "2024-01-15 14:23:45",
      type: "Halo CME",
      score: 0.87,
      confidence: 94,
      status: "confirmed",
      features: ["High proton density", "Elevated α/p ratio", "Temperature depression"],
    },
    {
      id: 2,
      timestamp: "2024-01-14 09:15:22",
      type: "Partial Halo CME",
      score: 0.72,
      confidence: 87,
      status: "confirmed",
      features: ["Directional flux enhancement", "Velocity increase", "Magnetic rotation"],
    },
    {
      id: 3,
      timestamp: "2024-01-13 16:47:11",
      type: "ICME Sheath",
      score: 0.68,
      confidence: 82,
      status: "under_review",
      features: ["Compressed plasma", "Enhanced magnetic field", "Proton temperature"],
    },
  ]

  const isAnomalous = currentAnomalyScore > threshold

  return (
    <div className="space-y-6">
      {/* Real-time Anomaly Score */}
      <Card className={`border-2 ${isAnomalous ? "border-red-500 bg-red-500/10" : "border-slate-700 bg-slate-800/50"}`}>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              {isAnomalous ? (
                <AlertTriangle className="h-6 w-6 text-red-400" />
              ) : (
                <CheckCircle className="h-6 w-6 text-green-400" />
              )}
              Real-time Anomaly Detection
            </span>
            <Badge variant={isAnomalous ? "destructive" : "default"}>
              {isAnomalous ? "ANOMALY DETECTED" : "NORMAL"}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium">Current Anomaly Score</span>
                <span className={`text-lg font-bold ${isAnomalous ? "text-red-400" : "text-green-400"}`}>
                  {currentAnomalyScore.toFixed(3)}
                </span>
              </div>
              <Progress
                value={currentAnomalyScore * 100}
                className={`h-3 ${isAnomalous ? "[&>div]:bg-red-500" : "[&>div]:bg-green-500"}`}
              />
              <div className="flex justify-between mt-1 text-xs text-slate-400">
                <span>0.000</span>
                <span className="text-orange-400">Threshold: {threshold}</span>
                <span>1.000</span>
              </div>
            </div>

            {isAnomalous && (
              <Alert className="border-red-500/50 bg-red-500/10">
                <AlertTriangle className="h-4 w-4 text-red-400" />
                <AlertDescription>
                  <strong>Potential CME Event Detected!</strong> Anomaly score exceeds threshold. Initiating detailed
                  analysis and alert protocols.
                </AlertDescription>
              </Alert>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Detection Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Total Detections</p>
                <p className="text-xl font-bold text-blue-400">{detectionMetrics.totalDetections}</p>
              </div>
              <Activity className="h-6 w-6 text-blue-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Precision</p>
                <p className="text-xl font-bold text-green-400">{detectionMetrics.precision}%</p>
              </div>
              <CheckCircle className="h-6 w-6 text-green-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Recall</p>
                <p className="text-xl font-bold text-purple-400">{detectionMetrics.recall}%</p>
              </div>
              <TrendingUp className="h-6 w-6 text-purple-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">F1 Score</p>
                <p className="text-xl font-bold text-orange-400">{detectionMetrics.f1Score}%</p>
              </div>
              <Zap className="h-6 w-6 text-orange-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Detections */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle>Recent CME Detections</CardTitle>
          <CardDescription>Chronological list of detected anomalous events</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentDetections.map((detection) => (
              <div key={detection.id} className="p-4 rounded-lg bg-slate-700/30 border border-slate-600">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-semibold text-lg">{detection.type}</h3>
                    <p className="text-sm text-slate-400">{detection.timestamp}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-orange-400">Score: {detection.score}</div>
                    <div className="text-sm text-slate-400">Confidence: {detection.confidence}%</div>
                  </div>
                </div>

                <div className="flex items-center justify-between mb-3">
                  <Badge
                    variant={
                      detection.status === "confirmed"
                        ? "default"
                        : detection.status === "under_review"
                          ? "secondary"
                          : "outline"
                    }
                  >
                    {detection.status.replace("_", " ").toUpperCase()}
                  </Badge>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" className="bg-blue-500/20 text-blue-300 border-blue-500">
                      <Eye className="h-3 w-3 mr-1" />
                      Details
                    </Button>
                  </div>
                </div>

                <div>
                  <p className="text-sm font-medium mb-2">Key Features:</p>
                  <div className="flex flex-wrap gap-2">
                    {detection.features.map((feature, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {feature}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Detection Controls */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle>Detection Parameters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-sm font-medium mb-2 block">Anomaly Threshold</label>
              <div className="flex items-center gap-4">
                <input
                  type="range"
                  min="0.1"
                  max="0.9"
                  step="0.05"
                  value={threshold}
                  onChange={(e) => setThreshold(Number.parseFloat(e.target.value))}
                  className="flex-1"
                />
                <span className="text-sm font-mono bg-slate-700 px-2 py-1 rounded">{threshold.toFixed(2)}</span>
              </div>
            </div>

            <div className="flex items-end gap-2">
              <Button variant="outline" className="bg-green-500/20 text-green-300 border-green-500">
                <Settings className="h-4 w-4 mr-2" />
                Update Threshold
              </Button>
              <Button variant="outline" className="bg-blue-500/20 text-blue-300 border-blue-500">
                Calibrate
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
