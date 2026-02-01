const express = require('express');
const router = express.Router();
const dbManager = require('../utils/database');
const Url = dbManager.getUrlModel();

// Generate short URL (for backward compatibility)
router.post('/shorten', async (req, res) => {
  try {
    const { longUrl, customCode } = req.body;
    
    // Validation
    if (!longUrl) {
      return res.status(400).json({ message: 'Long URL is required' });
    }
    
    // Basic URL validation
    try {
      new URL(longUrl);
    } catch (err) {
      return res.status(400).json({ message: 'Invalid URL format' });
    }
    
    // Generate short code if not provided
    let shortCode = customCode;
    if (!shortCode) {
      shortCode = generateShortCode();
      
      // Ensure uniqueness
      let existingUrl;
      do {
        existingUrl = await Url.findOne({ shortCode: shortCode }).lean();
        if (existingUrl) {
          shortCode = generateShortCode(); // Generate new code if exists
        }
      } while (existingUrl);
    } else {
      // Check if custom code is already taken
      const existingUrl = await Url.findOne({ shortCode: customCode }).lean();
      if (existingUrl) {
        return res.status(409).json({ message: 'Custom short code already exists' });
      }
    }
    
    // Create short URL entry
    const shortUrl = `${req.protocol}://${req.get('host')}/s/${shortCode}`;
    
    // In fallback mode, we use the create method directly
    // In real DB mode, we would use the constructor approach
    const urlEntry = await Url.create({
      longUrl,
      shortCode,
      shortUrl,
      createdBy: req.ip || 'anonymous'
    });
    
    res.json({
      originalUrl: longUrl,
      shortUrl: shortUrl,
      shortCode: shortCode,
      createdAt: urlEntry.createdAt
    });
  } catch (error) {
    console.error('Error shortening URL:', error);
    res.status(500).json({ 
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Alternative endpoint for direct POST to /api/urls
router.post('/', async (req, res) => {
  try {
    const { longUrl, customCode } = req.body;
    
    // Validation
    if (!longUrl) {
      return res.status(400).json({ message: 'Long URL is required' });
    }
    
    // Basic URL validation
    try {
      new URL(longUrl);
    } catch (err) {
      return res.status(400).json({ message: 'Invalid URL format' });
    }
    
    // Generate short code if not provided
    let shortCode = customCode;
    if (!shortCode) {
      shortCode = generateShortCode();
      
      // Ensure uniqueness
      let existingUrl;
      do {
        existingUrl = await Url.findOne({ shortCode: shortCode }).lean();
        if (existingUrl) {
          shortCode = generateShortCode(); // Generate new code if exists
        }
      } while (existingUrl);
    } else {
      // Check if custom code is already taken
      const existingUrl = await Url.findOne({ shortCode: customCode }).lean();
      if (existingUrl) {
        return res.status(409).json({ message: 'Custom short code already exists' });
      }
    }
    
    // Create short URL entry
    const shortUrl = `${req.protocol}://${req.get('host')}/s/${shortCode}`;
    
    // In fallback mode, we use the create method directly
    // In real DB mode, we would use the constructor approach
    const urlEntry = await Url.create({
      longUrl,
      shortCode,
      shortUrl,
      createdBy: req.ip || 'anonymous'
    });
    
    res.json({
      originalUrl: longUrl,
      shortUrl: shortUrl,
      shortCode: shortCode,
      createdAt: urlEntry.createdAt
    });
  } catch (error) {
    console.error('Error shortening URL:', error);
    res.status(500).json({ 
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Redirect from short code to long URL
router.get('/s/:code', async (req, res) => {
  try {
    const { code } = req.params;
    
    const urlEntry = await Url.findOne({ 
      shortCode: code, 
      isActive: true 
    }).lean();
    
    if (!urlEntry) {
      return res.status(404).json({ message: 'Short URL not found' });
    }
    
    // Increment click counter
    await Url.findByIdAndUpdate(urlEntry._id, { $inc: { clicks: 1 } });
    
    // Redirect to original URL
    res.redirect(urlEntry.longUrl);
  } catch (error) {
    console.error('Error redirecting URL:', error);
    res.status(500).json({ 
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Get URL statistics
router.get('/stats/:code', async (req, res) => {
  try {
    const { code } = req.params;
    
    const urlEntry = await Url.findOne({ 
      shortCode: code, 
      isActive: true 
    }).lean();
    
    if (!urlEntry) {
      return res.status(404).json({ message: 'Short URL not found' });
    }
    
    res.json({
      shortCode: urlEntry.shortCode,
      originalUrl: urlEntry.longUrl,
      shortUrl: urlEntry.shortUrl,
      clicks: urlEntry.clicks,
      createdAt: urlEntry.createdAt,
      createdBy: urlEntry.createdBy
    });
  } catch (error) {
    console.error('Error getting URL stats:', error);
    res.status(500).json({ 
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Generate a random short code
function generateShortCode(length = 6) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

module.exports = router;