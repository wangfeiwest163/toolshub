#!/bin/bash

echo "ToolsHub Setup Script"
echo "====================="

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "Node.js is not installed. Please install Node.js first."
    exit 1
fi

echo "Node.js is installed."

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "npm is not installed. Please install npm first."
    exit 1
fi

echo "npm is installed."

# Check if MongoDB is installed
if command -v mongod &> /dev/null; then
    echo "MongoDB is installed."
else
    echo "MongoDB is not installed. Installing MongoDB..."
    
    # Detect OS and install MongoDB accordingly
    if [[ "$OSTYPE" == "linux-gnu"* ]]; then
        # Ubuntu/Debian
        sudo apt-get update
        sudo apt-get install -y mongodb
        sudo systemctl start mongodb
        sudo systemctl enable mongodb
    elif [[ "$OSTYPE" == "darwin"* ]]; then
        # macOS
        if command -v brew &> /dev/null; then
            brew tap mongodb/brew
            brew install mongodb-community
            brew services start mongodb/brew/mongodb-community
        else
            echo "Please install Homebrew first: https://brew.sh/"
            exit 1
        fi
    else
        echo "Unsupported OS. Please install MongoDB manually."
        echo "Visit: https://docs.mongodb.com/manual/installation/"
        exit 1
    fi
fi

# Install project dependencies
echo "Installing project dependencies..."
npm install

# Create .env file if it doesn't exist
if [ ! -f ".env" ]; then
    echo "Creating .env file..."
    cat > .env << EOF
MONGODB_URI=mongodb://127.0.0.1:27017/tools_hub
PORT=8080
EOF
    echo ".env file created."
fi

# Initialize sample data
echo "Initializing sample data..."
node initialize-sample-data.js

echo ""
echo "Setup completed successfully!"
echo ""
echo "To start the application, run:"
echo "npm start"
echo ""
echo "Then visit http://localhost:8080 in your browser."