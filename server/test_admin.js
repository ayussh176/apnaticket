const http = require('http');

async function request(path, method, body, token) {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: 'localhost',
            port: 5001,
            path: path,
            method: method,
            headers: {
                'Content-Type': 'application/json',
            }
        };

        if (token) {
            options.headers['Authorization'] = `Bearer ${token}`; // Remove 'Bearer ' if your middleware doesn't use it, but usually standard. verifyToken usually expects it? Let's check.
            // middleware/auth.js: const token = req.header('Authorization'); if (!token) ... try { const verified = jwt.verify(token, ...) }
            // Often it expects just the token or "Bearer <token>". I should check authMiddleware.js.
        }

        const req = http.request(options, (res) => {
            let data = '';
            res.on('data', (chunk) => data += chunk);
            res.on('end', () => resolve({ status: res.statusCode, data: data ? JSON.parse(data) : {} }));
        });

        req.on('error', (e) => reject(e));
        if (body) req.write(JSON.stringify(body));
        req.end();
    });
}

async function run() {
    try {
        console.log("1. Registering Admin...");
        const adminReg = await request('/api/auth/register', 'POST', {
            email: 'admin@example.com',
            password: 'password123',
            role: 'major',
            panOrAadhaar: 'ABCDE1234567Z'
        });
        console.log("Register Admin:", adminReg.status, adminReg.data);

        console.log("2. Login Admin...");
        const adminLogin = await request('/api/auth/login', 'POST', {
            email: 'admin@example.com',
            password: 'password123'
        });
        console.log("Login Admin:", adminLogin.status);
        const adminToken = adminLogin.data.token;

        if (!adminToken) {
            console.error("Failed to get admin token");
            // If verifyToken just takes 'Authorization' header as token value without Bearer ...
        }

        console.log("3. Get Admin Logs...");
        const logs = await request('/api/admin/logs', 'GET', null, adminToken);
        console.log("Logs Status:", logs.status);
        console.log("Logs Count:", logs.data.length);

        console.log("4. Registering User...");
        const userReg = await request('/api/auth/register', 'POST', {
            email: 'user@test.com',
            password: 'pxssword123',
            role: 'major',
            panOrAadhaar: 'ABCDE1234567Z'
        });
        console.log("Register User:", userReg.status);

        console.log("5. Login User...");
        const userLogin = await request('/api/auth/login', 'POST', {
            email: 'user@test.com',
            password: 'pxssword123'
        });
        const userToken = userLogin.data.token;
        console.log("Login User:", userLogin.status);

        console.log("6. Recharge User Wallet...");
        const recharge = await request('/api/wallet/recharge', 'POST', {}, userToken);
        console.log("Recharge:", recharge.status, recharge.data);

        console.log("7. Create Booking...");
        const booking = await request('/api/book', 'POST', {
            bookingType: 'Express',
            journeyDate: '2023-12-25',
            passengerName: 'John Doe',
            panOrAadhaar: 'ABCDE1234F', // Using format expected by book.js
            role: 'major'
        }, userToken);
        console.log("Booking:", booking.status, booking.data);

        console.log("8. Verify Logs as Admin...");
        const logsAfter = await request('/api/admin/logs', 'GET', null, adminToken);
        console.log("Logs After:", logsAfter.data.length);
        console.log("Last Log:", logsAfter.data[logsAfter.data.length - 1]);

        console.log("9. Access Admin as User (Should Fail)...");
        const failTest = await request('/api/admin/logs', 'GET', null, userToken);
        console.log("Fail Test Status:", failTest.status);

    } catch (e) {
        console.error(e);
    }
}

run();
