"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Brain, Target, TrendingUp, Play, Pause, RotateCcw, Activity } from "lucide-react"

export default function ModelDashboard() {
  const [trainingStatus, setTrainingStatus] = useState("training")

  const modelMetrics = {
    epoch: 127,
    totalEpochs: 200,
    loss: 0.0234,
    valLoss: 0.0287,
    accuracy: 94.2,
    f1Score: 0.91,
  }

  const architectures = [
    {
      name: "Variational Autoencoder (VAE)",
      type: "Generative",
      status: "active",
      performance: 94.2,
      description: "Primary GAD model for normal solar wind reconstruction",
    },
    {
      name: "Physics-Informed VAE",
      type: "Physics-Constrained",
      status: "training",
      performance: 91.8,
      description: "VAE with integrated conservation laws and plasma physics constraints",
    },
    {
      name: "Transformer Encoder",
      type: "Sequential",
      status: "experimental",
      performance: 87.3,
      description: "Attention-based model for temporal pattern recognition",
    },
  ]

  return (
    <div className="space-y-6">
      {/* Training Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Training Progress</p>
                <p className="text-xl font-bold text-blue-400">
                  {modelMetrics.epoch}/{modelMetrics.totalEpochs}
                </p>
              </div>
              <Brain className="h-6 w-6 text-blue-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Reconstruction Loss</p>
                <p className="text-xl font-bold text-green-400">{modelMetrics.loss}</p>
              </div>
              <Target className="h-6 w-6 text-green-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Validation Loss</p>
                <p className="text-xl font-bold text-orange-400">{modelMetrics.valLoss}</p>
              </div>
              <Activity className="h-6 w-6 text-orange-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">F1 Score</p>
                <p className="text-xl font-bold text-purple-400">{modelMetrics.f1Score}</p>
              </div>
              <TrendingUp className="h-6 w-6 text-purple-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Training Progress */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Model Training Status</span>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" className="bg-green-500/20 text-green-300 border-green-500">
                <Play className="h-4 w-4 mr-1" />
                Resume
              </Button>
              <Button size="sm" variant="outline" className="bg-orange-500/20 text-orange-300 border-orange-500">
                <Pause className="h-4 w-4 mr-1" />
                Pause
              </Button>
              <Button size="sm" variant="outline" className="bg-blue-500/20 text-blue-300 border-blue-500">
                <RotateCcw className="h-4 w-4 mr-1" />
                Reset
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium">Epoch Progress</span>
                <span className="text-sm text-slate-400">
                  {Math.round((modelMetrics.epoch / modelMetrics.totalEpochs) * 100)}%
                </span>
              </div>
              <Progress value={(modelMetrics.epoch / modelMetrics.totalEpochs) * 100} className="h-3" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div className="space-y-2">
                <h4 className="font-semibold text-sm">Training Metrics</h4>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Loss:</span>
                    <span className="text-green-400">{modelMetrics.loss}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Learning Rate:</span>
                    <span className="text-blue-400">0.001</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Batch Size:</span>
                    <span className="text-purple-400">64</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="font-semibold text-sm">Validation Metrics</h4>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Val Loss:</span>
                    <span className="text-orange-400">{modelMetrics.valLoss}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Accuracy:</span>
                    <span className="text-green-400">{modelMetrics.accuracy}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">F1 Score:</span>
                    <span className="text-blue-400">{modelMetrics.f1Score}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Model Architectures */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle>Model Architectures</CardTitle>
          <CardDescription>Generative models for normal solar wind characterization</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {architectures.map((arch, index) => (
              <div key={index} className="flex items-center gap-4 p-4 rounded-lg bg-slate-700/30">
                <Brain
                  className={`h-6 w-6 ${
                    arch.status === "active"
                      ? "text-green-400"
                      : arch.status === "training"
                        ? "text-blue-400"
                        : "text-slate-400"
                  }`}
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold">{arch.name}</h3>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-slate-400">{arch.performance}%</span>
                      <Badge variant={arch.status === "active" ? "default" : "secondary"}>{arch.status}</Badge>
                    </div>
                  </div>
                  <p className="text-sm text-slate-400 mb-2">{arch.description}</p>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">
                      {arch.type}
                    </Badge>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Physics Constraints */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle>Physics-Informed Constraints</CardTitle>
          <CardDescription>Integrated physical laws and plasma physics principles</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="conservation" className="space-y-4">
            <TabsList className="grid w-full grid-cols-3 bg-slate-700/50">
              <TabsTrigger value="conservation">Conservation Laws</TabsTrigger>
              <TabsTrigger value="plasma">Plasma Physics</TabsTrigger>
              <TabsTrigger value="constraints">Constraint Weights</TabsTrigger>
            </TabsList>

            <TabsContent value="conservation" className="space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-3 rounded-lg bg-slate-700/30">
                  <h4 className="font-semibold text-sm mb-2">Mass Conservation</h4>
                  <p className="text-xs text-slate-400">Density continuity across shock transitions</p>
                  <div className="flex justify-between mt-2">
                    <span className="text-xs">Weight:</span>
                    <span className="text-xs text-green-400">0.15</span>
                  </div>
                </div>
                <div className="p-3 rounded-lg bg-slate-700/30">
                  <h4 className="font-semibold text-sm mb-2">Momentum Conservation</h4>
                  <p className="text-xs text-slate-400">Velocity vector relationships</p>
                  <div className="flex justify-between mt-2">
                    <span className="text-xs">Weight:</span>
                    <span className="text-xs text-blue-400">0.12</span>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="plasma" className="space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-3 rounded-lg bg-slate-700/30">
                  <h4 className="font-semibold text-sm mb-2">Adiabatic Invariants</h4>
                  <p className="text-xs text-slate-400">Plasma expansion relationships</p>
                  <div className="flex justify-between mt-2">
                    <span className="text-xs">Weight:</span>
                    <span className="text-xs text-purple-400">0.10</span>
                  </div>
                </div>
                <div className="p-3 rounded-lg bg-slate-700/30">
                  <h4 className="font-semibold text-sm mb-2">Compositional Ratios</h4>
                  <p className="text-xs text-slate-400">Alpha/proton ratio constraints</p>
                  <div className="flex justify-between mt-2">
                    <span className="text-xs">Weight:</span>
                    <span className="text-xs text-orange-400">0.08</span>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="constraints">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Total Physics Loss Weight</span>
                  <span className="text-sm font-semibold text-green-400">0.45</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Reconstruction Loss Weight</span>
                  <span className="text-sm font-semibold text-blue-400">0.55</span>
                </div>
                <Progress value={45} className="h-2" />
                <p className="text-xs text-slate-400">Physics constraints contribute 45% to total loss function</p>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
