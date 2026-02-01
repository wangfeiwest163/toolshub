const express = require('express');
const router = express.Router();
const dbManager = require('../utils/database');
const User = dbManager.getUserModel();
const Tool = dbManager.getToolModel();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Register a new user
router.post('/register', async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // Simple validation
        if (!username || !email || !password) {
            return res.status(400).json({ message: 'Username, email, and password are required' });
        }

        // Check if user already exists
        const existingUser = await User.findOne({
            $or: [{ username }, { email }]
        });
        
        if (existingUser) {
            return res.status(409).json({ message: 'User already exists' });
        }

        // Hash password
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Create new user
        const newUser = new User({
            userId: Date.now().toString(),
            username,
            email,
            password: hashedPassword
        });

        await newUser.save();

        // Generate JWT token
        const token = jwt.sign(
            { userId: newUser._id, username: newUser.username },
            process.env.JWT_SECRET || 'fallback_secret_key',
            { expiresIn: '7d' }
        );

        res.status(201).json({
            message: 'User created successfully',
            user: { 
                id: newUser._id, 
                username: newUser.username, 
                email: newUser.email 
            },
            token
        });
    } catch (error) {
        console.error('Error registering user:', error);
        res.status(500).json({ 
            message: 'Internal server error',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});

// Login a user
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        // Find user by username or email
        const user = await User.findOne({ 
            $or: [{ username }, { email: username }] 
        }).select('+password'); // Include password field
        
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Update last login
        user.lastLogin = new Date();
        await user.save();

        // Generate JWT token
        const token = jwt.sign(
            { userId: user._id, username: user.username },
            process.env.JWT_SECRET || 'fallback_secret_key',
            { expiresIn: '7d' }
        );

        res.json({
            message: 'Login successful',
            user: { 
                id: user._id, 
                username: user.username, 
                email: user.email 
            },
            token
        });
    } catch (error) {
        console.error('Error logging in user:', error);
        res.status(500).json({ 
            message: 'Internal server error',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});

// Get user profile
router.get('/profile/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-password -__v');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json({
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                createdAt: user.createdAt,
                preferences: user.preferences
            }
        });
    } catch (error) {
        if (error.name === 'CastError') {
            return res.status(400).json({ message: 'Invalid user ID format' });
        }
        console.error('Error fetching user profile:', error);
        res.status(500).json({ 
            message: 'Internal server error',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});

// Add a tool to user's favorites
router.post('/favorites/:userId/:toolId', async (req, res) => {
    try {
        const { userId, toolId } = req.params;

        // Verify user exists
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Verify tool exists
        const tool = await Tool.findById(toolId);
        if (!tool) {
            return res.status(404).json({ message: 'Tool not found' });
        }

        // Check if tool is already favorited
        const isFavorite = user.favorites.some(fav => fav.toolId.toString() === toolId);
        if (isFavorite) {
            return res.status(409).json({ message: 'Tool already in favorites' });
        }

        // Add tool to favorites
        user.favorites.push({ toolId });
        await user.save();

        res.json({
            message: 'Tool added to favorites',
            favorites: user.favorites
        });
    } catch (error) {
        if (error.name === 'CastError') {
            return res.status(400).json({ message: 'Invalid ID format' });
        }
        console.error('Error adding favorite:', error);
        res.status(500).json({ 
            message: 'Internal server error',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});

// Remove a tool from user's favorites
router.delete('/favorites/:userId/:toolId', async (req, res) => {
    try {
        const { userId, toolId } = req.params;

        // Verify user exists
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Remove tool from favorites
        user.favorites = user.favorites.filter(fav => fav.toolId.toString() !== toolId);
        await user.save();

        res.json({
            message: 'Tool removed from favorites',
            favorites: user.favorites
        });
    } catch (error) {
        if (error.name === 'CastError') {
            return res.status(400).json({ message: 'Invalid ID format' });
        }
        console.error('Error removing favorite:', error);
        res.status(500).json({ 
            message: 'Internal server error',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});

// Get user's favorite tools
router.get('/favorites/:userId', async (req, res) => {
    try {
        const user = await User.findById(req.params.userId)
            .populate('favorites.toolId', 'name description category url icon')
            .select('favorites');
            
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json({
            favorites: user.favorites.map(fav => ({
                ...fav.toolId.toObject(),
                addedAt: fav.addedAt
            }))
        });
    } catch (error) {
        if (error.name === 'CastError') {
            return res.status(400).json({ message: 'Invalid user ID format' });
        }
        console.error('Error fetching favorites:', error);
        res.status(500).json({ 
            message: 'Internal server error',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});

// Update user preferences
router.put('/preferences/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        const { theme, language } = req.body;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (theme) user.preferences.theme = theme;
        if (language) user.preferences.language = language;

        await user.save();

        res.json({
            message: 'Preferences updated successfully',
            preferences: user.preferences
        });
    } catch (error) {
        if (error.name === 'CastError') {
            return res.status(400).json({ message: 'Invalid user ID format' });
        }
        console.error('Error updating preferences:', error);
        res.status(500).json({ 
            message: 'Internal server error',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});

module.exports = router;

module.exports = router;