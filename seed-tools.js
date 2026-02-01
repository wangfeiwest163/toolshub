const mongoose = require('mongoose');
require('dotenv').config();

// Import the Tool model
const Tool = require('./models/Tool');

// Define all 48 tools with their categories
const tools = [
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
  {
    name: "URL Shortener",
    description: "Create short, memorable URLs from long web addresses",
    category: "Utility Tools",
    url: "/tools/url-shortener",
    icon: "link",
    popularity: 115
  },
  {
    name: "Text Editor",
    description: "Simple online text editor with formatting options",
    category: "Utility Tools",
    url: "/tools/text-editor",
    icon: "edit",
    popularity: 78
  },
  {
    name: "Note Taking App",
    description: "Quick note taking with sync across devices",
    category: "Utility Tools",
    url: "/tools/notes",
    icon: "sticky-note",
    popularity: 85
  },
  {
    name: "Timer & Stopwatch",
    description: "Precision timer and stopwatch for all your timing needs",
    category: "Utility Tools",
    url: "/tools/timer",
    icon: "stopwatch",
    popularity: 92
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
  {
    name: "Mortgage Calculator",
    description: "Calculate mortgage payments and compare loan options",
    category: "Online Calculators",
    url: "/tools/mortgage-calculator",
    icon: "home",
    popularity: 74
  },
  {
    name: "Tax Calculator",
    description: "Calculate taxes based on income and deductions",
    category: "Online Calculators",
    url: "/tools/tax-calculator",
    icon: "balance-scale",
    popularity: 63
  },
  {
    name: "Tip Calculator",
    description: "Quickly calculate tips for restaurants and services",
    category: "Online Calculators",
    url: "/tools/tip-calculator",
    icon: "hand-holding-usd",
    popularity: 81
  },
  {
    name: "Fuel Cost Calculator",
    description: "Calculate fuel costs for trips based on distance and vehicle efficiency",
    category: "Online Calculators",
    url: "/tools/fuel-cost-calculator",
    icon: "gas-pump",
    popularity: 56
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
  {
    name: "Text to Speech",
    description: "Convert text to spoken audio",
    category: "Text Tools",
    url: "/tools/text-to-speech",
    icon: "volume-up",
    popularity: 69
  },
  {
    name: "Plagiarism Checker",
    description: "Check text for potential plagiarism",
    category: "Text Tools",
    url: "/tools/plagiarism-checker",
    icon: "search",
    popularity: 58
  },
  {
    name: "Word Counter",
    description: "Count words, sentences, and paragraphs",
    category: "Text Tools",
    url: "/tools/word-counter",
    icon: "font",
    popularity: 71
  },
  {
    name: "Text Reverser",
    description: "Reverse text character by character",
    category: "Text Tools",
    url: "/tools/text-reverser",
    icon: "undo",
    popularity: 45
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
  {
    name: "Image Cropper",
    description: "Crop images to specific dimensions or aspect ratios",
    category: "Image Tools",
    url: "/tools/image-cropper",
    icon: "crop",
    popularity: 87
  },
  {
    name: "Image Format Converter",
    description: "Convert between different image formats (JPG, PNG, GIF, etc.)",
    category: "Image Tools",
    url: "/tools/image-format-converter",
    icon: "sync",
    popularity: 79
  },
  {
    name: "Image Brightness Adjuster",
    description: "Adjust brightness, contrast, and saturation of images",
    category: "Image Tools",
    url: "/tools/image-adjuster",
    icon: "sun",
    popularity: 64
  },
  {
    name: "Screenshot Tool",
    description: "Take and annotate screenshots directly in the browser",
    category: "Image Tools",
    url: "/tools/screenshot-tool",
    icon: "camera",
    popularity: 52
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
  {
    name: "Base64 Encoder/Decoder",
    description: "Encode and decode Base64 strings",
    category: "Developer Tools",
    url: "/tools/base64",
    icon: "lock",
    popularity: 88
  },
  {
    name: "HTML Entity Encoder/Decoder",
    description: "Encode and decode HTML entities",
    category: "Developer Tools",
    url: "/tools/html-entities",
    icon: "code",
    popularity: 72
  },
  {
    name: "Timestamp Converter",
    description: "Convert timestamps to and from human-readable dates",
    category: "Developer Tools",
    url: "/tools/timestamp-converter",
    icon: "clock",
    popularity: 83
  },
  {
    name: "Hash Generator",
    description: "Generate MD5, SHA1, SHA256 hashes for strings",
    category: "Developer Tools",
    url: "/tools/hash-generator",
    icon: "hashtag",
    popularity: 77
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
  },
  {
    name: "Data Size Converter",
    description: "Convert between different data storage units (KB, MB, GB, etc.)",
    category: "Converter Tools",
    url: "/tools/data-size-converter",
    icon: "database",
    popularity: 68
  },
  {
    name: "Speed Converter",
    description: "Convert between different speed units (km/h, mph, m/s, etc.)",
    category: "Converter Tools",
    url: "/tools/speed-converter",
    icon: "tachometer-alt",
    popularity: 54
  },
  {
    name: "Area Converter",
    description: "Convert between different area units (square meters, acres, etc.)",
    category: "Converter Tools",
    url: "/tools/area-converter",
    icon: "draw-polygon",
    popularity: 49
  },
  {
    name: "Volume Converter",
    description: "Convert between different volume units (liters, gallons, etc.)",
    category: "Converter Tools",
    url: "/tools/volume-converter",
    icon: "fill-drip",
    popularity: 57
  }
];

async function seedDatabase() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/toolshub', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('Connected to MongoDB');

    // Clear existing tools
    await Tool.deleteMany({});
    console.log('Cleared existing tools');

    // Insert new tools
    const insertedTools = await Tool.insertMany(tools);
    console.log(`Inserted ${insertedTools.length} tools into the database`);

    // Close the connection
    await mongoose.connection.close();
    console.log('Database seeding completed successfully');
  } catch (error) {
    console.error('Error during database seeding:', error);
    process.exit(1);
  }
}

// Run the seeding function
seedDatabase();