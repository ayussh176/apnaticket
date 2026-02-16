const adminList = ['admin@example.com'];

const adminCheck = (req, res, next) => {
    if (!adminList.includes(req.user.email)) {
        return res.status(403).json({ msg: 'Forbidden – Admins only' });
    }
    next();
};

module.exports = adminCheck;
