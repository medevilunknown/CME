"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertTriangle, CheckCircle, TrendingUp, Zap, Eye, Settings, Activity, Shield, Target } from "lucide-react"
import { fetchDetectionMetrics, fetchCurrentAnomalyScore, fetchRecentDetections, updateThreshold, DetectionMetrics, AnomalyDetection, CurrentAnomalyScore } from "@/lib/api"

export default function AnomalyDetection() {
  const [currentAnomalyScore, setCurrentAnomalyScore] = useState<CurrentAnomalyScore | null>(null)
  const [detectionMetrics, setDetectionMetrics] = useState<DetectionMetrics | null>(null)
  const [recentDetections, setRecentDetections] = useState<AnomalyDetection[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true)
        const [metrics, currentScore, detections] = await Promise.all([
          fetchDetectionMetrics(),
          fetchCurrentAnomalyScore(),
          fetchRecentDetections()
        ])
        setDetectionMetrics(metrics)
        setCurrentAnomalyScore(currentScore)
        setRecentDetections(detections)
        setError(null)
      } catch (err) {
        setError('Failed to load anomaly detection data')
        console.error('Error loading anomaly detection data:', err)
      } finally {
        setLoading(false)
      }
    }

    loadData()
    
    // Refresh data every 10 seconds for real-time updates
    const interval = setInterval(loadData, 10000)
    return () => clearInterval(interval)
  }, [])

  const handleThresholdUpdate = async (newThreshold: number) => {
    try {
      await updateThreshold(newThreshold)
      // Refresh current score to get updated threshold
      const currentScore = await fetchCurrentAnomalyScore()
      setCurrentAnomalyScore(currentScore)
    } catch (err) {
      console.error('Error updating threshold:', err)
    }
  }

  const isAnomalous = currentAnomalyScore?.isAnomalous || false

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

      {/* Enhanced Real-time Anomaly Score */}
      <Card className={`border-2 transition-all duration-500 backdrop-blur-sm ${
        isAnomalous 
          ? "border-red-500/70 bg-red-500/10 shadow-red-500/20 shadow-lg" 
          : "border-slate-700/50 bg-slate-800/40"
      }`}>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-3">
              {isAnomalous ? (
                <div className="relative">
                  <AlertTriangle className="h-8 w-8 text-red-400" />
                  <div className="absolute -inset-2 bg-red-400/20 rounded-full animate-ping"></div>
                </div>
              ) : (
                <Shield className="h-8 w-8 text-green-400" />
              )}
              <div>
                <h3 className="text-xl font-bold">Real-time Anomaly Detection</h3>
                <p className="text-sm text-slate-400 font-normal">Continuous monitoring of solar wind parameters</p>
              </div>
            </span>
            <Badge 
              variant={isAnomalous ? "destructive" : "default"}
              className={`px-4 py-2 text-sm font-semibold ${
                isAnomalous 
                  ? "bg-red-500/20 text-red-300 border-red-500/50 animate-pulse" 
                  : "bg-green-500/20 text-green-300 border-green-500/50"
              }`}
            >
              {isAnomalous ? "ANOMALY DETECTED" : "NORMAL OPERATIONS"}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div>
              <div className="flex justify-between mb-3">
                <span className="text-sm font-medium text-slate-300">Current Anomaly Score</span>
                <span className={`text-2xl font-bold ${isAnomalous ? "text-red-400" : "text-green-400"}`}>
                  {loading ? "..." : currentAnomalyScore?.score.toFixed(3)}
                </span>
              </div>
              <div className="relative">
                <Progress
                  value={(currentAnomalyScore?.score || 0) * 100}
                  className={`h-4 ${isAnomalous ? "[&>div]:bg-red-500" : "[&>div]:bg-green-500"}`}
                />
                <div 
                  className="absolute top-0 w-1 h-4 bg-orange-400 rounded-full"
                  style={{ left: `${(currentAnomalyScore?.threshold || 0.65) * 100}%` }}
                ></div>
              </div>
              <div className="flex justify-between mt-2 text-xs text-slate-400">
                <span>0.000</span>
                <span className="text-orange-400 font-medium">
                  Threshold: {currentAnomalyScore?.threshold.toFixed(3) || "..."}
                </span>
                <span>1.000</span>
              </div>
            </div>

            {isAnomalous && (
              <Alert className="border-red-500/50 bg-red-500/10 backdrop-blur-sm">
                <AlertTriangle className="h-4 w-4 text-red-400" />
                <AlertDescription className="text-red-200">
                  <strong>Potential CME Event Detected!</strong> Anomaly score exceeds threshold. Initiating detailed
                  analysis and alert protocols.
                </AlertDescription>
              </Alert>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Enhanced Detection Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-slate-800/40 border-slate-700/50 backdrop-blur-sm hover:bg-slate-800/60 transition-all duration-300 group">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400 mb-1">Total Detections</p>
                <p className="text-2xl font-bold text-blue-400 group-hover:scale-105 transition-transform">
                  {loading ? "..." : detectionMetrics?.totalDetections}
                </p>
                <p className="text-xs text-blue-300/70 mt-1">Last 30 days</p>
              </div>
              <Activity className="h-8 w-8 text-blue-400 group-hover:animate-pulse" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/40 border-slate-700/50 backdrop-blur-sm hover:bg-slate-800/60 transition-all duration-300 group">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400 mb-1">Precision</p>
                <p className="text-2xl font-bold text-green-400 group-hover:scale-105 transition-transform">
                  {loading ? "..." : detectionMetrics?.precision.toFixed(1) + "%"}
                </p>
                <div className="w-full bg-slate-700/50 rounded-full h-1 mt-2">
                  <div 
                    className="bg-green-400 h-1 rounded-full transition-all duration-1000"
                    style={{ width: `${detectionMetrics?.precision || 0}%` }}
                  ></div>
                </div>
              </div>
              <Target className="h-8 w-8 text-green-400 group-hover:animate-pulse" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/40 border-slate-700/50 backdrop-blur-sm hover:bg-slate-800/60 transition-all duration-300 group">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400 mb-1">Recall</p>
                <p className="text-2xl font-bold text-purple-400 group-hover:scale-105 transition-transform">
                  {loading ? "..." : detectionMetrics?.recall.toFixed(1) + "%"}
                </p>
                <div className="w-full bg-slate-700/50 rounded-full h-1 mt-2">
                  <div 
                    className="bg-purple-400 h-1 rounded-full transition-all duration-1000"
                    style={{ width: `${detectionMetrics?.recall || 0}%` }}
                  ></div>
                </div>
              </div>
              <TrendingUp className="h-8 w-8 text-purple-400 group-hover:animate-pulse" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/40 border-slate-700/50 backdrop-blur-sm hover:bg-slate-800/60 transition-all duration-300 group">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400 mb-1">F1 Score</p>
                <p className="text-2xl font-bold text-orange-400 group-hover:scale-105 transition-transform">
                  {loading ? "..." : detectionMetrics?.f1Score.toFixed(1) + "%"}
                </p>
                <div className="w-full bg-slate-700/50 rounded-full h-1 mt-2">
                  <div 
                    className="bg-orange-400 h-1 rounded-full transition-all duration-1000"
                    style={{ width: `${detectionMetrics?.f1Score || 0}%` }}
                  ></div>
                </div>
              </div>
              <Zap className="h-8 w-8 text-orange-400 group-hover:animate-pulse" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Enhanced Recent Detections */}
      <Card className="bg-slate-800/40 border-slate-700/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-xl">Recent CME Detections</CardTitle>
          <CardDescription>Chronological list of detected anomalous events</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {loading ? (
              <div className="text-center py-8 text-slate-400">Loading recent detections...</div>
            ) : (
              recentDetections.map((detection) => (
                <div key={detection.id} className="p-6 rounded-xl bg-slate-700/30 border border-slate-600/50 hover:bg-slate-700/50 transition-all duration-300">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="font-semibold text-xl text-white">{detection.type}</h3>
                      <p className="text-sm text-slate-400">{detection.timestamp}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-xl font-bold text-orange-400">Score: {detection.score}</div>
                      <div className="text-sm text-slate-400">Confidence: {detection.confidence}%</div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mb-4">
                    <Badge
                      variant={
                        detection.status === "confirmed"
                          ? "default"
                          : detection.status === "under_review"
                            ? "secondary"
                            : "outline"
                      }
                      className={
                        detection.status === "confirmed"
                          ? "bg-green-500/20 text-green-300 border-green-500/50"
                          : detection.status === "under_review"
                            ? "bg-yellow-500/20 text-yellow-300 border-yellow-500/50"
                            : ""
                      }
                    >
                      {detection.status.replace("_", " ").toUpperCase()}
                    </Badge>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" className="bg-blue-500/20 text-blue-300 border-blue-500/50 hover:bg-blue-500/30">
                        <Eye className="h-4 w-4 mr-1" />
                        View Details
                      </Button>
                      <Button size="sm" variant="outline" className="bg-purple-500/20 text-purple-300 border-purple-500/50 hover:bg-purple-500/30">
                        <Settings className="h-4 w-4 mr-1" />
                        XAI Analysis
                      </Button>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {detection.features.map((feature, index) => (
                      <Badge key={index} variant="outline" className="text-xs bg-slate-600/30 text-slate-300 border-slate-500/50">
                        {feature}
                      </Badge>
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}