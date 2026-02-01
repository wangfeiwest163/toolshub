// Password Generator Tool JavaScript - Enhanced Button Functionality

// Update length display
const lengthSlider = document.getElementById('passwordLength');
const lengthValue = document.getElementById('lengthValue');

if (lengthSlider && lengthValue) {
    lengthSlider.addEventListener('input', function() {
        lengthValue.textContent = this.value;
    });
}

// Generate password function
function generatePassword() {
    const length = document.getElementById('passwordLength').value;
    const includeUppercase = document.getElementById('includeUppercase').checked;
    const includeLowercase = document.getElementById('includeLowercase').checked;
    const includeNumbers = document.getElementById('includeNumbers').checked;
    const includeSymbols = document.getElementById('includeSymbols').checked;
    
    let chars = '';
    if (includeUppercase) chars += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if (includeLowercase) chars += 'abcdefghijklmnopqrstuvwxyz';
    if (includeNumbers) chars += '0123456789';
    if (includeSymbols) chars += '!@#$%^&*()_+-=[]{}|;:,.<>?';
    
    if (chars === '') {
        showError('Please select at least one character type');
        return;
    }
    
    let password = '';
    for (let i = 0; i < length; i++) {
        password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    
    document.getElementById('generatedPassword').value = password;
    showSuccess('Password generated successfully!');
}

// Copy password to clipboard
async function copyPassword() {
    const passwordField = document.getElementById('generatedPassword');
    if (!passwordField.value) {
        showError('Please generate a password first');
        return;
    }
    
    try {
        // Try modern clipboard API first
        await navigator.clipboard.writeText(passwordField.value);
        showSuccess('Password copied to clipboard!');
        
        // Visual feedback on button
        const copyBtn = document.getElementById('copyPassword');
        const originalIcon = copyBtn.innerHTML;
        copyBtn.innerHTML = '<i class="fas fa-check"></i>';
        setTimeout(() => {
            copyBtn.innerHTML = originalIcon;
        }, 2000);
    } catch (err) {
        // Fallback for older browsers
        passwordField.select();
        passwordField.setSelectionRange(0, 99999); // For mobile devices
        
        try {
            document.execCommand('copy');
            showSuccess('Password copied to clipboard!');
            
            // Visual feedback on button
            const copyBtn = document.getElementById('copyPassword');
            const originalIcon = copyBtn.innerHTML;
            copyBtn.innerHTML = '<i class="fas fa-check"></i>';
            setTimeout(() => {
                copyBtn.innerHTML = originalIcon;
            }, 2000);
        } catch (fallbackErr) {
            showError('Failed to copy password. Please try manually.');
        }
    }
}

// Generate secure password with additional complexity
function generateSecurePassword() {
    const length = document.getElementById('passwordLength').value;
    
    // Ensure we have at least one character from each selected type
    let password = '';
    
    // Always include at least one uppercase letter
    if (document.getElementById('includeUppercase').checked) {
        password += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'[Math.floor(Math.random() * 26)];
    }
    
    // Always include at least one lowercase letter
    if (document.getElementById('includeLowercase').checked) {
        password += 'abcdefghijklmnopqrstuvwxyz'[Math.floor(Math.random() * 26)];
    }
    
    // Always include at least one number
    if (document.getElementById('includeNumbers').checked) {
        password += '0123456789'[Math.floor(Math.random() * 10)];
    }
    
    // Always include at least one symbol
    if (document.getElementById('includeSymbols').checked) {
        password += '!@#$%^&*()_+-=[]{}|;:,.<>?'[Math.floor(Math.random() * 22)];
    }
    
    // Fill remaining length with random characters
    let chars = '';
    if (document.getElementById('includeUppercase').checked) chars += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if (document.getElementById('includeLowercase').checked) chars += 'abcdefghijklmnopqrstuvwxyz';
    if (document.getElementById('includeNumbers').checked) chars += '0123456789';
    if (document.getElementById('includeSymbols').checked) chars += '!@#$%^&*()_+-=[]{}|;:,.<>?';
    
    if (chars === '') {
        showError('Please select at least one character type');
        return;
    }
    
    for (let i = password.length; i < length; i++) {
        password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    
    // Shuffle the password to randomize the order
    password = shuffleString(password);
    
    document.getElementById('generatedPassword').value = password;
    showSuccess('Secure password generated successfully!');
}

// Helper function to shuffle a string
function shuffleString(str) {
    const array = str.split('');
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array.join('');
}

// Show error message
function showError(message) {
    // Remove any existing error messages
    const existingError = document.querySelector('#errorContainer .alert');
    if (existingError) {
        existingError.remove();
    }
    
    // Create error message element
    const errorDiv = document.createElement('div');
    errorDiv.className = 'alert alert-danger alert-dismissible fade show';
    errorDiv.setAttribute('role', 'alert');
    errorDiv.innerHTML = `
        <strong>Error:</strong> ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    `;
    
    const errorContainer = document.getElementById('errorContainer');
    if (errorContainer) {
        errorContainer.appendChild(errorDiv);
        errorContainer.classList.remove('d-none');
    }
}

// Show success message
function showSuccess(message) {
    // Remove any existing success messages
    const existingSuccess = document.querySelector('#resultContainer .alert.alert-success');
    if (existingSuccess) {
        existingSuccess.remove();
    }
    
    // Create success message element
    const successDiv = document.createElement('div');
    successDiv.className = 'alert alert-success alert-dismissible fade show mt-3';
    successDiv.setAttribute('role', 'alert');
    successDiv.innerHTML = `
        <strong>Success:</strong> ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    `;
    
    const resultContainer = document.getElementById('resultContainer');
    if (resultContainer) {
        resultContainer.insertBefore(successDiv, resultContainer.firstChild);
    }
}

// Event listeners
document.addEventListener('DOMContentLoaded', function() {
    const generateBtn = document.getElementById('generateBtn');
    const secureGenerateBtn = document.getElementById('secureGenerateBtn');
    const copyPasswordBtn = document.getElementById('copyPassword');
    
    if (generateBtn) {
        generateBtn.addEventListener('click', generatePassword);
    }
    
    if (secureGenerateBtn) {
        secureGenerateBtn.addEventListener('click', generateSecurePassword);
    }
    
    if (copyPasswordBtn) {
        copyPasswordBtn.addEventListener('click', copyPassword);
    }
    
    // Generate initial password
    setTimeout(generatePassword, 500);
});

// Expose functions globally
window.generatePassword = generatePassword;
window.copyPassword = copyPassword;
window.generateSecurePassword = generateSecurePassword;
window.showError = showError;
window.showSuccess = showSuccess;