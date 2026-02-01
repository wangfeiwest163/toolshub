const express = require('express');
const router = express.Router();
const dbManager = require('../utils/database');
const Tool = dbManager.getToolModel();

// Get all tools with pagination and filtering
router.get('/', async (req, res) => {
  try {
    const { category, search, page = 1, limit = 12 } = req.query;
    
    // Build query object
    let query = { isActive: true };
    
    if (category) {
      query.category = category;
    }
    
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }
    
    // Execute query with pagination
    const total = await Tool.countDocuments(query);
    const tools = await Tool.find(query)
      .sort({ popularity: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .lean();
    
    res.json({
      tools,
      totalPages: Math.ceil(total / limit),
      currentPage: parseInt(page),
      total
    });
  } catch (error) {
    console.error('Error fetching tools:', error);
    res.status(500).json({ 
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Get popular tools - This needs to be defined BEFORE the general /:id route
router.get('/popular/:limit?', async (req, res) => {
  try {
    const limit = parseInt(req.params.limit) || 10;
    const tools = await Tool.find({ isActive: true })
      .sort({ popularity: -1 })
      .limit(limit)
      .lean();
    
    res.json(tools);
  } catch (error) {
    console.error('Error fetching popular tools:', error);
    res.status(500).json({ 
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// URL shortening functionality
router.post('/url-shorten', async (req, res) => {
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
    
    // In a real implementation, we would store the mapping in the database
    // For the fallback mode, we'll simulate it
    const dbManager = require('../utils/database');
    if (dbManager.fallbackMode) {
      // Generate a random short code if not provided
      const shortCode = customCode || Math.random().toString(36).substring(2, 8);
      
      // In the fallback mode, we'll just return the short URL without storing it
      // In a real implementation, this would be stored in the database
      return res.json({
        originalUrl: longUrl,
        shortUrl: `${req.protocol}://${req.get('host')}/s/${shortCode}`,
        shortCode: shortCode,
        createdAt: new Date().toISOString()
      });
    } else {
      // For the real database implementation, we would store the mapping
      // This would require a URL model which isn't currently implemented
      const shortCode = customCode || Math.random().toString(36).substring(2, 8);
      
      return res.json({
        originalUrl: longUrl,
        shortUrl: `${req.protocol}://${req.get('host')}/s/${shortCode}`,
        shortCode: shortCode,
        createdAt: new Date().toISOString()
      });
    }
  } catch (error) {
    console.error('Error shortening URL:', error);
    res.status(500).json({ 
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Get tools by category
router.get('/category/:category', async (req, res) => {
  try {
    const tools = await Tool.find({ 
      category: req.params.category, 
      isActive: true 
    }).sort({ popularity: -1 }).lean();
    
    res.json(tools);
  } catch (error) {
    console.error('Error fetching category tools:', error);
    res.status(500).json({ 
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Record tool usage
router.post('/record-usage/:toolId', async (req, res) => {
  try {
    const result = await Tool.findByIdAndUpdate(
      req.params.toolId,
      { $inc: { popularity: 1 } },
      { new: true, runValidators: true }
    );
    
    if (!result) {
      return res.status(404).json({ message: 'Tool not found' });
    }
    
    res.status(201).json({ 
      message: 'Usage recorded successfully',
      tool: result
    });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({ message: 'Invalid tool ID format' });
    }
    console.error('Error recording usage:', error);
    res.status(500).json({ 
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Get a single tool by ID - This should be LAST since it catches all remaining paths
router.get('/:id', async (req, res) => {
  try {
    const tool = await Tool.findById(req.params.id);
    if (!tool || !tool.isActive) {
      return res.status(404).json({ message: 'Tool not found' });
    }
    res.json(tool);
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({ message: 'Invalid tool ID format' });
    }
    console.error('Error fetching tool:', error);
    res.status(500).json({ 
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

module.exports = router;