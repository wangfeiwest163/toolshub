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
