// Common functionality for tool pages
let currentToolId = null;
let currentUser = null;

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    // Get tool ID from URL - different patterns depending on how the page was accessed
    const pathParts = window.location.pathname.split('/');
    if (pathParts[1] === 'tool' && pathParts[2]) {
        // Pattern: /tool/:id
        currentToolId = pathParts[2];
    } else if (pathParts[1] === 'tools' && pathParts[2]) {
        // Pattern: /tools/:tool-name - extract from data attribute in the page
        const toolIdElement = document.querySelector('[data-tool-id]');
        if (toolIdElement) {
            currentToolId = toolIdElement.getAttribute('data-tool-id');
        }
    }
    
    // Generate user ID if not already generated
    if (!sessionStorage.getItem('userId')) {
        const userId = 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
        sessionStorage.setItem('userId', userId);
    }
    
    currentUser = sessionStorage.getItem('userId');
    
    // Load favorite status
    loadToolFavoriteStatus();
    
    // Record tool view
    recordToolView();
});

// Record tool view
async function recordToolView() {
    if (!currentToolId) return;
    
    try {
        await fetch(`/api/tools/record-usage/${currentToolId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                userId: currentUser,
                ip: '127.0.0.1', // In a real implementation, this would come from server
                userAgent: navigator.userAgent,
                eventType: 'view'
            })
        });
    } catch (error) {
        console.error('Error recording tool view:', error);
    }
}

// Load favorite status for this tool
async function loadToolFavoriteStatus() {
    if (!currentUser) return;
    
    try {
        // First, try to get user ID from localStorage/sessionStorage
        const userId = localStorage.getItem('userId') || sessionStorage.getItem('userId');
        if (!userId) return;
        
        const response = await fetch(`/api/users/favorites/${userId}`);
        if (response.ok) {
            const result = await response.json();
            const favorites = result.favorites || [];
            const isFavorite = favorites.some(fav => {
                // Check if fav is an object with toolId property or just a string ID
                if (typeof fav === 'object' && fav._id) {
                    return fav._id === currentToolId;
                } else if (typeof fav === 'string') {
                    return fav === currentToolId;
                } else if (typeof fav === 'object' && fav.toolId) {
                    return fav.toolId._id === currentToolId;
                }
                return false;
            });
            
            const btn = document.getElementById('favoriteBtn');
            if (btn) {
                if (isFavorite) {
                    btn.classList.add('active', 'btn-danger');
                    btn.classList.remove('btn-outline-primary');
                    btn.innerHTML = '<i class="fas fa-heart"></i> Favorited';
                }
            }
        }
    } catch (error) {
        console.error('Error loading favorite status:', error);
    }
}

// Toggle favorite status for this tool
async function toggleToolFavorite() {
    if (!currentToolId) return;
    
    // First, ensure user exists
    let userId = localStorage.getItem('userId') || sessionStorage.getItem('userId');
    if (!userId) {
        // Create a temporary user ID if none exists
        userId = 'temp_user_' + Date.now();
        sessionStorage.setItem('userId', userId);
    }
    
    const btn = document.getElementById('favoriteBtn');
    // Check if the button currently indicates it's a favorite
    const isCurrentlyFavorite = btn && (
        btn.classList.contains('active') || 
        btn.innerHTML.includes('Favorited') ||
        btn.querySelector('i')?.classList.contains('fas')
    );
    
    try {
        if (isCurrentlyFavorite) {
            // Remove from favorites
            const response = await fetch(`/api/users/favorites/${userId}/${currentToolId}`, {
                method: 'DELETE'
            });
            
            if (response.ok) {
                if (btn) {
                    btn.classList.remove('active', 'btn-danger');
                    btn.classList.add('btn-outline-primary');
                    btn.innerHTML = '<i class="far fa-heart"></i> Favorite';
                }
            }
        } else {
            // Add to favorites
            const response = await fetch(`/api/users/favorites/${userId}/${currentToolId}`, {
                method: 'POST'
            });
            
            if (response.ok) {
                if (btn) {
                    btn.classList.add('active', 'btn-danger');
                    btn.classList.remove('btn-outline-primary');
                    btn.innerHTML = '<i class="fas fa-heart"></i> Favorited';
                }
            }
        }
    } catch (error) {
        console.error('Error toggling favorite:', error);
        alert('Failed to update favorites');
    }
}

// Go back to previous page
function goBack() {
    window.history.back();
}

// Perform search from tool page
async function performSearch(event) {
    event.preventDefault();
    const query = document.getElementById('searchInput').value.trim();
    
    if (query) {
        window.location.href = `/search?q=${encodeURIComponent(query)}`;
    }
}

// Utility function to show loading state
function showLoading(elementId) {
    const element = document.getElementById(elementId);
    if (element) {
        element.innerHTML = `
            <div class="d-flex justify-content-center">
                <div class="spinner-border" role="status">
                    <span class="visually-hidden">Loading...</span>
                </div>
            </div>
        `;
    }
}

// Utility function to show error
function showError(elementId, message) {
    const element = document.getElementById(elementId);
    if (element) {
        element.innerHTML = `
            <div class="alert alert-danger" role="alert">
                ${message}
            </div>
        `;
    }
}

// Utility function to show success
function showSuccess(elementId, message) {
    const element = document.getElementById(elementId);
    if (element) {
        element.innerHTML = `
            <div class="alert alert-success" role="alert">
                ${message}
            </div>
        `;
    }
}