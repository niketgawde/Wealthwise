#!/bin/bash
set -e

echo "Installing backend dependencies..."
cd backend
npm install --legacy-peer-deps
cd ..

echo "Installing frontend dependencies..."
cd frontend
npm install --legacy-peer-deps
cd ..

echo "Building frontend..."
cd frontend
npm run build
cd ..

echo "Installation complete!"