"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Brain, Eye, BarChart3, Lightbulb, FileText, Download } from "lucide-react"

export default function XAIExplainer() {
  const [selectedDetection, setSelectedDetection] = useState(0)
  
  const detectionCases = [
    {
      id: 0,
      timestamp: '2024-01-15 14:23:45',
      type: 'Halo CME',
      score: 0.87,
      confidence: 94
    },
    {
      id: 1,
      timestamp: '2024-01-14 09:15:22',
      type: 'Partial Halo CME',
      score: 0.72,
      confidence: 87
    }
  ]

  const featureImportance = [
    { feature: 'Proton Density', importance: 0.34, contribution: 'High', physical: 'Dense plasma indicative of compressed solar wind ahead of CME' },
    { feature: 'Alpha/Proton Ratio', importance: 0.28, contribution: 'High', physical: 'Elevated ratio suggests CME ejecta with different composition' },
    { feature: 'Proton Temperature', importance: 0.22, contribution: 'Medium', physical: 'Temperature depression characteristic of CME material' },
    { feature: 'Velocity Magnitude', importance: 0.18, contribution: 'Medium', physical: 'Enhanced velocity indicating shock-driven acceleration' },
    { feature: 'Directional Flux (270°)', importance: 0.15, contribution: 'Medium', physical: 'Specific directional enhancement suggesting halo geometry' },
    { feature: 'Magnetic Field Variance', importance: 0.12, contribution: 'Low', physical: 'Increased variance indicating magnetic field rotation' },
    { feature: 'Iron Charge State', importance: 0.08, contribution: 'Low', physical: 'Higher charge states from hot CME source region' }
  ]

  const physicsExplanation = {
    shockSignature: {
      detected: true,
      confidence: 0.91,
      features: ['Density jump', 'Velocity enhancement', 'Temperature increase'],
      physics: 'Fast-mode shock ahead of CME compresses and heats ambient solar wind'
    },
    ejectaSignature: {
      detected: true,
      confidence: 0.85,
      features: ['Low proton temperature', 'Enhanced α/p ratio', 'Magnetic rotation'],
      physics: 'CME ejecta exhibits lower temperature due to adiabatic expansion and different composition'
    },
    haloGeometry: {
      detected: true,
      confidence: 0.78,
      features: ['Multi-directional enhancement', 'Symmetric flux pattern'],
      physics: 'Halo CME propagates toward Earth with wide angular extent'
    }
  }

  return (
    <div className="space-y-6">
      {/* Case Selection */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5 text-blue-400" />
            Explainable AI Analysis
          </CardTitle>
          <CardDescription>
            Detailed explanation of anomaly detection decisions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2 mb-4">
            {detectionCases.map((case_) => (
              <Button
                key={case_.id}
                variant={selectedDetection === case_.id ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedDetection(case_.id)}
                className={selectedDetection === case_.id ? "" : "bg-slate-700/50"}
              >
                {case_.type} - {case_.score}
              </Button>
            ))}
          </div>
          
          <div className="p-4 rounded-lg bg-slate-700/30">
            <div className="flex justify-between items-start mb-2">
              <div>
                <h3 className="font-semibold text-lg">{detectionCases[selectedDetection].type}</h3>
                <p className="text-sm text-slate-400">{detectionCases[selectedDetection].timestamp}</p>
              </div>
              <div className="text-right">
                <div className="text-xl font-bold text-orange-400">
                  Score: {detectionCases[selectedDetection].score}
                </div>
                <div className="text-sm text-slate-400">
                  Confidence: {detectionCases[selectedDetection].confidence}%
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Feature Importance Analysis */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-green-400" />
            Feature Importance Analysis
          </CardTitle>
          <CardDescription>
            SHAP values showing contribution of each parameter to anomaly detection
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {featureImportance.map((item, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-medium">{item.feature}</span>
                  <div className="flex items-center gap-2">
                    <Badge variant={
                      item.contribution === 'High' ? 'default' : 
                      item.contribution === 'Medium' ? 'secondary' : 'outline'
                    }>
                      {item.contribution}
                    </Badge>
                    <span className="text-sm font-mono">{item.importance.toFixed(2)}</span>
                  </div>
                </div>
                <Progress value={item.importance * 100} className="h-2" />
                <p className="text-xs text-slate-400 italic">{item.physical}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Physics-Based Explanation */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-yellow-400" />
            Physics-Based Interpretation
          </CardTitle>
          <CardDescription>
            Physical mechanisms underlying the detected anomaly
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="shock" className="space-y-4">
            <TabsList className="grid w-full grid-cols-3 bg-slate-700/50">
              <TabsTrigger value="shock">Shock Signature</TabsTrigger>
              <TabsTrigger value="ejecta">CME Ejecta</TabsTrigger>
              <TabsTrigger value="geometry">Halo Geometry</TabsTrigger>
            </TabsList>

            <TabsContent value="shock" className="space-y-4">
              <div className="p-4 rounded-lg bg-slate-700/30">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold">Shock Detection</h3>
                  <div className="flex items-center gap-2">
                    <Badge variant={physicsExplanation.shockSignature.detected ? 'default' : 'secondary'}>
                      {physicsExplanation.shockSignature.detected ? 'DETECTED' : 'NOT DETECTED'}
                    </Badge>
                    <span className="text-sm">
                      Confidence: {Math.round(physicsExplanation.shockSignature.confidence * 100)}%
                    </span>
                  </div>
                </div>
                <p className="text-sm text-slate-300 mb-3">
                  {physicsExplanation.shockSignature.physics}
                </p>
                <div className="space-y-2">
                  <p className="text-sm font-medium">Key Signatures:</p>
                  <div className="flex flex-wrap gap-2">
                    {physicsExplanation.shockSignature.features.map((feature, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {feature}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="ejecta" className="space-y-4">
              <div className="p-4 rounded-lg bg-slate-700/30">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold">CME Ejecta Analysis</h3>
                  <div className="flex items-center gap-2">
                    <Badge variant={physicsExplanation.ejectaSignature.detected ? 'default' : 'secondary'}>
                      {physicsExplanation.ejectaSignature.detected ? 'DETECTED' : 'NOT DETECTED'}
                    </Badge>
                    <span className="text-sm">
                      Confidence: {Math.round(physicsExplanation.ejectaSignature.confidence * 100)}%
                    </span>
                  </div>
                </div>
                <p className="text-sm text-slate-300 mb-3">
                  {physicsExplanation.ejectaSignature.physics}
                </p>
                <div className="space-y-2">
                  <p className="text-sm font-medium">Key Signatures:</p>
                  <div className="flex flex-wrap gap-2">
                    {physicsExplanation.ejectaSignature.features.map((feature, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {feature}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="geometry" className="space-y-4">
              <div className="p-4 rounded-lg bg-slate-700/30">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold">Halo Geometry Assessment</h3>
                  <div className="flex items-center gap-2">
                    <Badge variant={physicsExplanation.haloGeometry.detected ? 'default' : 'secondary'}>
                      {physicsExplanation.haloGeometry.detected ? 'DETECTED' : 'NOT DETECTED'}
                    </Badge>
                    <span className="text-sm">
                      Confidence: {Math.round(physicsExplanation.haloGeometry.confidence * 100)}%
                    </span>
                  </div>
                </div>
                <p className="text-sm text-slate-300 mb-3">
                  {physicsExplanation.haloGeometry.physics}
                </p>
                <div className="space-y-2">
                  <p className="text-sm font-medium">Key Signatures:</p>
                  <div className="flex flex-wrap gap-2">
                    {physicsExplanation.haloGeometry.features.map((feature, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {feature}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Model Attention Visualization */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-purple-400" />
            Model Attention Patterns
          </CardTitle>
          <CardDescription>
            Temporal attention weights showing which time periods contributed most to detection
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-12 gap-1 h-20">
              {Array.from({ length: 144 }, (_, i) => {
                const attention = Math.random() * 0.8 + 0.1
                const isHighAttention = attention > 0.6
                return (
                  <div
                    key={i}
                    className={`rounded-sm ${
                      isHighAttention 
                        ? 'bg-orange-500' 
                        : attention > 0.4 
                        ? 'bg-yellow-500' 
                        : 'bg-slate-600'
                    }`}
                    style={{ opacity: attention }}
                    title={`Time: ${Math.floor(i/6)}:${(i%6)*10} | Attention: ${attention.toFixed(2)}`}
                  />
                )
              })}
            </div>
            <div className="flex justify-between text-xs text-slate-400">
              <span>00:00</span>
              <span>12:00</span>
              <span>24:00</span>
            </div>
            <p className="text-sm text-slate-400">
              Darker regions indicate higher model attention. Peak attention around 14:00-16:00 
              corresponds to the main CME signature arrival.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Export Controls */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle>Export Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <Button variant="outline" className="bg-blue-500/20 text-blue-300 border-blue-500">
              <Download className="h-4 w-4 mr-2" />
              Export Report
            </Button>
            <Button variant="outline" className="bg-green-500/20 text-green-300 border-green-500">
              <FileText className="h-4 w-4 mr-2" />
              Generate Summary
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
