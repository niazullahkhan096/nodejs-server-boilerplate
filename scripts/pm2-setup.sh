#!/bin/bash

# PM2 Setup Script for Production Deployment
# This script sets up PM2 for production use

set -e

echo "🚀 Setting up PM2 for production..."

# Check if PM2 is installed globally
if ! command -v pm2 &> /dev/null; then
    echo "📦 Installing PM2 globally..."
    npm install -g pm2
fi

# Create logs directory if it doesn't exist
mkdir -p logs

# Build the application
echo "🔨 Building the application..."
npm run build

# Start PM2 in production mode
echo "🚀 Starting PM2 in production mode..."
pm2 start ecosystem.config.js --env production

# Save PM2 configuration
echo "💾 Saving PM2 configuration..."
pm2 save

# Setup PM2 to start on system boot
echo "🔧 Setting up PM2 startup script..."
pm2 startup

echo "✅ PM2 setup completed successfully!"
echo ""
echo "📊 Useful PM2 commands:"
echo "  pm2 status          - Check process status"
echo "  pm2 logs            - View logs"
echo "  pm2 monit           - Monitor processes"
echo "  pm2 restart all     - Restart all processes"
echo "  pm2 reload all      - Zero-downtime reload"
echo "  pm2 stop all        - Stop all processes"
echo "  pm2 delete all      - Delete all processes"
echo ""
echo "🌐 Your application should now be running on port 4000"
