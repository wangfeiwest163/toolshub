# ToolsHub - Comprehensive Online Tools Collection

Welcome to ToolsHub, a comprehensive collection of online tools, utility tools, and AI tools hub. This platform provides various utilities including password generators, URL shorteners, converters, and more, all in one place.

## Features

1. **Homepage** showcasing different categories of tools (Utility Tools, AI Tools, Online Calculators, etc.)
2. **Individual tool pages** for common utilities like URL shortener, text formatter, image converter, password generator, unit converter, etc.
3. **AI-powered tools section** with interfaces for text generation, image processing, etc.
4. **Search functionality** to find tools quickly
5. **Visitor tracking functionality** to monitor usage of individual tools
6. **Analytics dashboard** enhanced to show tool usage statistics
7. **Favorites feature** to let users bookmark their favorite tools
8. **Recent tools section** showing recently used tools

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd tools-hub
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
Create a `.env` file in the root directory with the following content:
```
MONGODB_URI=mongodb://127.0.0.1:27017/tools_hub
PORT=8080
```

4. Install and start MongoDB:
```bash
# On Ubuntu/Debian
sudo apt-get install mongodb
sudo systemctl start mongodb

# Or use MongoDB Atlas (cloud version) and update MONGODB_URI in .env
```

5. Initialize sample data:
```bash
node initialize-sample-data.js
```

6. Start the server:
```bash
npm start
# or
node server.js
```

## Running with Docker (Alternative)

If you prefer using Docker, you can run MongoDB and the application with Docker:

1. Install Docker and Docker Compose
2. Create a docker-compose.yml file:
```yaml
version: '3.8'
services:
  mongodb:
    image: mongo:latest
    ports:
      - "27017:27017"
    volumes:
      - mongodb_data:/data/db

  tools-hub:
    build: .
    ports:
      - "8080:8080"
    depends_on:
      - mongodb
    environment:
      - MONGODB_URI=mongodb://mongodb:27017/tools_hub
      - PORT=8080

volumes:
  mongodb_data:
```

## Usage

Once the server is running, navigate to `http://localhost:8080` in your browser to access the ToolsHub interface.

- Browse tools by category
- Search for specific tools
- Add tools to favorites
- View analytics about tool usage
- Access recently used tools

## Technologies Used

- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **Real-time Communication**: Socket.IO
- **Frontend**: HTML, CSS, JavaScript, Bootstrap
- **Package Manager**: npm

## Project Structure

```
tools-hub/
├── server.js                 # Main server file
├── models/                   # Database models
│   ├── Tool.js
│   ├── User.js
│   └── Analytics.js
├── routes/                   # API routes
│   ├── tools.js
│   ├── users.js
│   └── analytics.js
├── public/                   # Frontend assets
│   ├── css/
│   ├── js/
│   ├── tools/
│   └── index.html
├── initialize-sample-data.js # Script to initialize sample tools
└── README.md
```

## API Endpoints

- `GET /api/tools` - Get all tools with pagination and filtering
- `GET /api/tools/:id` - Get a single tool by ID
- `POST /api/tools/record-usage/:toolId` - Record tool usage
- `GET /api/tools/category/:category` - Get tools by category
- `GET /api/users/:userId` - Get or create user
- `POST /api/users/:userId/favorites/:toolId` - Add tool to favorites
- `DELETE /api/users/:userId/favorites/:toolId` - Remove tool from favorites
- `GET /api/users/:userId/favorites` - Get user's favorite tools
- `POST /api/users/:userId/recent/:toolId` - Add tool to recent tools
- `GET /api/users/:userId/recent` - Get user's recent tools
- `GET /api/analytics/overview` - Get overall analytics
- `GET /api/analytics/tool/:toolId` - Get analytics for a specific tool

## Available Tools

Currently implemented tools include:
- Password Generator
- URL Shortener
- Unit Converter
- More tools can be easily added following the existing pattern

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Commit your changes (`git commit -m 'Add some amazing feature'`)
5. Push to the branch (`git push origin feature/amazing-feature`)
6. Open a pull request

## License

This project is licensed under the MIT License.