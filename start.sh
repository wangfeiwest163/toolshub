#!/bin/bash

# ToolsHub Startup Script

echo "Starting ToolsHub Application..."
echo "=================================="

# Check if node is installed
if ! [ -x "$(command -v node)" ]; then
  echo "Error: Node.js is not installed." >&2
  exit 1
fi

# Check if MongoDB is accessible
echo "Checking MongoDB connection..."
if ! nc -z localhost 27017; then
  echo "Warning: MongoDB is not running on localhost:27017"
  echo "Make sure MongoDB is running before starting the application"
fi

echo "Starting server..."
node server.js