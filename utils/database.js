const mongoose = require('mongoose');
require('dotenv').config();

class DatabaseManager {
  constructor() {
    this.isConnected = false;
    this.fallbackMode = false;
    // Setup fallback models immediately so they're available even before connection attempt
    this.setupFallbackModels();
    // Set initial state to fallback mode since MongoDB might not be available
    this.fallbackMode = true;
  }

  async connect() {
    try {
      // Try to connect to MongoDB with additional options to prevent timeouts
      await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/toolshub', {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
        bufferCommands: false, // Disable mongoose buffering
        maxPoolSize: 10, // Maintain up to 10 socket connections
        serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5s
        socketTimeoutMS: 45000, // Close sockets after 45s of inactivity
      });

      this.isConnected = true;
      this.fallbackMode = false; // Only use real models if connected
      console.log('Connected to MongoDB');
      
      // Test the connection
      await mongoose.connection.db.admin().ping();
    } catch (error) {
      console.warn('MongoDB connection failed:', error.message);
      console.log('Switching to fallback mode with in-memory storage');
      this.fallbackMode = true;
    }
  }

  setupFallbackModels() {
    // Create in-memory fallback models
    this.tools = [
      {
        _id: '1',
        name: "Password Generator",
        description: "Generate secure passwords with customizable options",
        category: "Utility Tools",
        url: "/tools/password-generator",
        icon: "key",
        popularity: 120,
        createdAt: new Date(),
        isActive: true
      },
      {
        _id: '2',
        name: "QR Code Generator",
        description: "Create custom QR codes for websites, text, and contact information",
        category: "Utility Tools",
        url: "/tools/qr-generator",
        icon: "qrcode",
        popularity: 95,
        createdAt: new Date(),
        isActive: true
      },
      {
        _id: '3',
        name: "File Converter",
        description: "Convert files between different formats (PDF, DOC, JPG, etc.)",
        category: "Utility Tools",
        url: "/tools/file-converter",
        icon: "file-export",
        popularity: 87,
        createdAt: new Date(),
        isActive: true
      },
      {
        _id: '4',
        name: "Unit Converter",
        description: "Convert measurements between various units (length, weight, temperature)",
        category: "Utility Tools",
        url: "/tools/unit-converter",
        icon: "exchange-alt",
        popularity: 103,
        createdAt: new Date(),
        isActive: true
      },
      {
        _id: '5',
        name: "URL Shortener",
        description: "Create short, memorable URLs from long web addresses",
        category: "Utility Tools",
        url: "/tools/url-shortener",
        icon: "link",
        popularity: 115,
        createdAt: new Date(),
        isActive: true
      },
      {
        _id: '6',
        name: "Text Editor",
        description: "Simple online text editor with formatting options",
        category: "Utility Tools",
        url: "/tools/text-editor",
        icon: "edit",
        popularity: 78,
        createdAt: new Date(),
        isActive: true
      },
      {
        _id: '7',
        name: "Note Taking App",
        description: "Quick note taking with sync across devices",
        category: "Utility Tools",
        url: "/tools/notes",
        icon: "sticky-note",
        popularity: 85,
        createdAt: new Date(),
        isActive: true
      },
      {
        _id: '8',
        name: "Timer & Stopwatch",
        description: "Precision timer and stopwatch for all your timing needs",
        category: "Utility Tools",
        url: "/tools/timer",
        icon: "stopwatch",
        popularity: 92,
        createdAt: new Date(),
        isActive: true
      },
      {
        _id: '9',
        name: "Scientific Calculator",
        description: "Advanced calculator with trigonometric, logarithmic, and statistical functions",
        category: "Online Calculators",
        url: "/tools/scientific-calculator",
        icon: "calculator",
        popularity: 78,
        createdAt: new Date(),
        isActive: true
      },
      {
        _id: '10',
        name: "Financial Calculator",
        description: "Calculate loans, investments, interest rates, and financial planning",
        category: "Online Calculators",
        url: "/tools/financial-calculator",
        icon: "money-bill-wave",
        popularity: 89,
        createdAt: new Date(),
        isActive: true
      },
      {
        _id: '11',
        name: "BMI Calculator",
        description: "Calculate Body Mass Index and assess health metrics",
        category: "Online Calculators",
        url: "/tools/bmi-calculator",
        icon: "weight",
        popularity: 112,
        createdAt: new Date(),
        isActive: true
      },
      {
        _id: '12',
        name: "Age Calculator",
        description: "Calculate age in years, months, days from birthdate",
        category: "Online Calculators",
        url: "/tools/age-calculator",
        icon: "birthday-cake",
        popularity: 67,
        createdAt: new Date(),
        isActive: true
      },
      {
        _id: '13',
        name: "Mortgage Calculator",
        description: "Calculate mortgage payments and compare loan options",
        category: "Online Calculators",
        url: "/tools/mortgage-calculator",
        icon: "home",
        popularity: 74,
        createdAt: new Date(),
        isActive: true
      },
      {
        _id: '14',
        name: "Tax Calculator",
        description: "Calculate taxes based on income and deductions",
        category: "Online Calculators",
        url: "/tools/tax-calculator",
        icon: "balance-scale",
        popularity: 63,
        createdAt: new Date(),
        isActive: true
      },
      {
        _id: '15',
        name: "Tip Calculator",
        description: "Quickly calculate tips for restaurants and services",
        category: "Online Calculators",
        url: "/tools/tip-calculator",
        icon: "hand-holding-usd",
        popularity: 81,
        createdAt: new Date(),
        isActive: true
      },
      {
        _id: '16',
        name: "Fuel Cost Calculator",
        description: "Calculate fuel costs for trips based on distance and vehicle efficiency",
        category: "Online Calculators",
        url: "/tools/fuel-cost-calculator",
        icon: "gas-pump",
        popularity: 56,
        createdAt: new Date(),
        isActive: true
      },
      {
        _id: '17',
        name: "Text Formatter",
        description: "Format and clean up text with various styling options",
        category: "Text Tools",
        url: "/tools/text-formatter",
        icon: "font",
        popularity: 91,
        createdAt: new Date(),
        isActive: true
      },
      {
        _id: '18',
        name: "Case Converter",
        description: "Change text case (uppercase, lowercase, title case)",
        category: "Text Tools",
        url: "/tools/case-converter",
        icon: "text-height",
        popularity: 76,
        createdAt: new Date(),
        isActive: true
      },
      {
        _id: '19',
        name: "Character Counter",
        description: "Count characters, words, and lines in text",
        category: "Text Tools",
        url: "/tools/character-counter",
        icon: "paragraph",
        popularity: 84,
        createdAt: new Date(),
        isActive: true
      },
      {
        _id: '20',
        name: "Spell Checker",
        description: "Check spelling and grammar in your text",
        category: "Text Tools",
        url: "/tools/spell-checker",
        icon: "spell-check",
        popularity: 73,
        createdAt: new Date(),
        isActive: true
      },
      {
        _id: '21',
        name: "Text to Speech",
        description: "Convert text to spoken audio",
        category: "Text Tools",
        url: "/tools/text-to-speech",
        icon: "volume-up",
        popularity: 69,
        createdAt: new Date(),
        isActive: true
      },
      {
        _id: '22',
        name: "Plagiarism Checker",
        description: "Check text for potential plagiarism",
        category: "Text Tools",
        url: "/tools/plagiarism-checker",
        icon: "search",
        popularity: 58,
        createdAt: new Date(),
        isActive: true
      },
      {
        _id: '23',
        name: "Word Counter",
        description: "Count words, sentences, and paragraphs",
        category: "Text Tools",
        url: "/tools/word-counter",
        icon: "font",
        popularity: 71,
        createdAt: new Date(),
        isActive: true
      },
      {
        _id: '24',
        name: "Text Reverser",
        description: "Reverse text character by character",
        category: "Text Tools",
        url: "/tools/text-reverser",
        icon: "undo",
        popularity: 45,
        createdAt: new Date(),
        isActive: true
      },
      {
        _id: '25',
        name: "Image Compressor",
        description: "Reduce image file size without losing quality",
        category: "Image Tools",
        url: "/tools/image-compressor",
        icon: "compress",
        popularity: 109,
        createdAt: new Date(),
        isActive: true
      },
      {
        _id: '26',
        name: "Image Resizer",
        description: "Resize images to specific dimensions or percentages",
        category: "Image Tools",
        url: "/tools/image-resizer",
        icon: "expand",
        popularity: 98,
        createdAt: new Date(),
        isActive: true
      },
      {
        _id: '27',
        name: "Watermark Tool",
        description: "Add watermarks to protect your images",
        category: "Image Tools",
        url: "/tools/watermark-tool",
        icon: "stamp",
        popularity: 82,
        createdAt: new Date(),
        isActive: true
      },
      {
        _id: '28',
        name: "Color Picker",
        description: "Select colors from images or create custom palettes",
        category: "Image Tools",
        url: "/tools/color-picker",
        icon: "palette",
        popularity: 75,
        createdAt: new Date(),
        isActive: true
      },
      {
        _id: '29',
        name: "Image Cropper",
        description: "Crop images to specific dimensions or aspect ratios",
        category: "Image Tools",
        url: "/tools/image-cropper",
        icon: "crop",
        popularity: 87,
        createdAt: new Date(),
        isActive: true
      },
      {
        _id: '30',
        name: "Image Format Converter",
        description: "Convert between different image formats (JPG, PNG, GIF, etc.)",
        category: "Image Tools",
        url: "/tools/image-format-converter",
        icon: "sync",
        popularity: 79,
        createdAt: new Date(),
        isActive: true
      },
      {
        _id: '31',
        name: "Image Brightness Adjuster",
        description: "Adjust brightness, contrast, and saturation of images",
        category: "Image Tools",
        url: "/tools/image-adjuster",
        icon: "sun",
        popularity: 64,
        createdAt: new Date(),
        isActive: true
      },
      {
        _id: '32',
        name: "Screenshot Tool",
        description: "Take and annotate screenshots directly in the browser",
        category: "Image Tools",
        url: "/tools/screenshot-tool",
        icon: "camera",
        popularity: 52,
        createdAt: new Date(),
        isActive: true
      },
      {
        _id: '33',
        name: "JSON Formatter",
        description: "Format and validate JSON data with syntax highlighting",
        category: "Developer Tools",
        url: "/tools/json-formatter",
        icon: "code",
        popularity: 125,
        createdAt: new Date(),
        isActive: true
      },
      {
        _id: '34',
        name: "Regex Tester",
        description: "Test regular expressions with live pattern matching",
        category: "Developer Tools",
        url: "/tools/regex-tester",
        icon: "search",
        popularity: 118,
        createdAt: new Date(),
        isActive: true
      },
      {
        _id: '35',
        name: "Code Minifier",
        description: "Minify CSS, JS, and HTML code for better performance",
        category: "Developer Tools",
        url: "/tools/code-minifier",
        icon: "cut",
        popularity: 105,
        createdAt: new Date(),
        isActive: true
      },
      {
        _id: '36',
        name: "API Testing Tool",
        description: "Test and debug API endpoints with a simple interface",
        category: "Developer Tools",
        url: "/tools/api-testing",
        icon: "plug",
        popularity: 97,
        createdAt: new Date(),
        isActive: true
      },
      {
        _id: '37',
        name: "Base64 Encoder/Decoder",
        description: "Encode and decode Base64 strings",
        category: "Developer Tools",
        url: "/tools/base64",
        icon: "lock",
        popularity: 88,
        createdAt: new Date(),
        isActive: true
      },
      {
        _id: '38',
        name: "HTML Entity Encoder/Decoder",
        description: "Encode and decode HTML entities",
        category: "Developer Tools",
        url: "/tools/html-entities",
        icon: "code",
        popularity: 72,
        createdAt: new Date(),
        isActive: true
      },
      {
        _id: '39',
        name: "Timestamp Converter",
        description: "Convert timestamps to and from human-readable dates",
        category: "Developer Tools",
        url: "/tools/timestamp-converter",
        icon: "clock",
        popularity: 83,
        createdAt: new Date(),
        isActive: true
      },
      {
        _id: '40',
        name: "Hash Generator",
        description: "Generate MD5, SHA1, SHA256 hashes for strings",
        category: "Developer Tools",
        url: "/tools/hash-generator",
        icon: "hashtag",
        popularity: 77,
        createdAt: new Date(),
        isActive: true
      },
      {
        _id: '41',
        name: "Currency Converter",
        description: "Convert between different world currencies with live rates",
        category: "Converter Tools",
        url: "/tools/currency-converter",
        icon: "dollar-sign",
        popularity: 145,
        createdAt: new Date(),
        isActive: true
      },
      {
        _id: '42',
        name: "Time Zone Converter",
        description: "Convert time between different time zones around the world",
        category: "Converter Tools",
        url: "/tools/timezone-converter",
        icon: "clock",
        popularity: 138,
        createdAt: new Date(),
        isActive: true
      },
      {
        _id: '43',
        name: "Temperature Converter",
        description: "Convert temperatures between Celsius, Fahrenheit, and Kelvin",
        category: "Converter Tools",
        url: "/tools/temperature-converter",
        icon: "thermometer-half",
        popularity: 86,
        createdAt: new Date(),
        isActive: true
      },
      {
        _id: '44',
        name: "Binary Converter",
        description: "Convert numbers between decimal, binary, octal, and hexadecimal",
        category: "Converter Tools",
        url: "/tools/binary-converter",
        icon: "binary",
        popularity: 79,
        createdAt: new Date(),
        isActive: true
      },
      {
        _id: '45',
        name: "Data Size Converter",
        description: "Convert between different data storage units (KB, MB, GB, etc.)",
        category: "Converter Tools",
        url: "/tools/data-size-converter",
        icon: "database",
        popularity: 68,
        createdAt: new Date(),
        isActive: true
      },
      {
        _id: '46',
        name: "Speed Converter",
        description: "Convert between different speed units (km/h, mph, m/s, etc.)",
        category: "Converter Tools",
        url: "/tools/speed-converter",
        icon: "tachometer-alt",
        popularity: 54,
        createdAt: new Date(),
        isActive: true
      },
      {
        _id: '47',
        name: "Area Converter",
        description: "Convert between different area units (square meters, acres, etc.)",
        category: "Converter Tools",
        url: "/tools/area-converter",
        icon: "draw-polygon",
        popularity: 49,
        createdAt: new Date(),
        isActive: true
      },
      {
        _id: '48',
        name: "Volume Converter",
        description: "Convert between different volume units (liters, gallons, etc.)",
        category: "Converter Tools",
        url: "/tools/volume-converter",
        icon: "fill-drip",
        popularity: 57,
        createdAt: new Date(),
        isActive: true
      }
    ];

    // Create a mock model interface
    const self = this; // Capture 'this' reference
    
    this.ToolModel = {
      find: function(query = {}) {
        let result = [...self.tools];
        
        if (query.isActive !== undefined) {
          result = result.filter(tool => tool.isActive === query.isActive);
        }
        
        if (query.category) {
          result = result.filter(tool => tool.category === query.category);
        }
        
        // Handle search queries
        if (query.$or) {
          const searchTerms = [];
          query.$or.forEach(condition => {
            if (condition.name && condition.name.$regex) {
              searchTerms.push(condition.name.$regex.toLowerCase());
            }
            if (condition.description && condition.description.$regex) {
              searchTerms.push(condition.description.$regex.toLowerCase());
            }
          });
          
          result = result.filter(tool => {
            return searchTerms.some(term => 
              tool.name.toLowerCase().includes(term) || 
              tool.description.toLowerCase().includes(term)
            );
          });
        }
        
        const queryResult = {
          sort: function(sortObj) {
            if (sortObj.popularity === -1) {
              result.sort((a, b) => b.popularity - a.popularity);
            }
            return {
              skip: function(skip) {
                const skippedResult = result.slice(skip);
                return {
                  limit: function(limit) {
                    const limitedResult = skippedResult.slice(0, limit);
                    return {
                      lean: function() {
                        return limitedResult;
                      }
                    };
                  },
                  lean: function() {
                    return skippedResult;
                  }
                };
              },
              limit: function(limit) {
                const limitedResult = result.slice(0, limit);
                return {
                  lean: function() {
                    return limitedResult;
                  }
                };
              },
              lean: function() {
                return result;
              }
            };
          },
          skip: function(skip) {
            const skippedResult = result.slice(skip);
            return {
              limit: function(limit) {
                const limitedResult = skippedResult.slice(0, limit);
                return {
                  lean: function() {
                    return limitedResult;
                  }
                };
              },
              lean: function() {
                return skippedResult;
              }
            };
          },
          lean: function() {
            return result;
          }
        };
        
        return queryResult;
      },
      findById: function(id) {
        return self.tools.find(tool => tool._id === id) || null;
      },
      countDocuments: function(query = {}) {
        let count = self.tools.length;
        if (query.isActive !== undefined) {
          count = self.tools.filter(tool => tool.isActive === query.isActive).length;
        }
        if (query.category) {
          count = self.tools.filter(tool => tool.category === query.category).length;
        }
        // Handle search queries
        if (query.$or) {
          const searchTerms = [];
          query.$or.forEach(condition => {
            if (condition.name && condition.name.$regex) {
              searchTerms.push(condition.name.$regex.toLowerCase());
            }
            if (condition.description && condition.description.$regex) {
              searchTerms.push(condition.description.$regex.toLowerCase());
            }
          });
          
          count = self.tools.filter(tool => {
            return searchTerms.some(term => 
              tool.name.toLowerCase().includes(term) || 
              tool.description.toLowerCase().includes(term)
            );
          }).length;
        }
        return Promise.resolve(count);
      },
      findByIdAndUpdate: async function(id, update, options) {
        const tool = self.tools.find(t => t._id === id);
        if (!tool) return null;
        
        // Apply updates
        if (update.$inc && update.$inc.popularity) {
          tool.popularity += update.$inc.popularity;
        }
        
        return tool;
      }
    };

    // Create mock User model
    this.users = [];
    this.UserModel = {
      findOne: (query) => {
        let result = null;
        if (query._id) {
          result = this.users.find(user => user._id === query._id);
        } else if (query.$or) {
          for (const condition of query.$or) {
            if (condition.username) {
              result = this.users.find(user => user.username === condition.username);
              if (result) break;
            } else if (condition.email) {
              result = this.users.find(user => user.email === condition.email);
              if (result) break;
            }
          }
        }
        return {
          select: () => Promise.resolve(result),
          populate: () => ({ select: () => Promise.resolve(result) })
        };
      },
      findById: (id) => {
        return this.users.find(user => user._id === id) || null;
      },
      create: (userData) => {
        const newUser = {
          _id: Date.now().toString(),
          ...userData,
          createdAt: new Date(),
          lastLogin: new Date()
        };
        this.users.push(newUser);
        return Promise.resolve(newUser);
      }
    };

    // Create mock URL model for shortener
    this.urls = [];
    this.UrlModel = {
      findOne: (query) => {
        let result = null;
        if (query.shortCode) {
          result = this.urls.find(url => url.shortCode === query.shortCode && (query.isActive === undefined || url.isActive === query.isActive));
        } else if (query.longUrl) {
          result = this.urls.find(url => url.longUrl === query.longUrl && (query.isActive === undefined || url.isActive === query.isActive));
        }
        return {
          lean: () => Promise.resolve(result)
        };
      },
      findById: (id) => {
        const result = this.urls.find(url => url._id === id);
        return Promise.resolve(result);
      },
      create: (data) => {
        const newUrl = {
          _id: Date.now().toString(),
          clicks: 0,
          createdAt: new Date(),
          isActive: true,
          ...data
        };
        this.urls.push(newUrl);
        return Promise.resolve(newUrl);
      },
      findByIdAndUpdate: (id, update, options) => {
        const url = this.urls.find(u => u._id === id);
        if (url) {
          // Handle $inc operation for clicks
          if (update.$inc && update.$inc.clicks) {
            url.clicks += update.$inc.clicks;
          }
          // Handle other updates
          for (const key in update) {
            if (key !== '$inc') {
              url[key] = update[key];
            }
          }
          return Promise.resolve(url);
        }
        return Promise.resolve(null);
      }
    };

    // Create mock Analytics model
    this.analytics = [];
    this.AnalyticsModel = {
      create: (data) => {
        const newRecord = {
          _id: Date.now().toString(),
          ...data,
          timestamp: new Date()
        };
        this.analytics.push(newRecord);
        return Promise.resolve(newRecord);
      },
      countDocuments: () => Promise.resolve(this.analytics.length),
      distinct: (field, query) => {
        const values = [...new Set(this.analytics.map(item => item[field]))];
        return Promise.resolve(values);
      },
      aggregate: (pipeline) => {
        // Simplified aggregation for demo purposes
        if (pipeline.some(step => step.$match && step.$match.eventType === 'use')) {
          // Return mock data for tool usage
          return Promise.resolve([
            { _id: '1', count: 120 },
            { _id: '2', count: 95 },
            { _id: '3', count: 87 }
          ]);
        }
        return Promise.resolve([]);
      }
    };
  }

  getToolModel() {
    if (this.fallbackMode) {
      return this.ToolModel;
    } else {
      return require('../models/Tool');
    }
  }

  getUserModel() {
    if (this.fallbackMode) {
      return this.UserModel;
    } else {
      return require('../models/User');
    }
  }

  getAnalyticsModel() {
    if (this.fallbackMode) {
      return this.AnalyticsModel;
    } else {
      return require('../models/Analytics');
    }
  }

  getUrlModel() {
    if (this.fallbackMode) {
      return this.UrlModel;
    } else {
      return require('../models/Url');
    }
  }
}

module.exports = new DatabaseManager();