#!/bin/bash

# Vercel Clone Development Startup Script

echo "🚀 Starting Vercel Clone Development Environment"
echo "================================================"

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ and try again."
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm and try again."
    exit 1
fi

echo "✅ Node.js version: $(node --version)"
echo "✅ npm version: $(npm --version)"

# Install dependencies if node_modules don't exist
if [ ! -d "node_modules" ] || [ ! -d "frontend/node_modules" ] || [ ! -d "backend/node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm run install:all
fi

# Build backend if dist folder doesn't exist
if [ ! -d "backend/dist" ]; then
    echo "🔨 Building backend..."
    cd backend && npm run build && cd ..
fi

echo ""
echo "🎯 Starting development servers..."
echo "   Frontend: http://localhost:3000"
echo "   Backend API: http://localhost:8000"
echo "   Health Check: http://localhost:8000/health"
echo ""
echo "📝 To stop the servers, press Ctrl+C"
echo ""

# Start development servers
npm run dev