#!/bin/bash

echo "Starting WealthWise MVP Development Environment..."

# Start backend
echo "Starting backend server..."
cd backend
npm run dev &
BACKEND_PID=$!

# Wait for backend to start
sleep 3

# Start frontend
echo "Starting frontend development server..."
cd ../frontend
npm start &
FRONTEND_PID=$!

echo "Backend PID: $BACKEND_PID"
echo "Frontend PID: $FRONTEND_PID"

echo "Development servers are starting..."
echo "Backend: http://localhost:5001"
echo "Frontend: http://localhost:3000"

# Wait for user to press Ctrl+C
wait