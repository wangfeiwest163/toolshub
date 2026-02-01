const axios = require('axios');
const cheerio = require('cheerio'); // For HTML parsing

class WebsiteAnalyzer {
  constructor() {
    this.timeout = 10000; // 10 seconds
    this.maxRedirects = 5;
  }

  async analyze(url) {
    try {
      // Validate URL
      new URL(url);
      
      const startTime = Date.now();
      
      // Perform the analysis
      const redirects = await this.traceRedirects(url);
      const finalUrl = redirects.length > 0 ? redirects[redirects.length - 1].to : url;
      
      // Analyze the final URL
      const finalResponse = await this.analyzeFinalUrl(finalUrl);
      
      // Parse HTML content if available
      let htmlAnalysis = {};
      if (finalResponse && finalResponse.data) {
        htmlAnalysis = this.analyzeHtmlContent(finalResponse.data);
      }
      
      // Calculate response time
      const responseTime = Date.now() - startTime;
      
      // Combine all results
      return {
        originalUrl: url,
        finalUrl: finalUrl,
        responseTime: responseTime,
        redirects: redirects,
        finalResponse: finalResponse ? {
          statusCode: finalResponse.status,
          headers: finalResponse.headers,
          statusText: finalResponse.statusText,
          size: finalResponse.headers['content-length'] || 'unknown',
          contentType: finalResponse.headers['content-type']
        } : null,
        htmlAnalysis: htmlAnalysis,
        security: this.extractSecurityInfo(finalResponse),
        technologies: this.detectTechnologies(finalResponse, htmlAnalysis),
        performance: this.estimatePerformanceMetrics(redirects, finalResponse)
      };
    } catch (error) {
      console.error('Error in website analysis:', error);
      throw error;
    }
  }

  async traceRedirects(url) {
    const redirects = [];
    let currentUrl = url;
    let count = 0;
    
    while (count < this.maxRedirects) {
      try {
        // Use axios with maxRedirects: 0 to handle redirects manually
        const response = await axios.head(currentUrl, {
          timeout: this.timeout,
          maxRedirects: 0,
          validateStatus: (status) => status < 500
        });
        
        // Check if this is a redirect status
        if ([300, 301, 302, 303, 307, 308].includes(response.status)) {
          const redirectTo = response.headers.location;
          
          if (redirectTo) {
            const resolvedRedirect = new URL(redirectTo, currentUrl).href;
            redirects.push({
              from: currentUrl,
              to: resolvedRedirect,
              statusCode: response.status,
              headers: response.headers,
              timestamp: Date.now()
            });
            
            currentUrl = resolvedRedirect;
            count++;
          } else {
            // No redirect location, break the loop
            redirects.push({
              from: currentUrl,
              to: currentUrl,
              statusCode: response.status,
              headers: response.headers,
              timestamp: Date.now()
            });
            break;
          }
        } else {
          // Not a redirect, add final destination and break
          redirects.push({
            from: currentUrl,
            to: currentUrl,
            statusCode: response.status,
            headers: response.headers,
            timestamp: Date.now()
          });
          break;
        }
      } catch (error) {
        // Handle error in redirect chain
        if (error.response) {
          if ([300, 301, 302, 303, 307, 308].includes(error.response.status)) {
            const redirectTo = error.response.headers.location;
            
            if (redirectTo) {
              const resolvedRedirect = new URL(redirectTo, currentUrl).href;
              redirects.push({
                from: currentUrl,
                to: resolvedRedirect,
                statusCode: error.response.status,
                headers: error.response.headers,
                timestamp: Date.now()
              });
              
              currentUrl = resolvedRedirect;
              count++;
            } else {
              // No redirect location, break the loop
              redirects.push({
                from: currentUrl,
                to: currentUrl,
                statusCode: error.response.status,
                headers: error.response.headers,
                timestamp: Date.now(),
                error: error.message
              });
              break;
            }
          } else {
            // Non-redirect error
            redirects.push({
              from: currentUrl,
              to: currentUrl,
              statusCode: error.response.status,
              headers: error.response.headers,
              timestamp: Date.now(),
              error: error.message
            });
            break;
          }
        } else {
          // Network error
          redirects.push({
            from: currentUrl,
            to: null,
            statusCode: null,
            headers: {},
            timestamp: Date.now(),
            error: error.message
          });
          break;
        }
      }
    }
    
    return redirects;
  }

  async analyzeFinalUrl(url) {
    try {
      // Get full response with content
      const response = await axios.get(url, {
        timeout: this.timeout,
        maxRedirects: 0, // We already handled redirects
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; OpenClaw Website Analyzer)'
        }
      });
      
      return response;
    } catch (error) {
      if (error.response) {
        // Return response even if it's an error status
        return error.response;
      } else {
        // Network error
        throw error;
      }
    }
  }

  analyzeHtmlContent(html) {
    const $ = cheerio.load(html);
    
    // Extract basic HTML information
    const title = $('title').text().trim();
    const description = $('meta[name="description"]').attr('content') || 
                       $('meta[property="og:description"]').attr('content') || '';
    const keywords = $('meta[name="keywords"]').attr('content') || '';
    
    // Count various elements
    const headings = {
      h1: $('h1').length,
      h2: $('h2').length,
      h3: $('h3').length,
      h4: $('h4').length,
      h5: $('h5').length,
      h6: $('h6').length
    };
    
    const links = {
      internal: 0,
      external: 0,
      total: 0,
      broken: 0
    };
    
    const images = {
      total: 0,
      withAlt: 0,
      withoutAlt: 0
    };
    
    // Analyze links
    $('a[href]').each((i, elem) => {
      const href = $(elem).attr('href');
      if (href) {
        links.total++;
        if (href.startsWith('#') || href.startsWith('/') || 
           href.includes(window.location.hostname)) {
          links.internal++;
        } else {
          links.external++;
        }
      }
    });
    
    // Analyze images
    $('img').each((i, elem) => {
      images.total++;
      const alt = $(elem).attr('alt');
      if (alt && alt.trim() !== '') {
        images.withAlt++;
      } else {
        images.withAlt--;
      }
    });
    
    // Check for common frameworks/libraries
    const scripts = [];
    $('script[src]').each((i, elem) => {
      const src = $(elem).attr('src');
      if (src) {
        scripts.push(src);
      }
    });
    
    // Check for CSS frameworks
    const stylesheets = [];
    $('link[rel="stylesheet"]').each((i, elem) => {
      const href = $(elem).attr('href');
      if (href) {
        stylesheets.push(href);
      }
    });
    
    return {
      title: title,
      description: description,
      keywords: keywords,
      headings: headings,
      links: links,
      images: images,
      scripts: scripts,
      stylesheets: stylesheets,
      metaTags: this.extractMetaTags($)
    };
  }

  extractMetaTags($) {
    const metaTags = {};
    
    $('meta').each((i, elem) => {
      const name = $(elem).attr('name') || $(elem).attr('property') || $(elem).attr('http-equiv');
      const content = $(elem).attr('content');
      
      if (name && content) {
        metaTags[name] = content;
      }
    });
    
    return metaTags;
  }

  extractSecurityInfo(response) {
    if (!response || !response.headers) {
      return {};
    }
    
    const headers = response.headers;
    const securityHeaders = {};
    
    // Common security headers to check for
    const securityHeaderNames = [
      'strict-transport-security',
      'content-security-policy',
      'x-frame-options',
      'x-content-type-options',
      'x-xss-protection',
      'referrer-policy',
      'permissions-policy',
      'expect-ct',
      'feature-policy'
    ];
    
    securityHeaderNames.forEach(header => {
      if (headers[header]) {
        securityHeaders[header] = headers[header];
      }
    });
    
    // Determine if site is secure
    const isSecureConnection = headers['strict-transport-security'] !== undefined;
    const hasCSP = headers['content-security-policy'] !== undefined;
    const hasXFrameOptions = headers['x-frame-options'] !== undefined;
    const hasXContentTypeOptions = headers['x-content-type-options'] !== undefined;
    
    return {
      securityHeaders: securityHeaders,
      isSecureConnection: isSecureConnection,
      hasCSP: hasCSP,
      hasXFrameOptions: hasXFrameOptions,
      hasXContentTypeOptions: hasXContentTypeOptions,
      securityScore: this.calculateSecurityScore(securityHeaders)
    };
  }

  calculateSecurityScore(headers) {
    let score = 0;
    const maxScore = 5;
    
    if (headers['strict-transport-security']) score += 1;
    if (headers['content-security-policy']) score += 1;
    if (headers['x-frame-options']) score += 1;
    if (headers['x-content-type-options']) score += 1;
    if (headers['x-xss-protection']) score += 1;
    
    return Math.round((score / maxScore) * 100);
  }

  detectTechnologies(response, htmlAnalysis) {
    const technologies = {
      frameworks: [],
      libraries: [],
      cms: [],
      servers: [],
      languages: []
    };
    
    if (response && response.headers) {
      const server = response.headers.server;
      if (server) {
        if (server.toLowerCase().includes('apache')) {
          technologies.servers.push('Apache');
        } else if (server.toLowerCase().includes('nginx')) {
          technologies.servers.push('Nginx');
        } else if (server.toLowerCase().includes('iis') || server.toLowerCase().includes('microsoft')) {
          technologies.servers.push('Microsoft IIS');
        }
      }
      
      const poweredBy = response.headers['x-powered-by'] || response.headers['x-generator'];
      if (poweredBy) {
        const lowerPoweredBy = poweredBy.toLowerCase();
        if (lowerPoweredBy.includes('php')) {
          technologies.languages.push('PHP');
        } else if (lowerPoweredBy.includes('asp.net')) {
          technologies.languages.push('ASP.NET');
        } else if (lowerPoweredBy.includes('express')) {
          technologies.frameworks.push('Express.js');
        }
      }
    }
    
    if (htmlAnalysis && htmlAnalysis.scripts) {
      htmlAnalysis.scripts.forEach(script => {
        const lowerScript = script.toLowerCase();
        if (lowerScript.includes('jquery')) {
          technologies.libraries.push('jQuery');
        } else if (lowerScript.includes('react')) {
          technologies.libraries.push('React');
        } else if (lowerScript.includes('vue')) {
          technologies.libraries.push('Vue.js');
        } else if (lowerScript.includes('angular')) {
          technologies.libraries.push('Angular');
        } else if (lowerScript.includes('bootstrap')) {
          technologies.frameworks.push('Bootstrap');
        }
      });
    }
    
    if (htmlAnalysis && htmlAnalysis.stylesheets) {
      htmlAnalysis.stylesheets.forEach(stylesheet => {
        const lowerStylesheet = stylesheet.toLowerCase();
        if (lowerStylesheet.includes('bootstrap')) {
          technologies.frameworks.push('Bootstrap');
        } else if (lowerStylesheet.includes('tailwind')) {
          technologies.frameworks.push('Tailwind CSS');
        }
      });
    }
    
    if (htmlAnalysis && htmlAnalysis.metaTags) {
      const generator = htmlAnalysis.metaTags.generator || htmlAnalysis.metaTags.Generator;
      if (generator) {
        const lowerGenerator = generator.toLowerCase();
        if (lowerGenerator.includes('wordpress')) {
          technologies.cms.push('WordPress');
        } else if (lowerGenerator.includes('drupal')) {
          technologies.cms.push('Drupal');
        } else if (lowerGenerator.includes('joomla')) {
          technologies.cms.push('Joomla');
        }
      }
    }
    
    return technologies;
  }

  estimatePerformanceMetrics(redirects, response) {
    const metrics = {
      dnsLookupTime: Math.floor(Math.random() * 50) + 10, // Simulated
      connectTime: Math.floor(Math.random() * 100) + 20, // Simulated
      tlsHandshakeTime: response && response.config && response.config.url.startsWith('https') ? 
                         Math.floor(Math.random() * 80) + 20 : 0, // Simulated
      timeToFirstByte: Math.floor(Math.random() * 300) + 50, // Simulated
      downloadTime: Math.floor(Math.random() * 200) + 50, // Simulated
      totalTime: 0,
      redirectCount: redirects.length - 1,
      redirectTime: redirects.reduce((acc, curr) => acc + (curr.timestamp ? 10 : 0), 0) // Simulated
    };
    
    metrics.totalTime = metrics.dnsLookupTime + metrics.connectTime + 
                       metrics.tlsHandshakeTime + metrics.timeToFirstByte + 
                       metrics.downloadTime + metrics.redirectTime;
                       
    return metrics;
  }
}

module.exports = new WebsiteAnalyzer();