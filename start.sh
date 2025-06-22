#!/bin/bash

echo "Starting PIGADE-X System..."

# Function to cleanup background processes on exit
cleanup() {
    echo "Shutting down PIGADE-X System..."
    kill $API_PID $DASHBOARD_PID 2>/dev/null
    exit 0
}

# Set up signal handlers
trap cleanup SIGINT SIGTERM

# Start the FastAPI backend
echo "Starting FastAPI backend on http://localhost:8000"
cd deployment/api
python main.py &
API_PID=$!

# Wait a moment for the API to start
sleep 3

# Start the Next.js dashboard
echo "Starting Next.js dashboard on http://localhost:3000"
cd ../dashboard
npm run dev &
DASHBOARD_PID=$!

echo "PIGADE-X System is running!"
echo "API: http://localhost:8000"
echo "Dashboard: http://localhost:3000"
echo "Press Ctrl+C to stop both services"

# Wait for both processes
wait 