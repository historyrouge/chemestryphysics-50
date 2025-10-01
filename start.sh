#!/bin/bash

echo "🚀 Starting Vercel Clone..."
echo "================================"

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js version 18+ is required. Current version: $(node -v)"
    exit 1
fi

echo "✅ Node.js $(node -v) detected"

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    echo "📦 Installing root dependencies..."
    npm install
fi

if [ ! -d "frontend/node_modules" ]; then
    echo "📦 Installing frontend dependencies..."
    cd frontend && npm install && cd ..
fi

if [ ! -d "backend/node_modules" ]; then
    echo "📦 Installing backend dependencies..."
    cd backend && npm install && cd ..
fi

# Create necessary directories
echo "📁 Creating directories..."
mkdir -p backend/uploads backend/deployments backend/functions

# Copy example project to deployments
echo "📋 Setting up example project..."
cp -r example-project backend/deployments/example-project

echo ""
echo "🎉 Setup complete! Starting servers..."
echo ""
echo "Frontend: http://localhost:3000"
echo "Backend:  http://localhost:3001"
echo "Example:  http://localhost:3001/static/example-project"
echo ""
echo "Press Ctrl+C to stop all servers"
echo ""

# Start both servers
npm run dev