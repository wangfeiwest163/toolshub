const express = require('express');
const axios = require('axios');
const websiteAnalyzer = require('../services/website-analyzer');
const router = express.Router();

// Function to analyze a URL
async function analyzeSingleUrl(url) {
    try {
        // Perform HEAD request to get basic info without downloading content
        const response = await axios.head(url, {
            timeout: 10000, // 10 second timeout
            maxRedirects: 0, // We'll handle redirects manually
            validateStatus: (status) => status < 500 // Allow up to 4xx statuses
        });
        
        return {
            url: url,
            statusCode: response.status,
            headers: response.headers,
            responseTime: response.headers['response-time'] || 'N/A'
        };
    } catch (error) {
        if (error.response) {
            // Server responded with error status
            return {
                url: url,
                statusCode: error.response.status,
                headers: error.response.headers,
                error: error.response.statusText
            };
        } else if (error.request) {
            // Request was made but no response received
            return {
                url: url,
                statusCode: null,
                headers: {},
                error: 'No response received'
            };
        } else {
            // Something else happened
            return {
                url: url,
                statusCode: null,
                headers: {},
                error: error.message
            };
        }
    }
}

// Function to trace redirect chain
async function traceRedirects(url, maxRedirects = 5) {
    const redirects = [];
    let currentUrl = url;
    let count = 0;
    
    while (count < maxRedirects) {
        try {
            const response = await axios.head(currentUrl, {
                timeout: 10000,
                maxRedirects: 0
            });
            
            // If status is not a redirect, break the loop
            if (![301, 302, 303, 307, 308].includes(response.status)) {
                redirects.push({
                    from: currentUrl,
                    to: currentUrl,
                    statusCode: response.status,
                    headers: response.headers
                });
                break;
            }
            
            // Add redirect to list
            const redirectTo = response.headers.location;
            redirects.push({
                from: currentUrl,
                to: redirectTo,
                statusCode: response.status,
                headers: response.headers
            });
            
            // If no redirect location, break
            if (!redirectTo) break;
            
            // Resolve relative redirects
            currentUrl = new URL(redirectTo, currentUrl).href;
            count++;
        } catch (error) {
            // Handle error in redirect chain
            if (error.response && [301, 302, 303, 307, 308].includes(error.response.status)) {
                const redirectTo = error.response.headers.location;
                redirects.push({
                    from: currentUrl,
                    to: redirectTo,
                    statusCode: error.response.status,
                    headers: error.response.headers
                });
                
                if (redirectTo) {
                    currentUrl = new URL(redirectTo, currentUrl).href;
                    count++;
                } else {
                    break;
                }
            } else {
                redirects.push({
                    from: currentUrl,
                    to: null,
                    statusCode: error.response?.status || null,
                    error: error.message,
                    headers: error.response?.headers || {}
                });
                break;
            }
        }
    }
    
    return redirects;
}

// Main analysis endpoint
router.post('/analyze', async (req, res) => {
    try {
        const { url } = req.body;
        
        // Validate input
        if (!url) {
            return res.status(400).json({ error: 'URL is required' });
        }
        
        // Validate URL format
        try {
            new URL(url);
        } catch (error) {
            return res.status(400).json({ error: 'Invalid URL format' });
        }
        
        // Use the website analyzer service
        const result = await websiteAnalyzer.analyze(url);
        
        res.json(result);
    } catch (error) {
        console.error('Error analyzing URL:', error);
        res.status(500).json({ 
            error: 'Internal server error',
            message: error.message 
        });
    }
});

// Additional endpoint for quick header check
router.post('/quick-check', async (req, res) => {
    try {
        const { url } = req.body;
        
        if (!url) {
            return res.status(400).json({ error: 'URL is required' });
        }
        
        // Validate URL format
        try {
            new URL(url);
        } catch (error) {
            return res.status(400).json({ error: 'Invalid URL format' });
        }
        
        const result = await analyzeSingleUrl(url);
        res.json(result);
    } catch (error) {
        console.error('Error in quick check:', error);
        res.status(500).json({ 
            error: 'Internal server error',
            message: error.message 
        });
    }
});

module.exports = router;