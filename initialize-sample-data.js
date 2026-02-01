const mongoose = require('mongoose');
require('dotenv').config();

// Import the Tool model
const Tool = require('./models/Tool');

// Sample tools data
const sampleTools = [
  // Utility Tools
  {
    name: "Password Generator",
    description: "Generate secure passwords with customizable options",
    category: "Utility Tools",
    url: "/tools/password-generator",
    icon: "key",
    popularity: 120
  },
  {
    name: "QR Code Generator",
    description: "Create custom QR codes for websites, text, and contact information",
    category: "Utility Tools",
    url: "/tools/qr-generator",
    icon: "qrcode",
    popularity: 95
  },
  {
    name: "File Converter",
    description: "Convert files between different formats (PDF, DOC, JPG, etc.)",
    category: "Utility Tools",
    url: "/tools/file-converter",
    icon: "file-export",
    popularity: 87
  },
  {
    name: "Unit Converter",
    description: "Convert measurements between various units (length, weight, temperature)",
    category: "Utility Tools",
    url: "/tools/unit-converter",
    icon: "exchange-alt",
    popularity: 103
  },

  // AI Tools
  {
    name: "AI Text Generator",
    description: "Generate high-quality text content using AI technology",
    category: "AI Tools",
    url: "/tools/ai-text-generator",
    icon: "robot",
    popularity: 156
  },
  {
    name: "AI Image Enhancer",
    description: "Improve image quality and resolution using artificial intelligence",
    category: "AI Tools",
    url: "/tools/ai-image-enhancer",
    icon: "magic",
    popularity: 142
  },
  {
    name: "AI Writing Assistant",
    description: "Get help with writing, editing, and proofreading documents",
    category: "AI Tools",
    url: "/tools/ai-writing-assistant",
    icon: "pen-fancy",
    popularity: 134
  },
  {
    name: "ChatGPT Alternative",
    description: "Converse with an AI assistant for various tasks and questions",
    category: "AI Tools",
    url: "/tools/chat-gpt-alt",
    icon: "comments",
    popularity: 168
  },

  // Online Calculators
  {
    name: "Scientific Calculator",
    description: "Advanced calculator with trigonometric, logarithmic, and statistical functions",
    category: "Online Calculators",
    url: "/tools/scientific-calculator",
    icon: "calculator",
    popularity: 78
  },
  {
    name: "Financial Calculator",
    description: "Calculate loans, investments, interest rates, and financial planning",
    category: "Online Calculators",
    url: "/tools/financial-calculator",
    icon: "money-bill-wave",
    popularity: 89
  },
  {
    name: "BMI Calculator",
    description: "Calculate Body Mass Index and assess health metrics",
    category: "Online Calculators",
    url: "/tools/bmi-calculator",
    icon: "weight",
    popularity: 112
  },
  {
    name: "Age Calculator",
    description: "Calculate age in years, months, days from birthdate",
    category: "Online Calculators",
    url: "/tools/age-calculator",
    icon: "birthday-cake",
    popularity: 67
  },

  // Text Tools
  {
    name: "Text Formatter",
    description: "Format and clean up text with various styling options",
    category: "Text Tools",
    url: "/tools/text-formatter",
    icon: "font",
    popularity: 91
  },
  {
    name: "Case Converter",
    description: "Change text case (uppercase, lowercase, title case)",
    category: "Text Tools",
    url: "/tools/case-converter",
    icon: "text-height",
    popularity: 76
  },
  {
    name: "Character Counter",
    description: "Count characters, words, and lines in text",
    category: "Text Tools",
    url: "/tools/character-counter",
    icon: "paragraph",
    popularity: 84
  },
  {
    name: "Spell Checker",
    description: "Check spelling and grammar in your text",
    category: "Text Tools",
    url: "/tools/spell-checker",
    icon: "spell-check",
    popularity: 73
  },

  // Image Tools
  {
    name: "Image Compressor",
    description: "Reduce image file size without losing quality",
    category: "Image Tools",
    url: "/tools/image-compressor",
    icon: "compress",
    popularity: 109
  },
  {
    name: "Image Resizer",
    description: "Resize images to specific dimensions or percentages",
    category: "Image Tools",
    url: "/tools/image-resizer",
    icon: "expand",
    popularity: 98
  },
  {
    name: "Watermark Tool",
    description: "Add watermarks to protect your images",
    category: "Image Tools",
    url: "/tools/watermark-tool",
    icon: "stamp",
    popularity: 82
  },
  {
    name: "Color Picker",
    description: "Select colors from images or create custom palettes",
    category: "Image Tools",
    url: "/tools/color-picker",
    icon: "palette",
    popularity: 75
  },

  // Developer Tools
  {
    name: "JSON Formatter",
    description: "Format and validate JSON data with syntax highlighting",
    category: "Developer Tools",
    url: "/tools/json-formatter",
    icon: "code",
    popularity: 125
  },
  {
    name: "Regex Tester",
    description: "Test regular expressions with live pattern matching",
    category: "Developer Tools",
    url: "/tools/regex-tester",
    icon: "search",
    popularity: 118
  },
  {
    name: "Code Minifier",
    description: "Minify CSS, JS, and HTML code for better performance",
    category: "Developer Tools",
    url: "/tools/code-minifier",
    icon: "cut",
    popularity: 105
  },
  {
    name: "API Testing Tool",
    description: "Test and debug API endpoints with a simple interface",
    category: "Developer Tools",
    url: "/tools/api-testing",
    icon: "plug",
    popularity: 97
  },

  // Converter Tools
  {
    name: "Currency Converter",
    description: "Convert between different world currencies with live rates",
    category: "Converter Tools",
    url: "/tools/currency-converter",
    icon: "dollar-sign",
    popularity: 145
  },
  {
    name: "Time Zone Converter",
    description: "Convert time between different time zones around the world",
    category: "Converter Tools",
    url: "/tools/timezone-converter",
    icon: "clock",
    popularity: 138
  },
  {
    name: "Temperature Converter",
    description: "Convert temperatures between Celsius, Fahrenheit, and Kelvin",
    category: "Converter Tools",
    url: "/tools/temperature-converter",
    icon: "thermometer-half",
    popularity: 86
  },
  {
    name: "Binary Converter",
    description: "Convert numbers between decimal, binary, octal, and hexadecimal",
    category: "Converter Tools",
    url: "/tools/binary-converter",
    icon: "binary",
    popularity: 79
  }
];

async function initializeSampleData() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/tools_hub', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log('Connected to MongoDB');

    // Clear existing tools
    await Tool.deleteMany({});
    console.log('Cleared existing tools');

    // Insert sample tools
    await Tool.insertMany(sampleTools);
    console.log(`Inserted ${sampleTools.length} sample tools`);

    // Close the connection
    await mongoose.connection.close();
    console.log('Sample data initialization completed!');
  } catch (error) {
    console.error('Error initializing sample data:', error);
  }
}

// Run the initialization
initializeSampleData();