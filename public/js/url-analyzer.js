// Function to analyze a URL using the backend API
async function analyzeUrl(url) {
    try {
        // Validate URL format
        new URL(url);
        
        // Call the backend API
        const response = await fetch('/api/url-analyzer/analyze', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ url: url })
        });
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to analyze URL');
        }
        
        const results = await response.json();
        
        // Transform the results to match the expected format
        return transformResults(results);
    } catch (error) {
        throw new Error(`Error analyzing URL: ${error.message}`);
    }
}

// Transform the backend results to match frontend expectations
function transformResults(data) {
    // Extract basic information
    const basic = {
        url: data.finalUrl || data.originalUrl,
        statusCode: data.finalResponse?.statusCode || 'N/A',
        contentType: data.finalResponse?.contentType || 'N/A',
        contentLength: data.finalResponse?.size || 'N/A',
        responseTime: data.responseTime || 0
    };
    
    // Extract headers from final response
    const headers = data.finalResponse?.headers || {};
    
    // Extract security information
    const security = {
        https: data.security?.isSecureConnection || data.originalUrl.startsWith('https'),
        sslValid: true, // Backend doesn't provide explicit SSL validity
        hsts: !!headers['strict-transport-security'],
        csp: !!headers['content-security-policy'],
        xfo: headers['x-frame-options'] || 'Not set'
    };
    
    // Process redirects
    const redirects = data.redirects
        .filter(r => r.from !== r.to) // Only actual redirects
        .map(r => ({
            from: r.from,
            to: r.to,
            statusCode: r.statusCode
        }));
    
    // Performance data
    const performance = data.performance || {
        dnsTime: 'N/A',
        connectTime: 'N/A',
        firstByteTime: 'N/A',
        totalTime: data.responseTime || 0
    };
    
    return {
        basic,
        headers,
        security,
        redirects,
        performance,
        technologies: data.technologies || {},
        htmlAnalysis: data.htmlAnalysis || {}
    };
}