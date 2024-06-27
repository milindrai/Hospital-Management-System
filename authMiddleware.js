const jwt = require('jsonwebtoken');
const db = require('./db');
require('dotenv').config();

const authenticateToken = (req, res, next) => {
    const token = req.cookies.token; // Read the token from cookies

    if (!token) {
        return res.status(401).json({ message: 'Access denied, no token provided' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ message: 'Invalid token' });
        }

        req.user = user;

        // Fetch user role from database and attach to request object
        db.query('SELECT role FROM users WHERE id = ?', [user.id], (err, results) => {
            if (err) {
                console.error('Error fetching user role:', err);
                return res.status(500).json({ message: 'Internal server error' });
            }

            if (results.length === 0) {
                return res.status(404).json({ message: 'User not found' });
            }

            req.user.role = results[0].role;
            next();
        });
    });
};

module.exports = authenticateToken;
