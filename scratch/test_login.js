const http = require('http');

const data = JSON.stringify({
  username: 'testuser_1746906124578', // Using the one from previous test if possible or I'll just signup and login
  password: 'testpassword'
});

const login = () => {
    const options = {
      hostname: 'localhost',
      port: 5000,
      path: '/api/auth/login',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': data.length
      }
    };

    const req = http.request(options, res => {
      console.log(`Status: ${res.statusCode}`);
      res.on('data', d => {
        process.stdout.write(d);
      });
    });

    req.on('error', error => {
      console.error(error);
    });

    req.write(data);
    req.end();
}

login();
