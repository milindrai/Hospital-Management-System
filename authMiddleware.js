const jwt = require('jsonwebtoken');
require('dotenv').config();
const authenticateToken = require('../authMiddleware');

const authenticateToken = (req, res, next) => {
    const token = req.headers['authorization'];
    if (!token) {
        return res.status(401).json({ message: 'Access denied, no token provided' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(400).json({ message: 'Invalid token' });
    }
};

module.exports = authenticateToken;
