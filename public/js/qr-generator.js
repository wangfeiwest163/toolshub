let currentQR = null;

// Generate QR code
function generateQRCode() {
    const content = document.getElementById('qrContent').value.trim();
    if (!content) {
        showMessage('Please enter content to encode', 'warning');
        return;
    }
    
    const size = document.getElementById('qrSize').value;
    const color = document.getElementById('qrColor').value;
    const bgColor = document.getElementById('qrBgColor').value;
    
    // Determine size based on selection
    let qrSize;
    switch(size) {
        case 'small':
            qrSize = 150;
            break;
        case 'large':
            qrSize = 450;
            break;
        default:
            qrSize = 300;
    }
    
    // Clear previous QR code
    const qrPreview = document.getElementById('qrPreview');
    qrPreview.innerHTML = '';
    
    // Create new QR code
    currentQR = new QRCode(qrPreview, {
        text: content,
        width: qrSize,
        height: qrSize,
        colorDark: color,
        colorLight: bgColor,
        correctLevel: QRCode.CorrectLevel.H
    });
    
    // Enable download button
    document.getElementById('downloadBtn').disabled = false;
    
    showMessage('QR code generated successfully!', 'success');
}

// Download QR code
function downloadQRCode() {
    if (!currentQR) {
        showMessage('Please generate a QR code first', 'warning');
        return;
    }
    
    // Get the image data from the QR code canvas
    const qrImg = document.querySelector('#qrPreview img');
    if (qrImg) {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        canvas.width = qrImg.width;
        canvas.height = qrImg.height;
        
        ctx.fillStyle = document.getElementById('qrBgColor').value;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        ctx.drawImage(qrImg, 0, 0);
        
        // Create download link
        const link = document.createElement('a');
        link.download = 'qrcode.png';
        link.href = canvas.toDataURL('image/png');
        link.click();
        
        showMessage('QR code downloaded successfully!', 'success');
    }
}

// Reset form
function resetForm() {
    document.getElementById('qrContent').value = '';
    document.getElementById('qrSize').value = 'medium';
    document.getElementById('qrColor').value = '#000000';
    document.getElementById('qrBgColor').value = '#ffffff';
    
    const qrPreview = document.getElementById('qrPreview');
    qrPreview.innerHTML = '<p class="text-muted">QR code will appear here</p>';
    
    document.getElementById('downloadBtn').disabled = true;
    
    showMessage('Form reset successfully', 'info');
}

// Favorite button functionality
function toggleFavorite() {
    const icon = document.querySelector('#favoriteBtn i');
    if (icon.classList.contains('far')) {
        icon.classList.remove('far');
        icon.classList.add('fas', 'text-warning');
        document.getElementById('favoriteBtn').innerHTML = '<i class="fas fa-star text-warning"></i> Favorited';
        
        // Show success message
        showMessage('Added to favorites!', 'success');
    } else {
        icon.classList.remove('fas', 'text-warning');
        icon.classList.add('far');
        document.getElementById('favoriteBtn').innerHTML = '<i class="far fa-star"></i> Favorite';
        
        // Show message
        showMessage('Removed from favorites', 'info');
    }
}

// Expose functions globally for navbar search
function performSearch(event) {
    if (event) event.preventDefault();
    const searchTerm = document.getElementById('searchInput').value;
    if (searchTerm) {
        window.location.href = `/tools/all?search=${encodeURIComponent(searchTerm)}`;
    }
}

function loadCategory(category) {
    window.location.href = `/tools/all?category=${encodeURIComponent(category)}`;
}

// Show message function
function showMessage(message, type) {
    // Remove any existing messages
    const existingAlert = document.querySelector('.alert-fixed-top');
    if (existingAlert) {
        existingAlert.remove();
    }
    
    // Create alert element
    const alert = document.createElement('div');
    alert.className = `alert alert-${type} alert-dismissible fade show alert-fixed-top`;
    alert.style.position = 'fixed';
    alert.style.top = '20px';
    alert.style.right = '20px';
    alert.style.zIndex = '9999';
    alert.style.width = '300px';
    alert.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    
    document.body.appendChild(alert);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (alert.parentNode) {
            alert.remove();
        }
    }, 5000);
}

// Initialize event listeners when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Event listeners
    document.getElementById('generateBtn')?.addEventListener('click', generateQRCode);
    document.getElementById('downloadBtn')?.addEventListener('click', downloadQRCode);
    document.getElementById('resetBtn')?.addEventListener('click', resetForm);
    document.getElementById('favoriteBtn')?.addEventListener('click', toggleFavorite);
});