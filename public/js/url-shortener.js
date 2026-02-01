// URL Shortener Tool Implementation

class UrlShortener {
    constructor() {
        this.initializeElements();
        this.bindEvents();
    }

    initializeElements() {
        this.longUrlInput = document.getElementById('longUrl');
        this.shortenBtn = document.getElementById('shortenBtn');
        this.shortUrlInput = document.getElementById('shortUrl');
        this.resultContainer = document.getElementById('resultContainer');
        this.errorContainer = document.getElementById('errorContainer');
        this.copyUrlBtn = document.getElementById('copyUrl');
        this.previewLink = document.getElementById('previewLink');
        this.statsLink = document.getElementById('statsLink');
    }

    bindEvents() {
        this.shortenBtn.addEventListener('click', () => this.shortenUrl());
        this.copyUrlBtn.addEventListener('click', () => this.copyUrl());
    }

    async shortenUrl() {
        const longUrl = this.longUrlInput.value.trim();

        // Validate URL
        if (!this.isValidUrl(longUrl)) {
            this.showError('Please enter a valid URL (e.g., https://www.example.com)');
            return;
        }

        try {
            this.setLoading(true);
            this.clearError();

            // Call API to shorten URL
            const response = await fetch('/api/urls/shorten', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    longUrl: longUrl
                })
            });

            const data = await response.json();

            if (response.ok) {
                this.displayResult(data.shortCode, data.longUrl);
                this.showSuccess(`URL shortened successfully!`);
            } else {
                this.showError(data.error || 'Failed to shorten URL');
            }
        } catch (error) {
            console.error('Error shortening URL:', error);
            this.showError('An error occurred while shortening the URL. Please try again.');
        } finally {
            this.setLoading(false);
        }
    }

    isValidUrl(string) {
        try {
            const url = new URL(string);
            return ['http:', 'https:'].includes(url.protocol);
        } catch (_) {
            return false;
        }
    }

    displayResult(shortCode, originalUrl) {
        const shortUrl = `${window.location.origin}/s/${shortCode}`;
        this.shortUrlInput.value = shortUrl;

        // Update preview and stats links
        this.previewLink.href = shortUrl;
        this.statsLink.href = `${window.location.origin}/stats/${shortCode}`;

        this.resultContainer.style.display = 'block';
    }

    async copyUrl() {
        if (!this.shortUrlInput.value) return;

        try {
            await navigator.clipboard.writeText(this.shortUrlInput.value);
            this.showSuccess('URL copied to clipboard!');
        } catch (err) {
            // Fallback for older browsers
            this.shortUrlInput.select();
            document.execCommand('copy');
            this.showSuccess('URL copied to clipboard!');
        }
    }

    setLoading(loading) {
        if (loading) {
            this.shortenBtn.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Shortening...';
            this.shortenBtn.disabled = true;
        } else {
            this.shortenBtn.innerHTML = '<i class="fas fa-compress-alt"></i> Shorten URL';
            this.shortenBtn.disabled = false;
        }
    }

    showError(message) {
        this.errorContainer.innerHTML = `
            <div class="alert alert-danger alert-dismissible fade show" role="alert">
                <i class="fas fa-exclamation-triangle me-2"></i> ${message}
                <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
            </div>
        `;
    }

    clearError() {
        this.errorContainer.innerHTML = '';
    }

    showSuccess(message) {
        // Remove any existing alerts
        const existingAlert = document.querySelector('.global-alert');
        if (existingAlert) existingAlert.remove();

        // Create success alert
        const alertDiv = document.createElement('div');
        alertDiv.className = 'alert alert-success alert-dismissible fade show global-alert';
        alertDiv.style.position = 'fixed';
        alertDiv.style.top = '20px';
        alertDiv.style.right = '20px';
        alertDiv.style.zIndex = '9999';
        alertDiv.innerHTML = `
            <i class="fas fa-check-circle me-2"></i> ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        `;

        document.body.appendChild(alertDiv);

        // Auto-remove after 5 seconds
        setTimeout(() => {
            if (alertDiv.parentNode) {
                alertDiv.remove();
            }
        }, 5000);
    }
}

// Initialize URL shortener when page loads
document.addEventListener('DOMContentLoaded', function() {
    // Check if we're on the URL shortener page
    if (document.querySelector('[data-tool-id="5"]') || 
        window.location.pathname.includes('url-shortener')) {
        new UrlShortener();
    }
});