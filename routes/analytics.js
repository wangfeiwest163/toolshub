const express = require('express');
const router = express.Router();
const dbManager = require('../utils/database');
const Analytics = dbManager.getAnalyticsModel();
const Tool = dbManager.getToolModel();
const mongoose = require('mongoose');

// Get overall analytics
router.get('/', async (req, res) => {
    try {
        // Calculate total visits
        const totalVisits = await Analytics.countDocuments();
        
        // Calculate today's visits
        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0);
        const todayVisits = await Analytics.countDocuments({
            timestamp: { $gte: startOfDay }
        });
        
        // Get top 5 most used tools
        const popularTools = await Analytics.aggregate([
            { $match: { eventType: 'use' } },
            { $group: { _id: '$toolId', count: { $sum: 1 } } },
            { $sort: { count: -1 } },
            { $limit: 5 },
            {
                $lookup: {
                    from: 'tools',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'toolInfo'
                }
            },
            { $unwind: '$toolInfo' },
            {
                $project: {
                    name: '$toolInfo.name',
                    visits: '$count'
                }
            }
        ]);
        
        // Get weekly trends (last 7 days)
        const weekStart = new Date();
        weekStart.setDate(weekStart.getDate() - 6); // 7 days including today
        
        const dailyCounts = await Analytics.aggregate([
            {
                $match: {
                    timestamp: { $gte: weekStart },
                    eventType: 'view'
                }
            },
            {
                $group: {
                    _id: {
                        $dateToString: { format: "%Y-%m-%d", date: "$timestamp" }
                    },
                    count: { $sum: 1 }
                }
            },
            {
                $sort: { _id: 1 }
            }
        ]);
        
        // Format weekly data with day names
        const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        const weekDates = [];
        for (let i = 6; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            weekDates.push(date);
        }
        
        const weeklyTrends = weekDates.map(date => {
            const dateString = date.toISOString().split('T')[0];
            const dayMatch = dailyCounts.find(d => d._id === dateString);
            return {
                day: daysOfWeek[date.getDay()],
                visits: dayMatch ? dayMatch.count : 0
            };
        });
        
        res.json({
            totalVisits,
            todayVisits,
            popularTools,
            weeklyTrends
        });
    } catch (error) {
        console.error('Error fetching analytics:', error);
        res.status(500).json({ 
            message: 'Internal server error',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});

// Get tool-specific analytics
router.get('/tools/:toolId', async (req, res) => {
    try {
        const toolId = req.params.toolId;
        
        // Get total uses for this tool
        const totalUses = await Analytics.countDocuments({ 
            toolId: toolId,
            eventType: 'use'
        });
        
        // Get daily usage for the past 7 days
        const weekStart = new Date();
        weekStart.setDate(weekStart.getDate() - 6);
        
        const dailyUses = await Analytics.aggregate([
            {
                $match: {
                    toolId: mongoose.Types.ObjectId(toolId),
                    timestamp: { $gte: weekStart },
                    eventType: 'use'
                }
            },
            {
                $group: {
                    _id: {
                        $dateToString: { format: "%Y-%m-%d", date: "$timestamp" }
                    },
                    count: { $sum: 1 }
                }
            },
            {
                $sort: { _id: 1 }
            }
        ]);
        
        // Fill in missing days with 0
        const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        const weekDates = [];
        for (let i = 6; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            weekDates.push(date);
        }
        
        const formattedDailyUses = weekDates.map(date => {
            const dateString = date.toISOString().split('T')[0];
            const dayMatch = dailyUses.find(d => d._id === dateString);
            return {
                day: daysOfWeek[date.getDay()],
                count: dayMatch ? dayMatch.count : 0
            };
        });
        
        // Calculate user satisfaction (mock calculation)
        const userSatisfaction = Math.floor(Math.random() * 30) + 70; // Percentage
        
        res.json({
            toolId: toolId,
            totalUses,
            dailyUses: formattedDailyUses,
            userSatisfaction
        });
    } catch (error) {
        if (error.name === 'CastError') {
            return res.status(400).json({ message: 'Invalid tool ID format' });
        }
        console.error('Error fetching tool analytics:', error);
        res.status(500).json({ 
            message: 'Internal server error',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});

// Get daily analytics
router.get('/daily', async (req, res) => {
    try {
        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date();
        endOfDay.setHours(23, 59, 59, 999);
        
        const visits = await Analytics.countDocuments({
            timestamp: { $gte: startOfDay, $lte: endOfDay }
        });
        
        // Count unique visitors (by IP)
        const uniqueVisitors = await Analytics.distinct('ip', {
            timestamp: { $gte: startOfDay, $lte: endOfDay }
        });
        
        // Calculate average page views per session (mock calculation)
        const pageViews = visits * 2.5; // Assuming 2.5 pages per visit on average
        
        // Calculate bounce rate (mock calculation)
        const bounceRate = Math.random() * 20 + 30; // Between 30% and 50%
        
        res.json({
            date: startOfDay.toISOString().split('T')[0],
            visits,
            uniqueVisitors: uniqueVisitors.length,
            pageViews: Math.round(pageViews),
            bounceRate: Math.round(bounceRate)
        });
    } catch (error) {
        console.error('Error fetching daily analytics:', error);
        res.status(500).json({ 
            message: 'Internal server error',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});

// Get weekly analytics
router.get('/weekly', async (req, res) => {
    try {
        const weekStart = new Date();
        weekStart.setDate(weekStart.getDate() - 6);
        
        const weeklyData = await Analytics.aggregate([
            {
                $match: {
                    timestamp: { $gte: weekStart },
                    eventType: 'view'
                }
            },
            {
                $group: {
                    _id: {
                        $dateToString: { format: "%Y-%m-%d", date: "$timestamp" }
                    },
                    count: { $sum: 1 }
                }
            },
            {
                $sort: { _id: 1 }
            }
        ]);
        
        // Calculate total visits
        const totalVisits = weeklyData.reduce((sum, day) => sum + day.count, 0);
        
        // Format the data with day names
        const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        const weekDates = [];
        for (let i = 6; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            weekDates.push(date);
        }
        
        const formattedData = weekDates.map(date => {
            const dateString = date.toISOString().split('T')[0];
            const dayMatch = weeklyData.find(d => d._id === dateString);
            return {
                day: daysOfWeek[date.getDay()],
                visits: dayMatch ? dayMatch.count : 0
            };
        });
        
        res.json({
            period: 'Last 7 days',
            totalVisits,
            data: formattedData
        });
    } catch (error) {
        console.error('Error fetching weekly analytics:', error);
        res.status(500).json({ 
            message: 'Internal server error',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});

// Get monthly analytics
router.get('/monthly', async (req, res) => {
    try {
        const twelveMonthsAgo = new Date();
        twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 11);
        twelveMonthsAgo.setDate(1); // Start from beginning of the month
        
        const monthlyData = await Analytics.aggregate([
            {
                $match: {
                    timestamp: { $gte: twelveMonthsAgo },
                    eventType: 'view'
                }
            },
            {
                $group: {
                    _id: {
                        $dateToString: { format: "%Y-%m", date: "$timestamp" }
                    },
                    count: { $sum: 1 }
                }
            },
            {
                $sort: { _id: 1 }
            }
        ]);
        
        // Generate all 12 months to ensure we have data for each
        const months = [];
        const currentDate = new Date();
        for (let i = 11; i >= 0; i--) {
            const date = new Date();
            date.setMonth(currentDate.getMonth() - i);
            const monthStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
            months.push(monthStr);
        }
        
        const formattedData = months.map(month => {
            const monthMatch = monthlyData.find(m => m._id === month);
            const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
            const [year, monthNum] = month.split('-');
            return {
                month: monthNames[parseInt(monthNum) - 1],
                visits: monthMatch ? monthMatch.count : 0
            };
        });
        
        // Calculate total visits
        const totalVisits = monthlyData.reduce((sum, month) => sum + month.count, 0);
        
        res.json({
            period: 'Last 12 months',
            totalVisits,
            data: formattedData
        });
    } catch (error) {
        console.error('Error fetching monthly analytics:', error);
        res.status(500).json({ 
            message: 'Internal server error',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});

// Get user engagement metrics
router.get('/engagement', async (req, res) => {
    try {
        // Calculate returning users (users who visited in the last 30 days and before that)
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        
        const recentVisitors = await Analytics.distinct('ip', {
            timestamp: { $gte: thirtyDaysAgo }
        });
        
        const thirtyToOneHundredDaysAgo = new Date();
        thirtyToOneHundredDaysAgo.setDate(thirtyToOneHundredDaysAgo.getDate() - 100);
        
        const previousVisitors = await Analytics.distinct('ip', {
            timestamp: { 
                $gte: thirtyToOneHundredDaysAgo,
                $lt: thirtyDaysAgo
            }
        });
        
        // Find common IPs (returning users)
        const returningUsers = recentVisitors.filter(ip => previousVisitors.includes(ip)).length;
        
        // Mock average session duration (in seconds)
        const avgSessionDuration = Math.floor(Math.random() * 120) + 180; // Between 3-5 minutes
        
        // Mock pages per session
        const pagesPerSession = parseFloat((Math.random() * 2 + 2.5).toFixed(1)); // Between 2.5-4.5
        
        res.json({
            returningUsers,
            avgSessionDuration,
            pagesPerSession
        });
    } catch (error) {
        console.error('Error fetching engagement metrics:', error);
        res.status(500).json({ 
            message: 'Internal server error',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});

// Track a page view or interaction
router.post('/track', async (req, res) => {
    try {
        const { userId, toolId, action, page, referrer, ip, userAgent } = req.body;
        
        // Validate required fields
        if (!ip) {
            return res.status(400).json({ message: 'IP address is required' });
        }
        
        // Determine event type based on action
        let eventType = 'view';
        if (action === 'use') eventType = 'use';
        else if (action === 'favorite') eventType = 'favorite';
        else if (action === 'search') eventType = 'search';
        
        // Create new analytics record using create method which works with both real DB and fallback
        const analyticsRecord = await Analytics.create({
            toolId: toolId || null,
            userId: userId || null,
            ip,
            userAgent,
            eventType,
            timestamp: new Date()
        });
        
        // Get updated total visits
        const totalVisits = await Analytics.countDocuments();
        
        res.json({
            message: 'Analytics data recorded successfully',
            totalVisits,
            recordId: analyticsRecord._id
        });
    } catch (error) {
        console.error('Error tracking analytics:', error);
        res.status(500).json({ 
            message: 'Internal server error',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});

module.exports = router;