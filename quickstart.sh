#!/bin/bash

# Assetify Project Quick Start
# This script helps you set up the entire project

echo "╔════════════════════════════════════════╗"
echo "║     ASSETIFY PROJECT QUICK START       ║"
echo "╚════════════════════════════════════════╝"
echo ""

# Check if MongoDB is running
echo "🔍 Checking MongoDB connection..."
if mongosh --eval "db.adminCommand('ping')" > /dev/null 2>&1; then
    echo "✓ MongoDB is running"
else
    echo "✗ MongoDB is not running"
    echo "   Start MongoDB with: brew services start mongodb-community"
    exit 1
fi

echo ""
echo "📦 Setting up Backend..."
cd backend

if [ ! -d "node_modules" ]; then
    echo "  Installing dependencies..."
    npm install
else
    echo "  Dependencies already installed"
fi

echo ""
echo "🌱 Seeding database with initial data..."
npm run seed

echo ""
echo "╔════════════════════════════════════════╗"
echo "║      SETUP COMPLETE - NEXT STEPS       ║"
echo "╚════════════════════════════════════════╝"
echo ""
echo "1️⃣  START BACKEND (Terminal 1):"
echo "   cd backend"
echo "   npm run dev"
echo ""
echo "2️⃣  START FRONTEND (Terminal 2):"
echo "   cd frontend"
echo "   npm run dev"
echo ""
echo "3️⃣  OPEN BROWSER:"
echo "   http://localhost:5173"
echo ""
echo "📚 API ENDPOINTS:"
echo "   Backend:  http://localhost:5000"
echo "   Frontend: http://localhost:5173"
echo ""
echo "📖 DOCUMENTATION:"
echo "   Read SETUP_GUIDE.md for complete instructions"
echo ""
