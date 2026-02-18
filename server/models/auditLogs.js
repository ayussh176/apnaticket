const logger = require('../utils/logger'); // Import logger

const logs = []; // Keep in-memory for admin dashboard

const logAction = (user, action, metadata) => {
    const timestamp = new Date();
    const logEntry = { user, action, timestamp, metadata };

    // 1. Push to in-memory store (for Admin Dashboard)
    logs.push(logEntry);

    // 2. Log to file using winston
    logger.info(`USER: ${user} | ACTION: ${action}`, { meta: metadata });
};

module.exports = { logs, logAction };
