#!/bin/bash
# Start the ToolsHub application

# Navigate to the project directory
cd /home/wangfei/.openclaw/workspace

# Install dependencies if not already installed
npm install

# Start the application in the background
nohup npm start > app.log 2>&1 &

echo "ToolsHub application started successfully!"
echo "Server is running on port 3000"
echo "Access the application at: http://localhost:3000"