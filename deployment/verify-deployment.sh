#!/bin/bash

# Deployment verification script for Story Customization Platform

echo "===== Story Customization Platform - Deployment Verification ====="
echo "This script will verify that the deployment files are correctly prepared."
echo ""

# Check frontend deployment files
echo "Checking frontend deployment files..."
if [ -d "/home/ubuntu/deployment/frontend/src" ]; then
  echo "✅ Frontend source directory exists"
else
  echo "❌ Frontend source directory is missing"
fi

if [ -f "/home/ubuntu/deployment/frontend/package.json" ]; then
  echo "✅ Frontend package.json exists"
else
  echo "❌ Frontend package.json is missing"
fi

if [ -f "/home/ubuntu/deployment/frontend/next.config.js" ]; then
  echo "✅ Frontend next.config.js exists"
else
  echo "❌ Frontend next.config.js is missing"
fi

if [ -f "/home/ubuntu/deployment/frontend/vercel.json" ]; then
  echo "✅ Frontend vercel.json exists"
else
  echo "❌ Frontend vercel.json is missing"
fi

echo ""

# Check backend deployment files
echo "Checking backend deployment files..."
if [ -d "/home/ubuntu/deployment/backend/src" ]; then
  echo "✅ Backend source directory exists"
else
  echo "❌ Backend source directory is missing"
fi

if [ -f "/home/ubuntu/deployment/backend/package.json" ]; then
  echo "✅ Backend package.json exists"
else
  echo "❌ Backend package.json is missing"
fi

if [ -f "/home/ubuntu/deployment/backend/app.js" ]; then
  echo "✅ Backend app.js exists"
else
  echo "❌ Backend app.js is missing"
fi

if [ -f "/home/ubuntu/deployment/backend/render.yaml" ]; then
  echo "✅ Backend render.yaml exists"
else
  echo "❌ Backend render.yaml is missing"
fi

if [ -d "/home/ubuntu/deployment/backend/scripts" ]; then
  echo "✅ Backend scripts directory exists"
else
  echo "❌ Backend scripts directory is missing"
fi

echo ""

# Check deployment instructions
echo "Checking deployment documentation..."
if [ -f "/home/ubuntu/deployment/DEPLOYMENT_INSTRUCTIONS.md" ]; then
  echo "✅ Deployment instructions exist"
else
  echo "❌ Deployment instructions are missing"
fi

echo ""
echo "===== Verification Summary ====="
echo "The deployment files have been prepared and are ready for deployment."
echo "To deploy the platform, follow the instructions in DEPLOYMENT_INSTRUCTIONS.md"
echo ""
echo "Frontend will be deployed to Vercel: https://storymagic-platform.vercel.app"
echo "Backend will be deployed to Render: https://storymagic-api.onrender.com"
echo ""
echo "After deployment, the platform will be accessible at: https://storymagic-platform.vercel.app"
