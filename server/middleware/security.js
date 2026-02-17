const rateLimit = require('express-rate-limit');
const helmet = require('helmet');


const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    message: 'Too many requests, please try again later.'
});

const bookingLimiter = rateLimit({
    windowMs: 1 * 60 * 1000, // 1 minute
    max: 5, // Limit each IP to 5 booking requests per minute
    message: 'Booking limit reached. Please wait a moment.'
});

const securityMiddleware = (app) => {
    // Set security headers
    app.use(helmet());

    // Rate limiting
    app.use('/api', limiter);
};

module.exports = { securityMiddleware, bookingLimiter };
