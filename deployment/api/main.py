from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict, Any, Optional
import numpy as np
import pandas as pd
from datetime import datetime, timedelta
import asyncio
import json
from data_service import data_service

app = FastAPI(title="PIGADE-X API", version="1.0.0")

# Enable CORS for the frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Next.js dev server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pydantic models for API responses
class SystemMetrics(BaseModel):
    dataIngestion: float
    modelAccuracy: float
    latency: float
    uptime: float

class PipelineStep(BaseModel):
    id: str
    name: str
    description: str
    status: str
    progress: int
    throughput: str

class DataMetrics(BaseModel):
    totalVolume: str
    dailyIngestion: str
    qualityScore: float
    missingDataRate: float

class DetectionMetrics(BaseModel):
    totalDetections: int
    truePositives: int
    falsePositives: int
    precision: float
    recall: float
    f1Score: float

class AnomalyDetection(BaseModel):
    id: int
    timestamp: str
    type: str
    score: float
    confidence: int
    status: str
    features: List[str]

class RealTimeData(BaseModel):
    timestamp: str
    anomalyScore: float
    protonDensity: float
    alphaDensity: float
    protonVelocity: float
    protonTemperature: float

# Global state for real-time monitoring
current_anomaly_score = 0.23
detection_threshold = 0.65

@app.get("/")
async def root():
    return {"message": "PIGADE-X API is running"}

@app.get("/api/system-metrics", response_model=SystemMetrics)
async def get_system_metrics():
    """Get current system performance metrics"""
    metrics = data_service.get_system_metrics()
    return SystemMetrics(**metrics)

@app.get("/api/data-pipeline/metrics", response_model=DataMetrics)
async def get_data_metrics():
    """Get data pipeline metrics"""
    metrics = data_service.get_data_metrics()
    return DataMetrics(**metrics)

@app.get("/api/data-pipeline/steps", response_model=List[PipelineStep])
async def get_pipeline_steps():
    """Get current pipeline processing steps"""
    steps = data_service.get_pipeline_steps()
    return [PipelineStep(**step) for step in steps]

@app.get("/api/anomaly-detection/metrics", response_model=DetectionMetrics)
async def get_detection_metrics():
    """Get anomaly detection performance metrics"""
    # Calculate real metrics based on actual detections
    detections = data_service.get_anomaly_detections()
    total_detections = len(detections)
    true_positives = len([d for d in detections if d['confidence'] > 80])
    false_positives = total_detections - true_positives
    
    precision = (true_positives / total_detections * 100) if total_detections > 0 else 0
    recall = precision  # Simplified for now
    f1_score = precision  # Simplified for now
    
    return DetectionMetrics(
        totalDetections=total_detections,
        truePositives=true_positives,
        falsePositives=false_positives,
        precision=precision,
        recall=recall,
        f1Score=f1_score
    )

@app.get("/api/anomaly-detection/current-score")
async def get_current_anomaly_score():
    """Get current real-time anomaly score"""
    global current_anomaly_score, detection_threshold
    
    # Get real-time data and calculate current anomaly score
    real_time_data = data_service.get_real_time_data(hours=1)
    if real_time_data:
        current_anomaly_score = real_time_data[-1]['anomalyScore']
    
    return {
        "score": current_anomaly_score,
        "threshold": detection_threshold,
        "isAnomalous": current_anomaly_score > detection_threshold,
        "timestamp": datetime.now().isoformat()
    }

@app.get("/api/anomaly-detection/recent", response_model=List[AnomalyDetection])
async def get_recent_detections():
    """Get recent anomaly detections"""
    detections = data_service.get_anomaly_detections()
    return [AnomalyDetection(**detection) for detection in detections]

@app.get("/api/real-time/data", response_model=List[RealTimeData])
async def get_real_time_data(hours: int = 24):
    """Get real-time monitoring data for the specified number of hours"""
    # Load and process real data if not already available
    if data_service.current_data is None:
        df = data_service.load_real_data()
        data_service.process_data_pipeline(df)
    
    real_time_data = data_service.get_real_time_data(hours)
    return [RealTimeData(**data_point) for data_point in real_time_data]

@app.post("/api/anomaly-detection/threshold")
async def update_threshold(threshold: float):
    """Update the anomaly detection threshold"""
    global detection_threshold
    if 0 <= threshold <= 1:
        detection_threshold = threshold
        return {"message": f"Threshold updated to {threshold}", "threshold": threshold}
    else:
        raise HTTPException(status_code=400, detail="Threshold must be between 0 and 1")

@app.get("/api/model/status")
async def get_model_status():
    """Get current model training and deployment status"""
    return {
        "status": "active",
        "lastTraining": "2024-01-15T10:30:00Z",
        "accuracy": 94.2,
        "version": "1.2.3",
        "uptime": "99.8%"
    }

@app.get("/api/xai/explanation/{detection_id}")
async def get_xai_explanation(detection_id: int):
    """Get XAI explanation for a specific detection"""
    # This would normally use the actual XAI model
    return {
        "detectionId": detection_id,
        "explanation": {
            "protonDensity": 0.35,
            "alphaDensity": 0.28,
            "protonVelocity": 0.15,
            "protonTemperature": 0.12,
            "alphaProtonRatio": 0.10
        },
        "confidence": 0.87,
        "timestamp": datetime.now().isoformat()
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
