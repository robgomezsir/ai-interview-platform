#!/bin/bash

# Build script for Vercel deployment

echo "🚀 Building AI Interview Platform for Vercel..."

# Install backend dependencies
echo "📦 Installing backend dependencies..."
cd backend
npm install --production
cd ..

# Install frontend dependencies (if any)
echo "📦 Installing frontend dependencies..."
cd frontend
# No package.json in frontend, skipping
cd ..

# Generate Prisma client
echo "🔧 Generating Prisma client..."
cd backend
npx prisma generate
cd ..

echo "✅ Build completed successfully!"
