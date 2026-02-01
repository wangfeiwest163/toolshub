// Function to scrape a website
async function scrapeWebsite(website, maxPages, delay, includeSubdomains) {
    return new Promise(async (resolve) => {
        // Simulate scraping process with progress updates
        updateProgress(0, "Initializing scraper...");
        
        // Mock data generation to simulate scraping
        const results = {
            website: website,
            summary: {
                pagesScraped: 0,
                totalLinks: 0,
                uniquePages: 0,
                duration: 0,
                avgResponseTime: 0
            },
            pages: [],
            content: {
                wordCount: 0,
                images: [],
                commonWords: [],
                externalDomains: []
            },
            links: {
                internal: [],
                external: [],
                broken: []
            }
        };
        
        // Simulate scraping multiple pages
        const startTime = Date.now();
        let totalResponseTime = 0;
        const totalLinks = [];
        const uniquePagesSet = new Set();
        
        for (let i = 0; i < maxPages; i++) {
            // Update progress
            const progress = ((i + 1) / maxPages) * 100;
            updateProgress(progress, `Scraping page ${i + 1} of ${maxPages}...`);
            
            // Simulate delay between requests
            await new Promise(resolve => setTimeout(resolve, delay / maxPages));
            
            // Generate mock page data
            const pageUrl = i === 0 ? website : `${website}/page-${i}`;
            uniquePagesSet.add(pageUrl);
            
            // Generate mock response time
            const responseTime = Math.floor(200 + Math.random() * 800);
            totalResponseTime += responseTime;
            
            // Generate mock page data
            const pageData = {
                url: pageUrl,
                statusCode: Math.random() > 0.1 ? 200 : 404, // 90% success rate
                size: Math.floor(10000 + Math.random() * 50000),
                responseTime: responseTime,
                title: `Page ${i + 1} Title`,
                description: `Description for page ${i + 1}`
            };
            
            results.pages.push(pageData);
            results.summary.pagesScraped++;
            
            // Generate mock links for this page
            const numLinks = Math.floor(5 + Math.random() * 15);
            for (let j = 0; j < numLinks; j++) {
                const isExternal = Math.random() > 0.7; // 30% external links
                const linkDomain = isExternal 
                    ? `https://external${j}.com/page${j}` 
                    : `${website}/subpage-${j}`;
                    
                totalLinks.push({
                    from: pageUrl,
                    to: linkDomain,
                    type: isExternal ? 'external' : 'internal'
                });
            }
            
            // Add to appropriate link category
            if (pageData.statusCode === 404) {
                results.links.broken.push(pageUrl);
            }
        }
        
        // Process collected data
        results.summary.totalLinks = totalLinks.length;
        results.summary.uniquePages = uniquePagesSet.size;
        results.summary.duration = Math.round((Date.now() - startTime) / 1000);
        results.summary.avgResponseTime = Math.round(totalResponseTime / results.summary.pagesScraped);
        
        // Categorize links
        totalLinks.forEach(link => {
            if (link.type === 'external') {
                results.links.external.push(link.to);
                const domain = new URL(link.to).hostname;
                if (!results.content.externalDomains.includes(domain)) {
                    results.content.externalDomains.push(domain);
                }
            } else {
                results.links.internal.push(link.to);
            }
        });
        
        // Generate mock content data
        results.content.wordCount = Math.floor(5000 + Math.random() * 15000);
        results.content.images = Array.from({length: Math.floor(10 + Math.random() * 20)}, (_, i) => ({
            url: `${website}/image-${i}.jpg`,
            alt: `Image ${i} alt text`
        }));
        
        results.content.commonWords = [
            'the', 'and', 'to', 'of', 'a', 'in', 'is', 'it', 
            'you', 'that', 'he', 'was', 'for', 'on', 'are'
        ].sort(() => 0.5 - Math.random()).slice(0, 15);
        
        // Remove duplicates from external domains
        results.content.externalDomains = [...new Set(results.content.externalDomains)];
        
        updateProgress(100, "Scraping completed!");
        setTimeout(() => resolve(results), 500); // Small delay to show completion
    });
}

// Function to update progress bar
function updateProgress(percent, text) {
    const progressBar = document.getElementById('progressBar');
    const progressText = document.getElementById('progressText');
    
    if (progressBar && progressText) {
        progressBar.style.width = percent + '%';
        progressBar.textContent = Math.round(percent) + '%';
        progressText.textContent = text;
    }
}