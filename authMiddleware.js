const jwt = require('jsonwebtoken');
const tokenBlacklist = require('./tokenBlacklist');
require('dotenv').config();

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
        return res.status(401).json({ message: 'Access denied, no token provided' });
    }

    const token = authHeader.split(' ')[1]; // Extract the token from the "Bearer <token>" format

    // Check if the token is blacklisted
    if (tokenBlacklist.includes(token)) {
        return res.status(401).json({ message: 'Token is invalidated' });
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
