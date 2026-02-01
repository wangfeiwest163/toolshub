const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// Initialize database connection
const dbManager = require('./utils/database');
dbManager.connect()
.then(() => {
  if (dbManager.fallbackMode) {
    console.log('Running in fallback mode with in-memory storage');
  }
})
.catch(err => console.error('Database connection error:', err));

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Set up rate limiting to prevent abuse
const rateLimit = require('express-rate-limit');
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Security headers
const helmet = require('helmet');
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https:", "http:"],
      scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
      imgSrc: ["'self'", "data:", "https:", "http:"],
      fontSrc: ["'self'", "https:", "data:", "fonts.gstatic.com", "cdnjs.cloudflare.com"],
      connectSrc: ["'self'", "https:", "http:"],
      frameSrc: ["'self'"],
      objectSrc: ["'none'"],
      mediaSrc: ["'self'"],
      childSrc: ["'self'"]
    },
  },
  crossOriginEmbedderPolicy: false,
}));

// Import routes
const toolRoutes = require('./routes/tools');
const userRoutes = require('./routes/users');
const analyticsRoutes = require('./routes/analytics');
const urlRoutes = require('./routes/urls');
const urlAnalyzerRoutes = require('./routes/url-analyzer');

// Routes
app.use('/api/tools', toolRoutes);
app.use('/api/users', userRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/urls', urlRoutes);
app.use('/api/url-analyzer', urlAnalyzerRoutes);

// Serve index.html for the root route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Serve individual tool pages
app.get('/tool/:id', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'tools', 'tool-template.html'));
});

// Serve specific tool pages
app.get('/tools/password-generator', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'tools', 'password-generator.html'));
});

app.get('/tools/url-shortener', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'tools', 'url-shortener.html'));
});

app.get('/tools/unit-converter', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'tools', 'unit-converter.html'));
});

app.get('/tools/all', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'tools-list.html'));
});

// All tool routes
app.get('/tools/qr-generator', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'tools', 'qr-generator.html'));
});

app.get('/tools/url-analyzer', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'tools', 'url-analyzer.html'));
});

app.get('/tools/website-scraper', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'tools', 'website-scraper.html'));
});

app.get('/tools/file-converter', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'tools', 'file-converter.html'));
});

app.get('/tools/text-editor', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'tools', 'text-editor.html'));
});

app.get('/tools/notes', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'tools', 'notes.html'));
});

app.get('/tools/timer', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'tools', 'timer.html'));
});

app.get('/tools/countdown-timer', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'tools', 'countdown-timer.html'));
});

app.get('/tools/alarm-clock', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'tools', 'alarm-clock.html'));
});

app.get('/tools/scientific-calculator', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'tools', 'scientific-calculator.html'));
});

app.get('/tools/financial-calculator', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'tools', 'financial-calculator.html'));
});

app.get('/tools/bmi-calculator', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'tools', 'bmi-calculator.html'));
});

app.get('/tools/age-calculator', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'tools', 'age-calculator.html'));
});

app.get('/tools/mortgage-calculator', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'tools', 'mortgage-calculator.html'));
});

app.get('/tools/tax-calculator', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'tools', 'tax-calculator.html'));
});

app.get('/tools/tip-calculator', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'tools', 'tip-calculator.html'));
});

app.get('/tools/fuel-cost-calculator', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'tools', 'fuel-cost-calculator.html'));
});

app.get('/tools/text-formatter', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'tools', 'text-formatter.html'));
});

app.get('/tools/case-converter', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'tools', 'case-converter.html'));
});

app.get('/tools/character-counter', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'tools', 'character-counter.html'));
});

app.get('/tools/spell-checker', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'tools', 'spell-checker.html'));
});

app.get('/tools/text-to-speech', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'tools', 'text-to-speech.html'));
});

app.get('/tools/plagiarism-checker', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'tools', 'plagiarism-checker.html'));
});

app.get('/tools/word-counter', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'tools', 'word-counter.html'));
});

app.get('/tools/text-reverser', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'tools', 'text-reverser.html'));
});

app.get('/tools/image-compressor', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'tools', 'image-compressor.html'));
});

app.get('/tools/image-resizer', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'tools', 'image-resizer.html'));
});

app.get('/tools/watermark-tool', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'tools', 'watermark-tool.html'));
});

app.get('/tools/color-picker', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'tools', 'color-picker.html'));
});

app.get('/tools/image-cropper', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'tools', 'image-cropper.html'));
});

app.get('/tools/image-format-converter', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'tools', 'image-format-converter.html'));
});

app.get('/tools/image-adjuster', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'tools', 'image-adjuster.html'));
});

app.get('/tools/screenshot-tool', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'tools', 'screenshot-tool.html'));
});

app.get('/tools/json-formatter', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'tools', 'json-formatter.html'));
});

app.get('/tools/regex-tester', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'tools', 'regex-tester.html'));
});

app.get('/tools/code-minifier', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'tools', 'code-minifier.html'));
});

app.get('/tools/api-testing', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'tools', 'api-testing.html'));
});

app.get('/tools/base64', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'tools', 'base64.html'));
});

app.get('/tools/html-entities', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'tools', 'html-entities.html'));
});

app.get('/tools/timestamp-converter', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'tools', 'timestamp-converter.html'));
});

app.get('/tools/hash-generator', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'tools', 'hash-generator.html'));
});

app.get('/tools/currency-converter', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'tools', 'currency-converter.html'));
});

app.get('/tools/timezone-converter', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'tools', 'timezone-converter.html'));
});

app.get('/tools/temperature-converter', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'tools', 'temperature-converter.html'));
});

app.get('/tools/binary-converter', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'tools', 'binary-converter.html'));
});

app.get('/tools/data-size-converter', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'tools', 'data-size-converter.html'));
});

app.get('/tools/speed-converter', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'tools', 'speed-converter.html'));
});

app.get('/tools/area-converter', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'tools', 'area-converter.html'));
});

app.get('/tools/volume-converter', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'tools', 'volume-converter.html'));
});

// Analytics dashboard
app.get('/analytics', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'analytics.html'));
});

// User dashboard
app.get('/dashboard', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'dashboard.html'));
});

// URL redirect route - this should be handled by the urls route middleware
// Instead, we'll add the redirect route directly here
app.get('/s/:code', async (req, res) => {
  try {
    const dbManager = require('./utils/database');
    const Url = dbManager.getUrlModel();
    
    const urlEntry = await Url.findOne({ 
      shortCode: req.params.code, 
      isActive: true 
    }).lean();
    
    if (!urlEntry) {
      return res.status(404).send('<h1>URL Not Found</h1><p>The short URL you are looking for does not exist.</p>');
    }
    
    // Increment click counter
    await Url.findByIdAndUpdate(urlEntry._id, { $inc: { clicks: 1 } });
    
    // Redirect to original URL
    res.redirect(urlEntry.longUrl);
  } catch (error) {
    console.error('Error redirecting URL:', error);
    res.status(500).send('<h1>Server Error</h1><p>An error occurred while processing your request.</p>');
  }
});

// Stats page for URL
app.get('/stats/:code', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'tools', 'url-stats.html'));
});

// Debug route for QR code
app.get('/debug-qr', (req, res) => {
  res.sendFile(path.join(__dirname, 'debug-qr.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error occurred:', err.stack);
  
  // Log the error for debugging
  const errorDetails = {
    message: err.message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
    url: req.url,
    method: req.method,
    timestamp: new Date().toISOString()
  };
  
  // Send appropriate error response
  if (err.name === 'ValidationError') {
    res.status(400).json({
      error: 'Validation Error',
      message: err.message
    });
  } else if (err.name === 'UnauthorizedError') {
    res.status(401).json({
      error: 'Unauthorized',
      message: 'Access token is invalid or missing'
    });
  } else if (err.code === 'ENOENT') {
    res.status(404).json({
      error: 'Not Found',
      message: 'Requested resource was not found'
    });
  } else {
    res.status(500).json({
      error: 'Internal Server Error',
      message: process.env.NODE_ENV === 'development' ? 
        err.message : 'Something went wrong on our end'
    });
  }
});

// 404 handler for undefined routes
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: 'The requested resource could not be found'
  });
});

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log('A user connected');

  // Track page visits
  socket.on('pageVisit', (data) => {
    // Simulate visitor count update
    const count = Math.floor(Math.random() * 1000) + 1500; // Higher base count for demo
    io.emit('updateVisitorCount', { count });
  });

  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});