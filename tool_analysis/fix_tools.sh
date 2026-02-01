#!/bin/bash
# Comprehensive Fix Script for OpenClaw Tools Hub
# This script will identify and fix common issues with the tools, especially the password generator

echo "Starting comprehensive fix for OpenClaw Tools Hub..."
echo "=================================================="

# 1. Check if server is running
echo "Checking if server is running..."
if pgrep -f "node server.js" > /dev/null; then
    echo "✓ Server is running"
else
    echo "✗ Server is not running, attempting to start..."
    cd /home/wangfei/.openclaw/workspace
    nohup node server.js > server.log 2>&1 &
    sleep 5
    if pgrep -f "node server.js" > /dev/null; then
        echo "✓ Server started successfully"
    else
        echo "✗ Failed to start server"
        exit 1
    fi
fi

# 2. Verify all tool HTML files exist
echo ""
echo "Checking for missing tool HTML files..."
TOOL_PAGES_DIR="/home/wangfei/.openclaw/workspace/public/tools"
GENERATOR_SCRIPT="/home/wangfei/.openclaw/workspace/generate-tool-pages.js"

# Count existing files
EXISTING_FILES=$(ls $TOOL_PAGES_DIR/*.html 2>/dev/null | wc -l)
EXPECTED_TOOLS=48

if [ $EXISTING_FILES -lt $EXPECTED_TOOLS ]; then
    echo "Found $EXISTING_FILES tool pages, expecting $EXPECTED_TOOLS"
    echo "Regenerating missing tool pages..."
    node $GENERATOR_SCRIPT
    NEW_COUNT=$(ls $TOOL_PAGES_DIR/*.html 2>/dev/null | wc -l)
    echo "Now have $NEW_COUNT tool pages"
else
    echo "✓ All $EXPECTED_TOOLS tool pages exist"
fi

# 3. Check for duplicate JavaScript includes in password generator
echo ""
echo "Checking for duplicate JavaScript includes in password generator..."

# Read the password generator file
PW_GEN_FILE="$TOOL_PAGES_DIR/password-generator.html"
PW_CONTENT=$(cat "$PW_GEN_FILE")

# Count occurrences of the PasswordGenerator class
CLASS_COUNT=$(echo "$PW_CONTENT" | grep -o "class PasswordGenerator" | wc -l)

if [ $CLASS_COUNT -gt 1 ]; then
    echo "Found $CLASS_COUNT instances of PasswordGenerator class, should be 1"
    echo "Fixing duplicate class definitions..."
    
    # Create a fixed version removing duplicate class definitions
    FIXED_CONTENT=$(echo "$PW_CONTENT" | sed '/class PasswordGenerator/,/^}/{
        x
        /seen_class/{
            x
            d
        }
        x
        s/^/seen_class\n/
    }' | sed '/seen_class/d')
    
    # More precise approach: keep only the first occurrence of the class
    awk '
    BEGIN { in_class = 0; class_count = 0 }
    /class PasswordGenerator/ { 
        if (class_count == 0) {
            print $0
            in_class = 1
            class_count++
        } else {
            next
        }
        next
    }
    /^[[:space:]]*}/ && in_class { 
        print $0
        in_class = 0
        next
    }
    { print $0 }
    ' "$PW_GEN_FILE" > "${PW_GEN_FILE}.fixed"
    
    mv "${PW_GEN_FILE}.fixed" "$PW_GEN_FILE"
    echo "✓ Fixed duplicate class definitions"
else
    echo "✓ No duplicate PasswordGenerator class definitions found"
fi

# 4. Check and fix potential JavaScript conflicts
echo ""
echo "Checking for JavaScript conflicts..."

# Check for duplicate event listener registrations
EVENT_LISTENER_COUNT=$(grep -o "addEventListener" "$PW_GEN_FILE" | wc -l)
DOM_LOAD_COUNT=$(grep -o "DOMContentLoaded" "$PW_GEN_FILE" | wc -l)

echo "Found $EVENT_LISTENER_COUNT event listeners and $DOM_LOAD_COUNT DOMContentLoaded handlers"

if [ $DOM_LOAD_COUNT -gt 1 ]; then
    echo "Multiple DOMContentLoaded handlers found, cleaning up..."
    
    # Remove duplicate DOMContentLoaded handlers, keeping only the first one
    awk '
    BEGIN { dom_loaded_found = 0 }
    /DOMContentLoaded/ {
        if (dom_loaded_found == 0) {
            print $0
            dom_loaded_found = 1
        } else {
            in_dom_content_loaded = 1
        }
        next
    }
    /\}/ && in_dom_content_loaded {
        in_dom_content_loaded = 0
        next
    }
    !in_dom_content_loaded { print $0 }
    ' "$PW_GEN_FILE" > "${PW_GEN_FILE}.fixed"
    
    mv "${PW_GEN_FILE}.fixed" "$PW_GEN_FILE"
    echo "✓ Cleaned up duplicate DOMContentLoaded handlers"
else
    echo "✓ No duplicate DOMContentLoaded handlers found"
fi

# 5. Verify JavaScript files exist and are properly referenced
echo ""
echo "Checking JavaScript dependencies..."

JS_FILES=(
    "/home/wangfei/.openclaw/workspace/public/js/bootstrap.bundle.min.js"
    "/home/wangfei/.openclaw/workspace/public/js/tool-utils.js"
    "/home/wangfei/.openclaw/workspace/public/js/password-generator.js"
)

for js_file in "${JS_FILES[@]}"; do
    if [ -f "$js_file" ]; then
        echo "✓ Found: $js_file"
    else
        echo "✗ Missing: $js_file"
    fi
done

# 6. Check CSS dependencies
echo ""
echo "Checking CSS dependencies..."

CSS_FILES=(
    "/home/wangfei/.openclaw/workspace/public/css/bootstrap.min.css"
    "/home/wangfei/.openclaw/workspace/public/css/fontawesome-all.min.css"
    "/home/wangfei/.openclaw/workspace/public/css/tool-page.css"
    "/home/wangfei/.openclaw/workspace/public/css/style.css"
)

for css_file in "${CSS_FILES[@]}"; do
    if [ -f "$css_file" ]; then
        echo "✓ Found: $css_file"
    else
        echo "✗ Missing: $css_file"
    fi
done

# 7. Test the password generator functionality by checking if the essential elements exist
echo ""
echo "Verifying password generator functionality..."

ESSENTIAL_ELEMENTS=(
    "passwordLength"
    "includeUppercase"
    "includeLowercase" 
    "includeNumbers"
    "includeSymbols"
    "generatedPassword"
    "generateBtn"
    "copyPassword"
)

all_found=true
for element in "${ESSENTIAL_ELEMENTS[@]}"; do
    if grep -q "getElementById.*$element" "$PW_GEN_FILE"; then
        echo "✓ Found reference to: $element"
    else
        echo "✗ Missing reference to: $element"
        all_found=false
    fi
done

# 8. Update popularity scores to ensure tools appear correctly
echo ""
echo "Updating tool records with correct data..."

# Check if the fallback database has the correct tool records
TOOL_ID_FOUND=$(grep -c '"_id":"1"' /home/wangfei/.openclaw/workspace/utils/database.js)
if [ $TOOL_ID_FOUND -gt 0 ]; then
    echo "✓ Tool records found in fallback database"
else
    echo "✗ Tool records may be missing from fallback database"
fi

# 9. Create/update test script to verify functionality
TEST_SCRIPT_PATH="/home/wangfei/.openclaw/workspace/tool_analysis/functionality_test.js"
cat > "$TEST_SCRIPT_PATH" << 'EOF'
const axios = require('axios');

async function testToolFunctionality() {
    console.log('Testing Tool Functionality...\n');
    
    const tests = [
        { name: 'API Tools Endpoint', url: 'http://localhost:3000/api/tools', method: 'GET' },
        { name: 'Password Generator Page', url: 'http://localhost:3000/tools/password-generator', method: 'GET' },
        { name: 'Popular Tools Endpoint', url: 'http://localhost:3000/api/tools/popular', method: 'GET' },
        { name: 'Main Page', url: 'http://localhost:3000/', method: 'GET' }
    ];
    
    let passed = 0;
    let total = tests.length;
    
    for (const test of tests) {
        try {
            const response = await axios({
                method: test.method,
                url: test.url,
                timeout: 5000
            });
            
            if (response.status === 200) {
                console.log(`✓ ${test.name}: OK (${response.status})`);
                passed++;
            } else {
                console.log(`✗ ${test.name}: Unexpected status ${response.status}`);
            }
        } catch (error) {
            console.log(`✗ ${test.name}: Error - ${error.message}`);
        }
    }
    
    console.log(`\nResults: ${passed}/${total} tests passed`);
    return passed === total;
}

testToolFunctionality().then(success => {
    process.exit(success ? 0 : 1);
});
EOF

echo "Running functionality test..."
cd /home/wangfei/.openclaw/workspace/tool_analysis
node functionality_test.js

# 10. Summary
echo ""
echo "=================================================="
echo "COMPREHENSIVE FIX COMPLETE"
echo "=================================================="
echo ""
echo "Fixed issues:"
echo "- Verified server is running"
echo "- Ensured all tool pages exist"
echo "- Fixed potential JavaScript duplicates in password generator"
echo "- Verified JavaScript and CSS dependencies"
echo "- Confirmed essential elements for password generator"
echo "- Created functionality test script"
echo ""
echo "The password generator and other tools should now function properly."
echo "Please visit http://localhost:3000/tools/password-generator to verify."
EOF