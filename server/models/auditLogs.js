const fs = require('fs');
const path = require('path');

const logFilePath = path.join(__dirname, '..', 'logs.txt');

const logs = []; // Keep in-memory for admin dashboard

const logAction = (user, action, metadata) => {
    const timestamp = new Date();
    const logEntry = { user, action, timestamp, metadata };

    // 1. Push to in-memory store (for Admin Dashboard)
    logs.push(logEntry);

    // 2. Append to file (Persistent Log)
    const fileLogEntry = `[${timestamp.toISOString()}] USER: ${user} | ACTION: ${action} | META: ${JSON.stringify(metadata)}\n`;

    fs.appendFile(logFilePath, fileLogEntry, (err) => {
        if (err) console.error('Failed to write to log file:', err);
    });
};

module.exports = { logs, logAction };
