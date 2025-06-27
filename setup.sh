#!/bin/bash

echo "Setting up WealthWise MVP..."

# Install backend dependencies
echo "Installing backend dependencies..."
cd backend
npm install

# Seed the database
echo "Seeding database with sample data..."
node utils/seedData.js

# Install frontend dependencies
echo "Installing frontend dependencies..."
cd ../frontend
npm install

echo "Setup complete!"
echo ""
echo "To start the development servers, run:"
echo "./start-dev.sh"
echo ""
echo "Make sure MongoDB is running on your system!"