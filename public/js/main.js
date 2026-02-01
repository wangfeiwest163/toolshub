// ToolsHub Frontend JavaScript - Enhanced Button Functionality

// Initialize Socket.IO connection
const socket = io();

// Global state
let currentUser = null;
let loadingStates = {};

// Update visitor count
socket.on('updateVisitorCount', (data) => {
    const visitorCountEl = document.getElementById('visitorCount');
    if (visitorCountEl) {
        visitorCountEl.textContent = data.count;
    }
});

// Send page visit event when page loads
window.onload = function() {
    // Only emit if socket is connected
    if (socket) {
        socket.emit('pageVisit', { page: window.location.pathname });
    }
    // Load home page content if on homepage
    if (window.location.pathname === '/' || window.location.pathname === '/index.html') {
        loadHome();
    }
};

// Function to show loading state
function showLoading(buttonId, originalText = null) {
    const button = document.getElementById(buttonId) || document.querySelector(`[data-button-id="${buttonId}"]`);
    if (button) {
        loadingStates[buttonId] = button.innerHTML;
        button.innerHTML = '<span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>Loading...';
        button.disabled = true;
    }
}

// Function to hide loading state
function hideLoading(buttonId) {
    const button = document.getElementById(buttonId) || document.querySelector(`[data-button-id="${buttonId}"]`);
    if (button && loadingStates[buttonId]) {
        button.innerHTML = loadingStates[buttonId];
        button.disabled = false;
        delete loadingStates[buttonId];
    }
}

// Function to show error message
function showError(message, duration = 5000) {
    // Remove any existing error messages
    const existingError = document.querySelector('.global-error-message');
    if (existingError) {
        existingError.remove();
    }
    
    // Create error message element
    const errorDiv = document.createElement('div');
    errorDiv.className = 'alert alert-danger alert-dismissible fade show fixed-top mt-2 global-error-message';
    errorDiv.style.zIndex = '9999';
    errorDiv.style.width = '90%';
    errorDiv.style.left = '5%';
    errorDiv.role = 'alert';
    errorDiv.innerHTML = `
        <strong>Error:</strong> ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    `;
    
    document.body.appendChild(errorDiv);
    
    // Auto-hide after specified duration
    if (duration > 0) {
        setTimeout(() => {
            if (errorDiv.parentNode) {
                errorDiv.remove();
            }
        }, duration);
    }
}

// Function to show success message
function showSuccess(message, duration = 3000) {
    // Remove any existing success messages
    const existingSuccess = document.querySelector('.global-success-message');
    if (existingSuccess) {
        existingSuccess.remove();
    }
    
    // Create success message element
    const successDiv = document.createElement('div');
    successDiv.className = 'alert alert-success alert-dismissible fade show fixed-top mt-2 global-success-message';
    successDiv.style.zIndex = '9999';
    successDiv.style.width = '90%';
    successDiv.style.left = '5%';
    successDiv.role = 'alert';
    successDiv.innerHTML = `
        <strong>Success:</strong> ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    `;
    
    document.body.appendChild(successDiv);
    
    // Auto-hide after specified duration
    if (duration > 0) {
        setTimeout(() => {
            if (successDiv.parentNode) {
                successDiv.remove();
            }
        }, duration);
    }
}

// Function to show loading indicator in main content area
function showMainLoading() {
    const loadingIndicator = document.getElementById('loadingIndicator');
    if (loadingIndicator) {
        loadingIndicator.classList.remove('d-none');
        loadingIndicator.style.display = 'block';
    }
    
    const toolsContainer = document.getElementById('toolsContainer');
    if (toolsContainer) {
        toolsContainer.innerHTML = '<div class="col-12 text-center"><div class="spinner-border" role="status"><span class="visually-hidden">Loading...</span></div></div>';
    }
}

// Function to hide loading indicator in main content area
function hideMainLoading() {
    const loadingIndicator = document.getElementById('loadingIndicator');
    if (loadingIndicator) {
        loadingIndicator.classList.add('d-none');
        loadingIndicator.style.display = 'none';
    }
}

// Function to load home page content
async function loadHome() {
    try {
        showMainLoading();
        
        // Load popular tools
        const response = await fetch('/api/tools?page=1&limit=12');
        if (!response.ok) {
            throw new Error(`API request failed: ${response.status} ${response.statusText}`);
        }
        const data = await response.json();
        
        displayTools(data.tools);
        
        // Load recent tools
        await loadRecentTools();
    } catch (error) {
        console.error('Error loading home page:', error);
        showError(`Failed to load home page: ${error.message}`);
    } finally {
        hideMainLoading();
    }
}

// Function to load tools by category
async function loadCategory(category) {
    try {
        showMainLoading();
        
        const response = await fetch(`/api/tools/category/${encodeURIComponent(category)}`);
        if (!response.ok) {
            throw new Error(`API request failed: ${response.status} ${response.statusText}`);
        }
        const tools = await response.json();
        
        // Update the page title and breadcrumbs if elements exist
        const titleElement = document.querySelector('h1');
        if (titleElement) {
            titleElement.textContent = category;
        }
        
        const toolsContainer = document.getElementById('toolsContainer');
        if (toolsContainer) {
            toolsContainer.innerHTML = `<h3>${category}</h3>`;
            displayTools(tools);
        }
    } catch (error) {
        console.error('Error loading category:', error);
        showError(`Failed to load category: ${error.message}`);
    } finally {
        hideMainLoading();
    }
}

// Function to display tools in grid
function displayTools(tools) {
    const container = document.getElementById('toolsContainer');
    
    if (!container) {
        console.error('Tools container not found');
        return;
    }
    
    if (tools.length === 0) {
        container.innerHTML = '<div class="col-12"><div class="alert alert-info text-center">No tools found in this category.</div></div>';
        return;
    }
    
    // Clear the container if it's showing the category title
    if (container.firstElementChild && container.firstElementChild.tagName === 'H3') {
        container.innerHTML = '';
    }
    
    // Create a grid of tools
    let toolsHtml = '';
    
    tools.forEach(tool => {
        toolsHtml += `
        <div class="col-md-3 col-sm-6 mb-4">
            <div class="card tool-card h-100 shadow-sm">
                <div class="card-body d-flex flex-column">
                    <div class="text-center mb-3">
                        <i class="fas fa-${tool.icon || 'tool'} fa-2x text-primary"></i>
                    </div>
                    <h5 class="card-title">${tool.name}</h5>
                    <p class="card-text flex-grow-1">${tool.description}</p>
                    <div class="mt-auto">
                        <div class="d-flex justify-content-between align-items-center">
                            <small class="text-muted">
                                <i class="fas fa-chart-line"></i> Popularity: ${tool.popularity}
                            </small>
                            <button class="btn btn-sm btn-outline-primary" 
                                onclick="handleUseTool('${tool._id}', '${tool.name}', '${tool.url}')"
                                data-tool-id="${tool._id}"
                                data-tool-name="${tool.name}">
                                <i class="fas fa-external-link-alt me-1"></i> Use Tool
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        `;
    });
    
    container.innerHTML = toolsHtml;
}

// Function to handle tool usage with proper tracking
async function handleUseTool(toolId, toolName, toolUrl) {
    const button = document.querySelector(`[data-tool-id="${toolId}"]`);
    if (!button) return;
    
    try {
        showLoading(`use-tool-${toolId}`, button.innerHTML);
        
        // Record tool usage
        await recordToolUsage(toolId, toolName);
        
        // Open tool in new tab
        window.open(toolUrl, '_blank');
        
        showSuccess(`Opening ${toolName} in new tab`);
    } catch (error) {
        console.error('Error using tool:', error);
        showError(`Failed to use tool: ${error.message}`);
    } finally {
        // Delay hiding loading state to show success feedback
        setTimeout(() => {
            hideLoading(`use-tool-${toolId}`);
        }, 1000);
    }
}

// Function to load recent tools
async function loadRecentTools() {
    try {
        const response = await fetch('/api/tools?limit=6');
        if (!response.ok) {
            throw new Error(`API request failed: ${response.status} ${response.statusText}`);
        }
        const data = await response.json();
        const recentTools = data.tools.slice(0, 6); // Get the first 6 tools
        
        const recentContainer = document.getElementById('recentToolsContainer');
        if (!recentContainer) {
            console.error('Recent tools container not found');
            return;
        }
        
        let recentHtml = '';
        
        recentTools.forEach(tool => {
            recentHtml += `
            <div class="col-md-2 col-4">
                <div class="card text-center h-100" onclick="handleUseTool('${tool._id}', '${tool.name}', '${tool.url}')">
                    <div class="card-body p-2">
                        <i class="fas fa-${tool.icon || 'tool'} fa-lg text-info" style="cursor: pointer;"></i>
                        <h6 class="card-title mt-1 mb-0" style="font-size: 0.8em; cursor: pointer;">${tool.name}</h6>
                    </div>
                </div>
            </div>
            `;
        });
        
        recentContainer.innerHTML = recentHtml;
    } catch (error) {
        console.error('Error loading recent tools:', error);
        
        // Fallback to static content if API fails
        const recentContainer = document.getElementById('recentToolsContainer');
        if (recentContainer) {
            recentContainer.innerHTML = `
                <div class="col-md-2 col-4">
                    <div class="card text-center h-100">
                        <div class="card-body p-2">
                            <i class="fas fa-key fa-lg text-info"></i>
                            <h6 class="card-title mt-1 mb-0" style="font-size: 0.8em;">Password Generator</h6>
                        </div>
                    </div>
                </div>
                <div class="col-md-2 col-4">
                    <div class="card text-center h-100">
                        <div class="card-body p-2">
                            <i class="fas fa-calculator fa-lg text-success"></i>
                            <h6 class="card-title mt-1 mb-0" style="font-size: 0.8em;">Unit Converter</h6>
                        </div>
                    </div>
                </div>
                <div class="col-md-2 col-4">
                    <div class="card text-center h-100">
                        <div class="card-body p-2">
                            <i class="fas fa-image fa-lg text-warning"></i>
                            <h6 class="card-title mt-1 mb-0" style="font-size: 0.8em;">Image Resizer</h6>
                        </div>
                    </div>
                </div>
                <div class="col-md-2 col-4">
                    <div class="card text-center h-100">
                        <div class="card-body p-2">
                            <i class="fas fa-code fa-lg text-secondary"></i>
                            <h6 class="card-title mt-1 mb-0" style="font-size: 0.8em;">JSON Formatter</h6>
                        </div>
                    </div>
                </div>
                <div class="col-md-2 col-4">
                    <div class="card text-center h-100">
                        <div class="card-body p-2">
                            <i class="fas fa-dollar-sign fa-lg text-primary"></i>
                            <h6 class="card-title mt-1 mb-0" style="font-size: 0.8em;">Currency Converter</h6>
                        </div>
                    </div>
                </div>
                <div class="col-md-2 col-4">
                    <div class="card text-center h-100">
                        <div class="card-body p-2">
                            <i class="fas fa-link fa-lg text-danger"></i>
                            <h6 class="card-title mt-1 mb-0" style="font-size: 0.8em;">URL Shortener</h6>
                        </div>
                    </div>
                </div>
            `;
        }
    }
}

// Function to record tool usage
async function recordToolUsage(toolId, toolName) {
    try {
        const response = await fetch(`/api/tools/record-usage/${toolId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                ip: getClientIP(),
                userAgent: navigator.userAgent,
                toolName: toolName
            })
        });
        
        if (!response.ok) {
            console.error('Error recording tool usage:', response.statusText);
            throw new Error(response.statusText);
        }
        
        return await response.json();
    } catch (error) {
        console.error('Error recording tool usage:', error);
        throw error;
    }
}

// Helper function to get client IP (this is a simplified version)
function getClientIP() {
    // In a real implementation, this would use a service to get the actual IP
    return 'unknown';
}

// Function to perform search
async function performSearch(event) {
    if (event) {
        event.preventDefault();
    }
    
    const searchInput = document.getElementById('searchInput');
    if (!searchInput) {
        showError('Search input not found');
        return;
    }
    
    const searchTerm = searchInput.value.trim();
    
    if (searchTerm === '') {
        loadHome();
        return;
    }
    
    try {
        showMainLoading();
        
        const response = await fetch(`/api/tools?search=${encodeURIComponent(searchTerm)}`);
        if (!response.ok) {
            throw new Error(`API request failed: ${response.status} ${response.statusText}`);
        }
        const data = await response.json();
        
        // Update the page to show search results
        const titleElement = document.querySelector('h1');
        if (titleElement) {
            titleElement.textContent = `Search Results for "${searchTerm}"`;
        }
        
        displayTools(data.tools);
        
        // Update breadcrumbs to show search
        const breadcrumbs = document.querySelector('.breadcrumb');
        if (breadcrumbs) {
            breadcrumbs.innerHTML = `
                <li class="breadcrumb-item"><a href="/" onclick="loadHome()">Home</a></li>
                <li class="breadcrumb-item active" aria-current="page">Search: ${searchTerm}</li>
            `;
        }
    } catch (error) {
        console.error('Error searching tools:', error);
        showError(`Search failed: ${error.message}`);
    } finally {
        hideMainLoading();
    }
}

// Function to load favorites
async function loadFavorites() {
    try {
        showMainLoading();
        
        // In a real implementation, this would fetch user's favorite tools
        // For now, we'll show a placeholder
        const toolsContainer = document.getElementById('toolsContainer');
        if (toolsContainer) {
            toolsContainer.innerHTML = `
                <div class="col-12">
                    <div class="alert alert-info text-center">
                        <h5><i class="fas fa-star"></i> Favorites</h5>
                        <p>Sign in to view and manage your favorite tools.</p>
                        <button class="btn btn-primary" onclick="showLoginModal()">Sign In</button>
                    </div>
                </div>
            `;
        }
        
        // Update the page title and breadcrumbs if elements exist
        const titleElement = document.querySelector('h1');
        if (titleElement) {
            titleElement.textContent = 'Favorites';
        }
        
        const breadcrumbs = document.querySelector('.breadcrumb');
        if (breadcrumbs) {
            breadcrumbs.innerHTML = `
                <li class="breadcrumb-item"><a href="/" onclick="loadHome()">Home</a></li>
                <li class="breadcrumb-item active" aria-current="page">Favorites</li>
            `;
        }
    } catch (error) {
        console.error('Error loading favorites:', error);
        showError(`Failed to load favorites: ${error.message}`);
    } finally {
        hideMainLoading();
    }
}

// Function to load analytics
function loadAnalytics() {
    // Navigate to analytics page
    window.location.href = '/analytics';
}

// Add dark mode toggle functionality
function initDarkMode() {
    // Check for saved theme preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark');
    }
    
    // Create dark mode toggle button
    const darkModeToggle = document.createElement('button');
    darkModeToggle.className = 'btn btn-outline-light ms-2 theme-toggle';
    darkModeToggle.type = 'button';
    darkModeToggle.title = 'Toggle dark mode';
    
    // Set initial icon based on saved theme
    if (savedTheme === 'dark') {
        darkModeToggle.innerHTML = '<i class="fas fa-sun"></i>';
    } else {
        darkModeToggle.innerHTML = '<i class="fas fa-moon"></i>';
    }
    
    // Add toggle to navbar if it exists
    const formElement = document.querySelector('form.d-flex');
    if (formElement) {
        // Create a wrapper div to contain both the search form and the theme toggle
        const wrapper = document.createElement('div');
        wrapper.className = 'd-flex align-items-center';
        
        // Move the search form into the wrapper
        while(formElement.firstChild) {
            wrapper.appendChild(formElement.firstChild);
        }
        
        // Add the theme toggle to the wrapper
        wrapper.appendChild(darkModeToggle);
        
        // Replace the form with the wrapper
        formElement.parentNode.replaceChild(wrapper, formElement);
    }
    
    // Add event listener to toggle button
    darkModeToggle.addEventListener('click', function() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        if (currentTheme === 'dark') {
            document.documentElement.setAttribute('data-theme', 'light');
            darkModeToggle.innerHTML = '<i class="fas fa-moon"></i>';
            localStorage.setItem('theme', 'light');
        } else {
            document.documentElement.setAttribute('data-theme', 'dark');
            darkModeToggle.innerHTML = '<i class="fas fa-sun"></i>';
            localStorage.setItem('theme', 'dark');
        }
    });
}

// Show login modal function
function showLoginModal() {
    // In a real implementation, this would show the login modal
    alert('Login functionality would be implemented here.');
}

// Initialize dark mode when page loads
document.addEventListener('DOMContentLoaded', function() {
    initDarkMode();
    
    // Add autocomplete functionality to search
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', debounce(async function() {
            const searchTerm = searchInput.value;
            if (searchTerm.length > 2) {
                // In a full implementation, we would fetch suggestions here
            }
        }, 300));
    }
    
    // Add event listener for search form submission
    const searchForm = document.querySelector('form.d-flex');
    if (searchForm) {
        searchForm.addEventListener('submit', function(e) {
            e.preventDefault();
            performSearch(e);
        });
    }
});

// Debounce function to limit API calls
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Expose functions globally so they can be called from HTML
window.loadHome = loadHome;
window.loadCategory = loadCategory;
window.performSearch = performSearch;
window.loadFavorites = loadFavorites;
window.loadAnalytics = loadAnalytics;
window.recordToolUsage = recordToolUsage;
window.handleUseTool = handleUseTool;
window.showLoading = showLoading;
window.hideLoading = hideLoading;
window.showError = showError;
window.showSuccess = showSuccess;