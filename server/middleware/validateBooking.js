const rateLimitMap = {};

function validateBooking(req, res, next) {
    const ip = req.ip || req.connection.remoteAddress;
    const now = Date.now();

    rateLimitMap[ip] = rateLimitMap[ip] || [];
    // keep only recent 24h
    rateLimitMap[ip] = rateLimitMap[ip].filter(ts => now - ts < 24 * 60 * 60 * 1000);

    if (rateLimitMap[ip].length >= 2) {
        return res.status(429).json({ msg: '⛔ Too many bookings from this IP. Try again after 24h.' });
    }

    // We push the timestamp only after successful validation in the route? 
    // actually the requirement says apply middleware. 
    // Usually rate limit counts *attempts* or *successes*. 
    // The provided code snippet pushes `now` BEFORE `next()`. 
    // But strictly speaking, if the booking fails validation (e.g. invalid PAN), should it count?
    // The user provided snippet does: rateLimitMap[ip].push(now); next();
    // So I will follow that.
    rateLimitMap[ip].push(now);
    next();
}

module.exports = validateBooking;
