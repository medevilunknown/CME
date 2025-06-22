"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertTriangle, CheckCircle, TrendingUp, Zap, Eye, Settings, Activity } from "lucide-react"
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
        <Alert className="border-red-500/50 bg-red-500/10">
          <AlertTriangle className="h-4 w-4 text-red-400" />
          <AlertDescription>
            {error} - Please ensure the API server is running
          </AlertDescription>
        </Alert>
      )}

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
                  {loading ? "..." : currentAnomalyScore?.score.toFixed(3)}
                </span>
              </div>
              <Progress
                value={(currentAnomalyScore?.score || 0) * 100}
                className={`h-3 ${isAnomalous ? "[&>div]:bg-red-500" : "[&>div]:bg-green-500"}`}
              />
              <div className="flex justify-between mt-1 text-xs text-slate-400">
                <span>0.000</span>
                <span className="text-orange-400">Threshold: {currentAnomalyScore?.threshold.toFixed(3) || "..."}</span>
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
                <p className="text-xl font-bold text-blue-400">
                  {loading ? "..." : detectionMetrics?.totalDetections}
                </p>
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
                <p className="text-xl font-bold text-green-400">
                  {loading ? "..." : detectionMetrics?.precision.toFixed(1) + "%"}
                </p>
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
                <p className="text-xl font-bold text-purple-400">
                  {loading ? "..." : detectionMetrics?.recall.toFixed(1) + "%"}
                </p>
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
                <p className="text-xl font-bold text-orange-400">
                  {loading ? "..." : detectionMetrics?.f1Score.toFixed(1) + "%"}
                </p>
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
            {loading ? (
              <div className="text-center py-8 text-slate-400">Loading recent detections...</div>
            ) : (
              recentDetections.map((detection) => (
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
                      {detection.status.replace("_", " ")}
                    </Badge>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">
                        <Eye className="h-4 w-4 mr-1" />
                        View Details
                      </Button>
                      <Button size="sm" variant="outline">
                        <Settings className="h-4 w-4 mr-1" />
                        XAI Analysis
                      </Button>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {detection.features.map((feature, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
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
