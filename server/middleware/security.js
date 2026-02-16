const rateLimit = require('express-rate-limit');
const helmet = require('helmet');


const limiter = rateLimit({
    windowMs: 1 * 60 * 1000, // 1 minute
    max: 10, // Limit each IP to 10 requests per windowMs
    message: 'Too many requests, please try again later.'
});

const securityMiddleware = (app) => {
    // Set security headers
    app.use(helmet());

    // Rate limiting
    app.use('/api', limiter);
};

module.exports = securityMiddleware;
