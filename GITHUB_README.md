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

## Available Tools

Currently implemented tools include:
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

The application includes an intelligent fallback system that switches to in-memory storage when MongoDB is unavailable, ensuring continuous operation.

## License

This project is licensed under the MIT License.