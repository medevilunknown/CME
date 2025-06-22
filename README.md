# PIGADE-X: Physics-Informed Generative Anomaly Detection System with Explainable AI

This project is the implementation of the PIGADE-X system, an advanced AI framework for the real-time detection of halo Coronal Mass Ejection (CME) events. It leverages particle data from the Solar Wind Ion Spectrometer (SWIS) and Supra Thermal & Energetic Particle Spectrometer (STEPS) instruments on India's Aditya-L1 mission.

## Project Goal

The primary goal is to develop, validate, and deploy an explainable, physics-informed AI system capable of identifying and characterizing halo CME events from Aditya-L1 SWIS-ASPEX data. By detecting anomalies in the solar wind particle data, this system aims to significantly enhance space weather forecasting capabilities.

For more details, see the [full project plan](docs/project_plan.md).

## Getting Started

### Quick Start (Recommended)

1.  Clone the repository:
    ```bash
    git clone <repository-url>
    cd pigade-x
    ```

2.  Install Python dependencies:
    ```bash
    pip install -r requirements.txt
    ```

3.  Install Node.js dependencies for the dashboard:
    ```bash
    cd deployment/dashboard
    npm install
    cd ../..
    ```

4.  Start both the API and dashboard with one command:
    ```bash
    ./start.sh
    ```

This will start:
- FastAPI backend on http://localhost:8000
- Next.js dashboard on http://localhost:3000

### Manual Start

If you prefer to start services individually:

1.  Start the FastAPI backend:
    ```bash
    cd deployment/api
    python main.py
    ```

2.  In a new terminal, start the Next.js dashboard:
    ```bash
    cd deployment/dashboard
    npm run dev
    ```

## Project Structure

The project is organized into the following main directories:

-   `data/`: Contains raw, processed, and curated datasets.
-   `docs/`: Project documentation, including the detailed project plan.
-   `notebooks/`: Jupyter notebooks for data exploration, prototyping, and analysis.
-   `src/`: Main source code for the PIGADE-X system.
-   `deployment/`: Files related to model deployment, including:
    -   `api/`: FastAPI backend with REST endpoints
    -   `dashboard/`: Next.js frontend dashboard
-   `tests/`: Unit and integration tests.

## API Endpoints

The FastAPI backend provides the following endpoints:

- `GET /api/system-metrics` - System performance metrics
- `GET /api/data-pipeline/metrics` - Data pipeline statistics
- `GET /api/data-pipeline/steps` - Pipeline processing steps
- `GET /api/anomaly-detection/metrics` - Detection performance metrics
- `GET /api/anomaly-detection/current-score` - Real-time anomaly score
- `GET /api/anomaly-detection/recent` - Recent detections
- `GET /api/real-time/data` - Real-time monitoring data
- `POST /api/anomaly-detection/threshold` - Update detection threshold
- `GET /api/model/status` - Model training status
- `GET /api/xai/explanation/{id}` - XAI explanations

## Dashboard Features

The Next.js dashboard includes:

- **System Overview**: Real-time metrics and status
- **Data Pipeline**: Processing steps and data quality metrics
- **Anomaly Detection**: Real-time detection with configurable thresholds
- **XAI Explainer**: Explainable AI insights for detections
- **Real-time Monitor**: Live data visualization
- **Model Dashboard**: Training progress and model performance
