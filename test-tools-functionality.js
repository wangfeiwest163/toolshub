const axios = require('axios');

// Test configuration
const BASE_URL = 'http://localhost:3000';

async function testEndpoint(url, expectedStatus = 200) {
  try {
    const response = await axios.get(`${BASE_URL}${url}`, { timeout: 5000 });
    console.log(`✓ ${url} - Status: ${response.status}`);
    return response.status === expectedStatus;
  } catch (error) {
    console.log(`✗ ${url} - Error: ${error.message}`);
    return false;
  }
}

async function testApiEndpoint(url, expectedStatus = 200) {
  try {
    const response = await axios.get(`${BASE_URL}${url}`, { timeout: 5000 });
    console.log(`✓ API ${url} - Status: ${response.status}, Data: ${typeof response.data === 'object' ? Object.keys(response.data).length : 'N/A'} items`);
    return response.status === expectedStatus;
  } catch (error) {
    console.log(`✗ API ${url} - Error: ${error.message}`);
    return false;
  }
}

async function testPostEndpoint(url, data, expectedStatus = 200) {
  try {
    const response = await axios.post(`${BASE_URL}${url}`, data, { timeout: 5000 });
    console.log(`✓ POST ${url} - Status: ${response.status}`);
    return response.status === expectedStatus;
  } catch (error) {
    console.log(`✗ POST ${url} - Error: ${error.message}`);
    return false;
  }
}

async function runTests() {
  console.log('Testing OpenClaw Tools Hub...\n');
  
  // Test main page
  console.log('=== Testing Main Pages ===');
  const mainPages = [
    '/',
    '/all',
    '/tools/all',
    '/analytics',
    '/dashboard'
  ];
  
  let passedMain = 0;
  for (const page of mainPages) {
    if (await testEndpoint(page)) passedMain++;
  }
  console.log(`Main pages: ${passedMain}/${mainPages.length} passed\n`);
  
  // Test individual tool pages
  console.log('=== Testing Individual Tool Pages ===');
  const toolPages = [
    '/tools/password-generator',
    '/tools/url-shortener',
    '/tools/unit-converter',
    '/tools/qr-generator',
    '/tools/file-converter',
    '/tools/text-editor',
    '/tools/notes',
    '/tools/timer',
    '/tools/scientific-calculator',
    '/tools/financial-calculator',
    '/tools/bmi-calculator',
    '/tools/age-calculator',
    '/tools/mortgage-calculator',
    '/tools/tax-calculator',
    '/tools/tip-calculator',
    '/tools/fuel-cost-calculator',
    '/tools/text-formatter',
    '/tools/case-converter',
    '/tools/character-counter',
    '/tools/spell-checker',
    '/tools/text-to-speech',
    '/tools/plagiarism-checker',
    '/tools/word-counter',
    '/tools/text-reverser',
    '/tools/image-compressor',
    '/tools/image-resizer',
    '/tools/watermark-tool',
    '/tools/color-picker',
    '/tools/image-cropper',
    '/tools/image-format-converter',
    '/tools/image-adjuster',
    '/tools/screenshot-tool',
    '/tools/json-formatter',
    '/tools/regex-tester',
    '/tools/code-minifier',
    '/tools/api-testing',
    '/tools/base64',
    '/tools/html-entities',
    '/tools/timestamp-converter',
    '/tools/hash-generator',
    '/tools/currency-converter',
    '/tools/timezone-converter',
    '/tools/temperature-converter',
    '/tools/binary-converter',
    '/tools/data-size-converter',
    '/tools/speed-converter',
    '/tools/area-converter',
    '/tools/volume-converter'
  ];
  
  let passedTools = 0;
  for (const page of toolPages) {
    if (await testEndpoint(page)) passedTools++;
  }
  console.log(`Tool pages: ${passedTools}/${toolPages.length} passed\n`);
  
  // Test API endpoints
  console.log('=== Testing API Endpoints ===');
  const apiEndpoints = [
    '/api/tools',
    '/api/tools/popular',
    '/api/tools/category/Utility%20Tools',
    '/api/tools/category/AI%20Tools',
    '/api/tools/category/Online%20Calculators',
    '/api/tools/category/Text%20Tools',
    '/api/tools/category/Image%20Tools',
    '/api/tools/category/Developer%20Tools',
    '/api/tools/category/Converter%20Tools'
  ];
  
  let passedApi = 0;
  for (const endpoint of apiEndpoints) {
    if (await testApiEndpoint(endpoint)) passedApi++;
  }
  console.log(`API endpoints: ${passedApi}/${apiEndpoints.length} passed\n`);
  
  // Test specific API functionality
  console.log('=== Testing API Functionality ===');
  const functionalTests = [
    { url: '/api/tools', method: 'GET', desc: 'Get all tools' },
    { url: '/api/tools/1', method: 'GET', desc: 'Get specific tool' },
    { url: '/api/tools/record-usage/1', method: 'POST', data: {}, desc: 'Record tool usage' }
  ];
  
  let passedFunctional = 0;
  for (const test of functionalTests) {
    if (test.method === 'GET') {
      if (await testApiEndpoint(test.url)) passedFunctional++;
    } else if (test.method === 'POST') {
      if (await testPostEndpoint(test.url, test.data || {})) passedFunctional++;
    }
  }
  console.log(`Functional tests: ${passedFunctional}/${functionalTests.length} passed\n`);
  
  // Summary
  const totalTests = mainPages.length + toolPages.length + apiEndpoints.length + functionalTests.length;
  const totalPassed = passedMain + passedTools + passedApi + passedFunctional;
  
  console.log('=== SUMMARY ===');
  console.log(`Total tests: ${totalTests}`);
  console.log(`Passed: ${totalPassed}`);
  console.log(`Failed: ${totalTests - totalPassed}`);
  console.log(`Success rate: ${Math.round((totalPassed / totalTests) * 100)}%`);
}

// Run the tests
runTests().catch(console.error);