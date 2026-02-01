// Unit Converter Tool JavaScript - Enhanced Button Functionality

// Conversion factors
const conversionFactors = {
    // Length units
    'mm': 0.001,
    'cm': 0.01,
    'm': 1,
    'km': 1000,
    'in': 0.0254,
    'ft': 0.3048,
    'yd': 0.9144,
    'mi': 1609.344,
    
    // Weight units
    'mg': 0.000001,
    'g': 0.001,
    'kg': 1,
    't': 1000,
    'oz': 0.0283495,
    'lb': 0.453592,
    
    // Volume units
    'ml': 0.001,
    'l': 1,
    'gal': 3.78541,
    'qt': 0.946353,
    'pt': 0.473176,
    'cup': 0.24,
    
    // Temperature units (special handling needed)
    'celsius': 'celsius',
    'fahrenheit': 'fahrenheit',
    'kelvin': 'kelvin'
};

// Categories and their units
const unitCategories = {
    'length': {
        'mm': 'Millimeters',
        'cm': 'Centimeters',
        'm': 'Meters',
        'km': 'Kilometers',
        'in': 'Inches',
        'ft': 'Feet',
        'yd': 'Yards',
        'mi': 'Miles'
    },
    'weight': {
        'mg': 'Milligrams',
        'g': 'Grams',
        'kg': 'Kilograms',
        't': 'Metric Tons',
        'oz': 'Ounces',
        'lb': 'Pounds'
    },
    'volume': {
        'ml': 'Milliliters',
        'l': 'Liters',
        'gal': 'Gallons',
        'qt': 'Quarts',
        'pt': 'Pints',
        'cup': 'Cups'
    },
    'temperature': {
        'celsius': 'Celsius',
        'fahrenheit': 'Fahrenheit',
        'kelvin': 'Kelvin'
    }
};

// Update unit options based on selected category
function updateUnitOptions() {
    const category = document.getElementById('unitCategory').value;
    const fromUnitSelect = document.getElementById('fromUnit');
    const toUnitSelect = document.getElementById('toUnit');
    
    // Clear existing options
    fromUnitSelect.innerHTML = '';
    toUnitSelect.innerHTML = '';
    
    // Add new options based on category
    const units = unitCategories[category];
    for (const unit in units) {
        const optionFrom = document.createElement('option');
        optionFrom.value = unit;
        optionFrom.textContent = units[unit];
        fromUnitSelect.appendChild(optionFrom);
        
        const optionTo = document.createElement('option');
        optionTo.value = unit;
        optionTo.textContent = units[unit];
        toUnitSelect.appendChild(optionTo);
    }
    
    // Set default selections
    fromUnitSelect.value = Object.keys(units)[0];
    toUnitSelect.value = Object.keys(units)[1] || Object.keys(units)[0];
}

// Convert units
function convertUnits() {
    const inputValue = parseFloat(document.getElementById('inputValue').value);
    const fromUnit = document.getElementById('fromUnit').value;
    const toUnit = document.getElementById('toUnit').value;
    const category = document.getElementById('unitCategory').value;
    
    if (isNaN(inputValue)) {
        showError('Please enter a valid number');
        return;
    }
    
    let result;
    
    if (category === 'temperature') {
        // Special handling for temperature conversions
        result = convertTemperature(inputValue, fromUnit, toUnit);
    } else {
        // Standard unit conversions
        // Convert to base unit first
        const baseValue = inputValue * conversionFactors[fromUnit];
        // Convert from base unit to target unit
        result = baseValue / conversionFactors[toUnit];
    }
    
    // Format result to appropriate decimal places
    let formattedResult;
    if (Math.abs(result) < 0.01 || Math.abs(result) > 1000000) {
        formattedResult = result.toExponential(6);
    } else {
        formattedResult = parseFloat(result.toFixed(6)).toString();
    }
    
    document.getElementById('resultValue').value = formattedResult;
    showSuccess('Conversion completed successfully!');
}

// Temperature conversion helper
function convertTemperature(value, fromUnit, toUnit) {
    // Convert to Celsius first
    let celsius;
    switch(fromUnit) {
        case 'celsius':
            celsius = value;
            break;
        case 'fahrenheit':
            celsius = (value - 32) * 5/9;
            break;
        case 'kelvin':
            celsius = value - 273.15;
            break;
        default:
            return NaN;
    }
    
    // Convert from Celsius to target unit
    switch(toUnit) {
        case 'celsius':
            return celsius;
        case 'fahrenheit':
            return (celsius * 9/5) + 32;
        case 'kelvin':
            return celsius + 273.15;
        default:
            return NaN;
    }
}

// Swap units
function swapUnits() {
    const fromUnitSelect = document.getElementById('fromUnit');
    const toUnitSelect = document.getElementById('toUnit');
    
    const tempValue = fromUnitSelect.value;
    fromUnitSelect.value = toUnitSelect.value;
    toUnitSelect.value = tempValue;
    
    // Also swap the values in the input fields
    const inputValue = document.getElementById('inputValue').value;
    const resultValue = document.getElementById('resultValue').value;
    
    document.getElementById('inputValue').value = resultValue;
    document.getElementById('resultValue').value = inputValue;
    
    showSuccess('Units swapped successfully!');
}

// Copy result to clipboard
async function copyResult() {
    const resultField = document.getElementById('resultValue');
    if (!resultField.value) {
        showError('No result to copy');
        return;
    }
    
    try {
        // Try modern clipboard API first
        await navigator.clipboard.writeText(resultField.value);
        showSuccess('Result copied to clipboard!');
        
        // Visual feedback on button
        const copyBtn = document.getElementById('copyResult');
        const originalIcon = copyBtn.innerHTML;
        copyBtn.innerHTML = '<i class="fas fa-check"></i>';
        setTimeout(() => {
            copyBtn.innerHTML = originalIcon;
        }, 2000);
    } catch (err) {
        // Fallback for older browsers
        resultField.select();
        resultField.setSelectionRange(0, 99999); // For mobile devices
        
        try {
            document.execCommand('copy');
            showSuccess('Result copied to clipboard!');
            
            // Visual feedback on button
            const copyBtn = document.getElementById('copyResult');
            const originalIcon = copyBtn.innerHTML;
            copyBtn.innerHTML = '<i class="fas fa-check"></i>';
            setTimeout(() => {
                copyBtn.innerHTML = originalIcon;
            }, 2000);
        } catch (fallbackErr) {
            showError('Failed to copy result. Please try manually.');
        }
    }
}

// Reset form
function resetConverter() {
    document.getElementById('inputValue').value = '';
    document.getElementById('resultValue').value = '';
    document.getElementById('unitCategory').value = 'length';
    updateUnitOptions();
    showSuccess('Converter reset successfully!');
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
    // Initialize unit options
    updateUnitOptions();
    
    // Add event listeners
    const unitCategory = document.getElementById('unitCategory');
    if (unitCategory) {
        unitCategory.addEventListener('change', updateUnitOptions);
    }
    
    const convertBtn = document.getElementById('convertBtn');
    if (convertBtn) {
        convertBtn.addEventListener('click', convertUnits);
    }
    
    const swapBtn = document.getElementById('swapUnits');
    if (swapBtn) {
        swapBtn.addEventListener('click', swapUnits);
    }
    
    const copyBtn = document.getElementById('copyResult');
    if (copyBtn) {
        copyBtn.addEventListener('click', copyResult);
    }
    
    const resetBtn = document.getElementById('resetConverter');
    if (resetBtn) {
        resetBtn.addEventListener('click', resetConverter);
    }
    
    // Add input event listener to automatically convert when user types
    const inputValue = document.getElementById('inputValue');
    if (inputValue) {
        inputValue.addEventListener('input', function() {
            if (this.value !== '') {
                convertUnits();
            }
        });
    }
    
    // Add keypress listener to convert on Enter
    if (inputValue) {
        inputValue.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                convertUnits();
            }
        });
    }
});

// Expose functions globally
window.convertUnits = convertUnits;
window.swapUnits = swapUnits;
window.copyResult = copyResult;
window.resetConverter = resetConverter;
window.updateUnitOptions = updateUnitOptions;
window.showError = showError;
window.showSuccess = showSuccess;