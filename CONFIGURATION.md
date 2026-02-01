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

## Configuration

### Prerequisites
- Node.js (v14 or higher)
- npm (v6 or higher)
- MongoDB (optional - application falls back to in-memory storage if unavailable)

### Environment Variables

Create a `.env` file in the project root with the following content:
```
PORT=3000
MONGODB_URI=mongodb://localhost:27017/toolshub
NODE_ENV=production
```

Note: Even without MongoDB, the application will work using in-memory storage.

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd tools-hub
```

2. Install dependencies:
```bash
npm install
```

3. Start the server:
```bash
npm start
# or use the startup script
./start.sh
```

## Usage

Once the server is running, navigate to `http://localhost:3000` in your browser to access the ToolsHub interface.

- Browse tools by category
- Search for specific tools
- Add tools to favorites
- View analytics about tool usage
- Access recently used tools

The application has 48 built-in tools including:
- Password Generator
- QR Code Generator
- URL Shortener
- Unit Converter
- File Converter
- Text Editor
- Note Taking App
- Timer & Stopwatch
- Scientific Calculator
- Financial Calculator
- BMI Calculator
- Age Calculator
- Mortgage Calculator
- Tax Calculator
- Tip Calculator
- Fuel Cost Calculator
- Text Formatter
- Case Converter
- Character Counter
- Spell Checker
- Text to Speech
- Plagiarism Checker
- Word Counter
- Text Reverser
- Image Compressor
- Image Resizer
- Watermark Tool
- Color Picker
- Image Cropper
- Image Format Converter
- Image Brightness Adjuster
- Screenshot Tool
- JSON Formatter
- Regex Tester
- Code Minifier
- API Testing Tool
- Base64 Encoder/Decoder
- HTML Entity Encoder/Decoder
- Timestamp Converter
- Hash Generator
- Currency Converter
- Time Zone Converter
- Temperature Converter
- Binary Converter
- Data Size Converter
- Speed Converter
- Area Converter
- Volume Converter

## Special Feature

The application includes an intelligent fallback system that switches to in-memory storage when MongoDB is unavailable, ensuring continuous operation without requiring a database installation.

## Architecture

- **Backend**: Node.js, Express.js
- **Database**: MongoDB (with fallback to in-memory storage)
- **Real-time Communication**: Socket.IO
- **Frontend**: HTML, CSS, JavaScript, Bootstrap

## Troubleshooting

If the application fails to start:

1. Ensure all dependencies are installed: `npm install`
2. Check that the port is not already in use
3. If MongoDB is unavailable, the application will automatically switch to in-memory storage

## Deployment

The application is designed to run in various environments:
- Local development
- Cloud platforms (Heroku, AWS, Google Cloud, etc.)
- Docker containers

For production deployment, ensure appropriate environment variables are set and consider using a process manager like PM2.