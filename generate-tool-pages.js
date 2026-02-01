const fs = require('fs');
const path = require('path');

// Define all 48 tools with their categories
const tools = [
  // Utility Tools
  { name: "Password Generator", category: "Utility Tools", id: "password-generator" },
  { name: "QR Code Generator", category: "Utility Tools", id: "qr-generator" },
  { name: "File Converter", category: "Utility Tools", id: "file-converter" },
  { name: "Unit Converter", category: "Utility Tools", id: "unit-converter" },
  { name: "URL Shortener", category: "Utility Tools", id: "url-shortener" },
  { name: "Text Editor", category: "Utility Tools", id: "text-editor" },
  { name: "Note Taking App", category: "Utility Tools", id: "notes" },
  { name: "Timer & Stopwatch", category: "Utility Tools", id: "timer" },

  // Online Calculators
  { name: "Scientific Calculator", category: "Online Calculators", id: "scientific-calculator" },
  { name: "Financial Calculator", category: "Online Calculators", id: "financial-calculator" },
  { name: "BMI Calculator", category: "Online Calculators", id: "bmi-calculator" },
  { name: "Age Calculator", category: "Online Calculators", id: "age-calculator" },
  { name: "Mortgage Calculator", category: "Online Calculators", id: "mortgage-calculator" },
  { name: "Tax Calculator", category: "Online Calculators", id: "tax-calculator" },
  { name: "Tip Calculator", category: "Online Calculators", id: "tip-calculator" },
  { name: "Fuel Cost Calculator", category: "Online Calculators", id: "fuel-cost-calculator" },

  // Text Tools
  { name: "Text Formatter", category: "Text Tools", id: "text-formatter" },
  { name: "Case Converter", category: "Text Tools", id: "case-converter" },
  { name: "Character Counter", category: "Text Tools", id: "character-counter" },
  { name: "Spell Checker", category: "Text Tools", id: "spell-checker" },
  { name: "Text to Speech", category: "Text Tools", id: "text-to-speech" },
  { name: "Plagiarism Checker", category: "Text Tools", id: "plagiarism-checker" },
  { name: "Word Counter", category: "Text Tools", id: "word-counter" },
  { name: "Text Reverser", category: "Text Tools", id: "text-reverser" },

  // Image Tools
  { name: "Image Compressor", category: "Image Tools", id: "image-compressor" },
  { name: "Image Resizer", category: "Image Tools", id: "image-resizer" },
  { name: "Watermark Tool", category: "Image Tools", id: "watermark-tool" },
  { name: "Color Picker", category: "Image Tools", id: "color-picker" },
  { name: "Image Cropper", category: "Image Tools", id: "image-cropper" },
  { name: "Image Format Converter", category: "Image Tools", id: "image-format-converter" },
  { name: "Image Brightness Adjuster", category: "Image Tools", id: "image-adjuster" },
  { name: "Screenshot Tool", category: "Image Tools", id: "screenshot-tool" },

  // Developer Tools
  { name: "JSON Formatter", category: "Developer Tools", id: "json-formatter" },
  { name: "Regex Tester", category: "Developer Tools", id: "regex-tester" },
  { name: "Code Minifier", category: "Developer Tools", id: "code-minifier" },
  { name: "API Testing Tool", category: "Developer Tools", id: "api-testing" },
  { name: "Base64 Encoder/Decoder", category: "Developer Tools", id: "base64" },
  { name: "HTML Entity Encoder/Decoder", category: "Developer Tools", id: "html-entities" },
  { name: "Timestamp Converter", category: "Developer Tools", id: "timestamp-converter" },
  { name: "Hash Generator", category: "Developer Tools", id: "hash-generator" },

  // Converter Tools
  { name: "Currency Converter", category: "Converter Tools", id: "currency-converter" },
  { name: "Time Zone Converter", category: "Converter Tools", id: "timezone-converter" },
  { name: "Temperature Converter", category: "Converter Tools", id: "temperature-converter" },
  { name: "Binary Converter", category: "Converter Tools", id: "binary-converter" },
  { name: "Data Size Converter", category: "Converter Tools", id: "data-size-converter" },
  { name: "Speed Converter", category: "Converter Tools", id: "speed-converter" },
  { name: "Area Converter", category: "Converter Tools", id: "area-converter" },
  { name: "Volume Converter", category: "Converter Tools", id: "volume-converter" }
];

// Template for tool pages
const toolTemplate = (toolName, category, toolId) => `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${toolName} - ToolsHub</title>
    <link rel="stylesheet" href="/css/style.css">
    <link rel="stylesheet" href="/css/tool-page.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
</head>
<body>
    <div class="container">
        <!-- Header -->
        <header class="tool-header">
            <div class="header-content">
                <div class="tool-info">
                    <div class="tool-icon">
                        <i class="fas fa-${getIconClass(toolId)}"></i>
                    </div>
                    <div class="tool-details">
                        <h1>${toolName}</h1>
                        <span class="tool-category">${category}</span>
                    </div>
                </div>
                <button class="favorite-btn" id="favoriteBtn" title="Add to favorites">
                    <i class="far fa-star"></i>
                </button>
            </div>
        </header>

        <!-- Loading indicator -->
        <div id="loadingIndicator" class="loading-indicator" style="display: none;">
            <div class="spinner"></div>
            <p>Loading ${toolName}...</p>
        </div>

        <!-- Error message -->
        <div id="errorMessage" class="error-message" style="display: none;">
            <i class="fas fa-exclamation-triangle"></i>
            <p id="errorText">An error occurred while loading the tool.</p>
        </div>

        <!-- Tool Content -->
        <main class="tool-content">
            <div class="tool-description">
                <p>This is the ${toolName} tool. It provides functionality for ${getDescription(toolName)}.</p>
            </div>

            <!-- Tool Interface -->
            <div class="tool-interface">
                <div class="tool-controls">
                    <!-- Add tool-specific controls here -->
                    <div id="${toolId}Container">
                        <p>This is where the ${toolName} interface would go. The actual functionality would be implemented here.</p>
                        <p>For demonstration purposes, this is a placeholder page.</p>
                        
                        ${getToolSpecificContent(toolId)}
                    </div>
                </div>

                <div class="tool-actions">
                    <button class="btn btn-primary" id="processBtn">Process</button>
                    <button class="btn btn-secondary" id="resetBtn">Reset</button>
                    <button class="btn btn-outline" id="saveBtn">Save Result</button>
                </div>
            </div>

            <!-- Results Section -->
            <div class="results-section">
                <h3>Results</h3>
                <div id="resultsOutput" class="results-output">
                    <p>Your results will appear here after processing.</p>
                </div>
            </div>
        </main>

        <!-- Usage Tips -->
        <section class="usage-tips">
            <h3>How to use ${toolName}</h3>
            <ul>
                <li>Enter your input in the designated fields</li>
                <li>Click "Process" to get your results</li>
                <li>Use "Reset" to clear all fields</li>
                <li>Save your results with the "Save Result" button</li>
            </ul>
        </section>
    </div>

    <!-- Footer -->
    <footer class="tool-footer">
        <p>&copy; 2025 ToolsHub. All rights reserved.</p>
    </footer>

    <!-- Scripts -->
    <script src="/socket.io/socket.io.js"></script>
    <script src="/js/tool-utils.js"></script>
    <script>
        document.addEventListener('DOMContentLoaded', function() {
            // Initialize the tool
            initTool('${toolName}', '${toolId}');
            
            // Set up event listeners
            document.getElementById('processBtn').addEventListener('click', processTool);
            document.getElementById('resetBtn').addEventListener('click', resetTool);
            document.getElementById('saveBtn').addEventListener('click', saveResult);
            document.getElementById('favoriteBtn').addEventListener('click', toggleFavorite);
            
            // Track tool usage
            trackToolUsage('${toolId}', 'view');
        });

        // Tool-specific functions
        function initTool(toolName, toolId) {
            showLoading(false);
            console.log(\`Initializing \${toolName}\`);
        }

        function processTool() {
            showLoading(true);
            
            // Simulate processing delay
            setTimeout(() => {
                showLoading(false);
                
                // Get input values and process
                const result = simulateProcessing();
                displayResult(result);
                
                // Track tool usage
                trackToolUsage('${toolId}', 'use');
            }, 1500);
        }

        function simulateProcessing() {
            // Simulate processing based on tool type
            return {
                success: true,
                message: "Operation completed successfully!",
                data: "Sample result data would go here"
            };
        }

        function displayResult(result) {
            const outputDiv = document.getElementById('resultsOutput');
            if (result.success) {
                outputDiv.innerHTML = '<div class="success-message">' + result.message + '</div>';
                if (result.data) {
                    outputDiv.innerHTML += '<div class="result-data">' + result.data + '</div>';
                }
            } else {
                outputDiv.innerHTML = '<div class="error-message">' + result.message + '</div>';
            }
        }

        function resetTool() {
            // Reset form fields
            const container = document.getElementById('${toolId}Container');
            const inputs = container.querySelectorAll('input, textarea, select');
            inputs.forEach(input => {
                if (input.type === 'checkbox' || input.type === 'radio') {
                    input.checked = false;
                } else {
                    input.value = '';
                }
            });
            
            // Clear results
            document.getElementById('resultsOutput').innerHTML = '<p>Your results will appear here after processing.</p>';
        }

        function saveResult() {
            alert('Result saved successfully!');
        }

        function toggleFavorite() {
            const btn = document.getElementById('favoriteBtn');
            btn.classList.toggle('favorited');
            
            if (btn.classList.contains('favorited')) {
                btn.innerHTML = '<i class="fas fa-star"></i>';
                alert('${toolName} added to favorites!');
                
                // Track favorite action
                trackToolUsage('${toolId}', 'favorite');
            } else {
                btn.innerHTML = '<i class="far fa-star"></i>';
                alert('${toolName} removed from favorites!');
            }
        }

        function showLoading(show) {
            const loader = document.getElementById('loadingIndicator');
            loader.style.display = show ? 'flex' : 'none';
        }

        function showError(message) {
            const errorDiv = document.getElementById('errorMessage');
            const errorText = document.getElementById('errorText');
            errorText.textContent = message;
            errorDiv.style.display = 'block';
            
            setTimeout(() => {
                errorDiv.style.display = 'none';
            }, 5000);
        }

        function trackToolUsage(toolId, action) {
            // Send analytics data
            fetch('/api/analytics/track', {
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
            })
            .catch(error => console.error('Analytics tracking failed:', error));
        }

        function getClientIP() {
            // In a real implementation, this would get the actual client IP
            return '127.0.0.1';
        }
    </script>
</body>
</html>
`;

// Helper functions for generating content
function getIconClass(toolId) {
    const iconMap = {
        'password-generator': 'key',
        'qr-generator': 'qrcode',
        'file-converter': 'file-export',
        'unit-converter': 'exchange-alt',
        'url-shortener': 'link',
        'text-editor': 'edit',
        'notes': 'sticky-note',
        'timer': 'stopwatch',
        'scientific-calculator': 'calculator',
        'financial-calculator': 'money-bill-wave',
        'bmi-calculator': 'weight',
        'age-calculator': 'birthday-cake',
        'mortgage-calculator': 'home',
        'tax-calculator': 'balance-scale',
        'tip-calculator': 'hand-holding-usd',
        'fuel-cost-calculator': 'gas-pump',
        'text-formatter': 'font',
        'case-converter': 'text-height',
        'character-counter': 'paragraph',
        'spell-checker': 'spell-check',
        'text-to-speech': 'volume-up',
        'plagiarism-checker': 'search',
        'word-counter': 'font',
        'text-reverser': 'undo',
        'image-compressor': 'compress',
        'image-resizer': 'expand',
        'watermark-tool': 'stamp',
        'color-picker': 'palette',
        'image-cropper': 'crop',
        'image-format-converter': 'sync',
        'image-adjuster': 'sun',
        'screenshot-tool': 'camera',
        'json-formatter': 'code',
        'regex-tester': 'search',
        'code-minifier': 'cut',
        'api-testing': 'plug',
        'base64': 'lock',
        'html-entities': 'code',
        'timestamp-converter': 'clock',
        'hash-generator': 'hashtag',
        'currency-converter': 'dollar-sign',
        'timezone-converter': 'clock',
        'temperature-converter': 'thermometer-half',
        'binary-converter': 'binary',
        'data-size-converter': 'database',
        'speed-converter': 'tachometer-alt',
        'area-converter': 'draw-polygon',
        'volume-converter': 'fill-drip'
    };
    
    return iconMap[toolId] || 'tool';
}

function getDescription(toolName) {
    const descriptions = {
        'Password Generator': 'generating secure passwords',
        'QR Code Generator': 'creating QR codes',
        'File Converter': 'converting files between formats',
        'Unit Converter': 'converting measurements',
        'URL Shortener': 'shortening URLs',
        'Text Editor': 'editing text',
        'Note Taking App': 'taking notes',
        'Timer & Stopwatch': 'timing activities',
        'Scientific Calculator': 'performing advanced calculations',
        'Financial Calculator': 'calculating finances',
        'BMI Calculator': 'calculating BMI',
        'Age Calculator': 'calculating ages',
        'Mortgage Calculator': 'calculating mortgages',
        'Tax Calculator': 'calculating taxes',
        'Tip Calculator': 'calculating tips',
        'Fuel Cost Calculator': 'calculating fuel costs',
        'Text Formatter': 'formatting text',
        'Case Converter': 'changing text case',
        'Character Counter': 'counting characters',
        'Spell Checker': 'checking spelling',
        'Text to Speech': 'converting text to speech',
        'Plagiarism Checker': 'checking for plagiarism',
        'Word Counter': 'counting words',
        'Text Reverser': 'reversing text',
        'Image Compressor': 'compressing images',
        'Image Resizer': 'resizing images',
        'Watermark Tool': 'adding watermarks',
        'Color Picker': 'picking colors',
        'Image Cropper': 'cropping images',
        'Image Format Converter': 'converting image formats',
        'Image Brightness Adjuster': 'adjusting image brightness',
        'Screenshot Tool': 'taking screenshots',
        'JSON Formatter': 'formatting JSON',
        'Regex Tester': 'testing regex patterns',
        'Code Minifier': 'minifying code',
        'API Testing Tool': 'testing APIs',
        'Base64 Encoder/Decoder': 'encoding/decoding Base64',
        'HTML Entity Encoder/Decoder': 'encoding/decoding HTML entities',
        'Timestamp Converter': 'converting timestamps',
        'Hash Generator': 'generating hashes',
        'Currency Converter': 'converting currencies',
        'Time Zone Converter': 'converting time zones',
        'Temperature Converter': 'converting temperatures',
        'Binary Converter': 'converting number systems',
        'Data Size Converter': 'converting data sizes',
        'Speed Converter': 'converting speeds',
        'Area Converter': 'converting areas',
        'Volume Converter': 'converting volumes'
    };
    
    return descriptions[toolName] || 'various tasks';
}

function getToolSpecificContent(toolId) {
    switch(toolId) {
        case 'password-generator':
            return `
                <div class="form-group">
                    <label for="passwordLength">Password Length:</label>
                    <input type="number" id="passwordLength" min="4" max="128" value="12">
                </div>
                <div class="form-group">
                    <label>Options:</label>
                    <div class="checkbox-group">
                        <label><input type="checkbox" id="includeUppercase" checked> Uppercase Letters</label>
                        <label><input type="checkbox" id="includeLowercase" checked> Lowercase Letters</label>
                        <label><input type="checkbox" id="includeNumbers" checked> Numbers</label>
                        <label><input type="checkbox" id="includeSymbols" checked> Symbols</label>
                    </div>
                </div>
                <div class="form-group">
                    <label for="passwordCount">Number of Passwords:</label>
                    <input type="number" id="passwordCount" min="1" max="10" value="1">
                </div>
            `;
        case 'qr-generator':
            return `
                <div class="form-group">
                    <label for="qrContent">Content:</label>
                    <textarea id="qrContent" placeholder="Enter text, URL, or contact info..." rows="4"></textarea>
                </div>
                <div class="form-group">
                    <label for="qrSize">Size:</label>
                    <select id="qrSize">
                        <option value="small">Small</option>
                        <option value="medium" selected>Medium</option>
                        <option value="large">Large</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="qrColor">Color:</label>
                    <input type="color" id="qrColor" value="#000000">
                </div>
            `;
        case 'unit-converter':
            return `
                <div class="form-group">
                    <label for="conversionType">Conversion Type:</label>
                    <select id="conversionType">
                        <option value="length">Length</option>
                        <option value="weight">Weight</option>
                        <option value="temperature">Temperature</option>
                        <option value="area">Area</option>
                        <option value="volume">Volume</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="inputValue">Value:</label>
                    <input type="number" id="inputValue" step="any" placeholder="Enter value">
                </div>
                <div class="form-group">
                    <label for="fromUnit">From Unit:</label>
                    <select id="fromUnit">
                        <option value="meter">Meter</option>
                        <option value="kilometer">Kilometer</option>
                        <option value="centimeter">Centimeter</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="toUnit">To Unit:</label>
                    <select id="toUnit">
                        <option value="meter">Meter</option>
                        <option value="kilometer">Kilometer</option>
                        <option value="centimeter">Centimeter</option>
                    </select>
                </div>
            `;
        case 'url-shortener':
            return `
                <div class="form-group">
                    <label for="longUrl">Long URL:</label>
                    <input type="url" id="longUrl" placeholder="https://example.com/very/long/url/path" style="width: 100%;">
                </div>
                <div class="form-group">
                    <label for="customAlias">Custom Alias (optional):</label>
                    <input type="text" id="customAlias" placeholder="my-custom-link">
                </div>
            `;
        default:
            return `<p>Additional controls for ${toolId.replace('-', ' ')} would be implemented here.</p>`;
    }
}

// Create the public/tools directory if it doesn't exist
const toolsDir = './public/tools';
if (!fs.existsSync(toolsDir)) {
    fs.mkdirSync(toolsDir, { recursive: true });
}

// Generate all tool pages
tools.forEach(tool => {
    const filePath = path.join(toolsDir, `${tool.id}.html`);
    
    // Only create the file if it doesn't already exist
    if (!fs.existsSync(filePath)) {
        const htmlContent = toolTemplate(tool.name, tool.category, tool.id);
        fs.writeFileSync(filePath, htmlContent);
        console.log(`Created: ${filePath}`);
    } else {
        console.log(`Skipped (exists): ${filePath}`);
    }
});

console.log('\nTool page generation complete!');
console.log(`Generated ${tools.length} tool pages in the public/tools directory.`);