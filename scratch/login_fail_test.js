const http = require('http');

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
        console.log('Testing Login with non-existent user...');
        const loginRes1 = await post('/api/auth/login', { username: 'nobody_' + Date.now(), password: 'any' });
        console.log('Login Result (Expected 401):', loginRes1);

        console.log('Testing Login with wrong password...');
        // First create a user
        const u = 'u' + Date.now();
        await post('/api/auth/signup', { username: u, password: 'correct' });
        const loginRes2 = await post('/api/auth/login', { username: u, password: 'wrong' });
        console.log('Login Result (Expected 401):', loginRes2);
    } catch (err) {
        console.error('Test Failed:', err);
    }
}

runTest();
