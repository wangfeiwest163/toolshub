// Tool Utilities and Common Functions

/**
 * Show loading indicator
 * @param {boolean} show - Whether to show or hide the loading indicator
 */
function showLoading(show) {
    const loader = document.getElementById('loadingIndicator');
    if (loader) {
        loader.style.display = show ? 'flex' : 'none';
    }
}

/**
 * Show error message
 * @param {string} message - Error message to display
 */
function showError(message) {
    const errorDiv = document.getElementById('errorMessage');
    const errorText = document.getElementById('errorText');
    
    if (errorDiv && errorText) {
        errorText.textContent = message;
        errorDiv.style.display = 'flex';
        
        // Auto-hide after 5 seconds
        setTimeout(() => {
            errorDiv.style.display = 'none';
        }, 5000);
    }
}

/**
 * Show success message
 * @param {string} message - Success message to display
 */
function showSuccess(message) {
    // Create a temporary success element if one doesn't exist
    let successEl = document.getElementById('successMessage');
    if (!successEl) {
        successEl = document.createElement('div');
        successEl.id = 'successMessage';
        successEl.className = 'success-message';
        successEl.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #d4edda;
            color: #155724;
            padding: 15px 20px;
            border: 1px solid #c3e6cb;
            border-radius: 6px;
            z-index: 10000;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        `;
        document.body.appendChild(successEl);
    }
    
    successEl.textContent = message;
    successEl.style.display = 'block';
    
    // Auto-hide after 3 seconds
    setTimeout(() => {
        successEl.style.display = 'none';
    }, 3000);
}

/**
 * Get client IP address (this is a fallback method, real IP should come from server)
 */
function getClientIP() {
    // In a real implementation, the IP would be obtained server-side
    // This is just a placeholder
    return '127.0.0.1';
}

/**
 * Track tool usage analytics
 * @param {string} toolId - ID of the tool
 * @param {string} action - Action performed ('view', 'use', 'favorite', 'search')
 */
async function trackToolUsage(toolId, action) {
    try {
        const response = await fetch('/api/analytics/track', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                toolId: toolId,
                action: action,
                ip: getClientIP(),
                userAgent: navigator.userAgent
            })
        });
        
        if (!response.ok) {
            console.warn('Analytics tracking request failed:', response.status);
        }
    } catch (error) {
        console.warn('Analytics tracking failed:', error.message);
    }
}

/**
 * Toggle favorite status for a tool
 * @param {string} userId - Current user ID
 * @param {string} toolId - Tool ID to favorite/unfavorite
 */
async function toggleFavorite(userId, toolId) {
    if (!userId) {
        alert('Please log in to add tools to favorites.');
        return;
    }
    
    try {
        const favoriteBtn = document.getElementById('favoriteBtn');
        if (!favoriteBtn) return;
        
        const isFavorited = favoriteBtn.classList.contains('favorited');
        const action = isFavorited ? 'DELETE' : 'POST';
        
        const response = await fetch(`/api/users/favorites/${userId}/${toolId}`, {
            method: action,
            headers: {
                'Content-Type': 'application/json'
            }
        });
        
        if (response.ok) {
            const data = await response.json();
            favoriteBtn.classList.toggle('favorited');
            
            if (isFavorited) {
                favoriteBtn.innerHTML = '<i class="far fa-star"></i>';
                showSuccess('Removed from favorites');
            } else {
                favoriteBtn.innerHTML = '<i class="fas fa-star"></i>';
                showSuccess('Added to favorites');
                
                // Track favorite action
                trackToolUsage(toolId, 'favorite');
            }
        } else {
            const error = await response.json();
            showError(error.message || 'Failed to update favorites');
        }
    } catch (error) {
        console.error('Favorite toggle failed:', error);
        showError('Network error. Please try again.');
    }
}

/**
 * Debounce function to limit frequency of function calls
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @returns {Function} - Debounced function
 */
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

/**
 * Format numbers with commas for better readability
 * @param {number} num - Number to format
 * @returns {string} - Formatted number string
 */
function formatNumber(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

/**
 * Copy text to clipboard
 * @param {string} text - Text to copy
 * @returns {Promise<boolean>} - Promise that resolves to true if successful
 */
async function copyToClipboard(text) {
    try {
        if (navigator.clipboard && window.isSecureContext) {
            await navigator.clipboard.writeText(text);
            return true;
        } else {
            // Fallback for older browsers
            const textArea = document.createElement("textarea");
            textArea.value = text;
            textArea.style.position = "fixed";
            textArea.style.left = "-999999px";
            textArea.style.top = "-999999px";
            document.body.appendChild(textArea);
            textArea.focus();
            textArea.select();
            document.execCommand('copy');
            textArea.remove();
            return true;
        }
    } catch (err) {
        console.error('Failed to copy text: ', err);
        return false;
    }
}

/**
 * Validate email format
 * @param {string} email - Email to validate
 * @returns {boolean} - True if valid email format
 */
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

/**
 * Validate URL format
 * @param {string} url - URL to validate
 * @returns {boolean} - True if valid URL format
 */
function isValidURL(url) {
    try {
        new URL(url);
        return true;
    } catch (err) {
        return false;
    }
}

/**
 * Show modal dialog
 * @param {string} title - Modal title
 * @param {string} content - Modal content
 * @param {Array} buttons - Array of button objects {text, action, className}
 */
function showModal(title, content, buttons = []) {
    // Remove existing modal if present
    const existingModal = document.getElementById('tool-modal');
    if (existingModal) {
        existingModal.remove();
    }
    
    // Create modal backdrop
    const backdrop = document.createElement('div');
    backdrop.id = 'modal-backdrop';
    backdrop.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
        z-index: 10000;
        display: flex;
        align-items: center;
        justify-content: center;
    `;
    
    // Create modal
    const modal = document.createElement('div');
    modal.id = 'tool-modal';
    modal.style.cssText = `
        background: white;
        border-radius: 8px;
        padding: 20px;
        max-width: 500px;
        width: 90%;
        max-height: 80vh;
        overflow-y: auto;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
    `;
    
    // Modal header
    const header = document.createElement('div');
    header.style.cssText = `
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 15px;
        padding-bottom: 10px;
        border-bottom: 1px solid #eee;
    `;
    
    const titleEl = document.createElement('h3');
    titleEl.textContent = title;
    titleEl.style.margin = '0';
    
    const closeBtn = document.createElement('button');
    closeBtn.innerHTML = '&times;';
    closeBtn.style.cssText = `
        background: none;
        border: none;
        font-size: 24px;
        cursor: pointer;
        padding: 0;
        width: 30px;
        height: 30px;
        display: flex;
        align-items: center;
        justify-content: center;
    `;
    
    closeBtn.onclick = () => {
        document.body.removeChild(backdrop);
    };
    
    header.appendChild(titleEl);
    header.appendChild(closeBtn);
    
    // Modal content
    const contentEl = document.createElement('div');
    contentEl.innerHTML = content;
    contentEl.style.marginBottom = '20px';
    
    // Modal footer
    const footer = document.createElement('div');
    footer.style.cssText = `
        display: flex;
        gap: 10px;
        justify-content: flex-end;
    `;
    
    if (buttons.length > 0) {
        buttons.forEach(button => {
            const btn = document.createElement('button');
            btn.textContent = button.text;
            btn.className = button.className || 'btn btn-primary';
            btn.onclick = button.action || (() => {});
            footer.appendChild(btn);
        });
    } else {
        const okBtn = document.createElement('button');
        okBtn.textContent = 'OK';
        okBtn.className = 'btn btn-primary';
        okBtn.onclick = () => {
            document.body.removeChild(backdrop);
        };
        footer.appendChild(okBtn);
    }
    
    modal.appendChild(header);
    modal.appendChild(contentEl);
    modal.appendChild(footer);
    backdrop.appendChild(modal);
    document.body.appendChild(backdrop);
    
    return backdrop;
}

/**
 * Hide modal dialog
 */
function hideModal() {
    const backdrop = document.getElementById('modal-backdrop');
    if (backdrop) {
        backdrop.remove();
    }
}

/**
 * Load saved user preferences
 * @returns {Object} - User preferences object
 */
function loadUserPreferences() {
    try {
        const prefs = localStorage.getItem('toolhub_preferences');
        return prefs ? JSON.parse(prefs) : {};
    } catch (error) {
        console.error('Error loading preferences:', error);
        return {};
    }
}

/**
 * Save user preferences
 * @param {Object} preferences - Preferences object to save
 */
function saveUserPreferences(preferences) {
    try {
        localStorage.setItem('toolhub_preferences', JSON.stringify(preferences));
    } catch (error) {
        console.error('Error saving preferences:', error);
    }
}

// Export functions for use in modules (if supported)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        showLoading,
        showError,
        showSuccess,
        getClientIP,
        trackToolUsage,
        toggleFavorite,
        debounce,
        formatNumber,
        copyToClipboard,
        isValidEmail,
        isValidURL,
        showModal,
        hideModal,
        loadUserPreferences,
        saveUserPreferences
    };
}