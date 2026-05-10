const http = require('http');

const username = 'user_' + Date.now();
const password = 'password123';

const post = (path, body) => {
    return new Promise((resolve, reject) => {
        const data = JSON.stringify(body);
        const options = {
            hostname: 'localhost',
            port: 5000,
            path: path,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': data.length
            }
        };

        const req = http.request(options, res => {
            let responseBody = '';
            res.on('data', chunk => responseBody += chunk);
            res.on('end', () => resolve({ statusCode: res.statusCode, body: responseBody }));
        });

        req.on('error', reject);
        req.write(data);
        req.end();
    });
};

async function runTest() {
    try {
        console.log('Testing Signup...');
        const signupRes = await post('/api/auth/signup', { username, password });
        console.log('Signup Result:', signupRes);

        console.log('Testing Login...');
        const loginRes = await post('/api/auth/login', { username, password });
        console.log('Login Result:', loginRes);
    } catch (err) {
        console.error('Test Failed:', err);
    }
}

runTest();
