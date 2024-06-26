const express = require('express');
const router = express.Router();
const db = require('../db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const tokenBlacklist = require('../tokenBlacklist');
require('dotenv').config();

// Signup
router.post('/signup', (req, res) => {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
        return res.status(400).json({ message: 'Please provide name, email, and password' });
    }

    // Hash the password
    bcrypt.hash(password, 10, (err, hash) => {
        if (err) {
            console.error('Error hashing password:', err);
            return res.status(500).json({ message: 'Internal server error' });
        }

        // Insert user into the database
        db.query('INSERT INTO users (name, email, password) VALUES (?, ?, ?)', [name, email, hash], (err, result) => {
            if (err) {
                console.error('Error inserting user:', err);
                return res.status(500).json({ message: 'Failed to create user' });
            }

            res.json({ message: 'User created successfully' });
        });
    });
});

// Login
router.post('/login', (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ message: 'Please provide email and password' });
    }

    // Check if the user exists
    db.query('SELECT * FROM users WHERE email = ?', [email], (err, results) => {
        if (err) {
            console.error('Error querying MySQL:', err);
            return res.status(500).json({ message: 'Internal server error' });
        }

        if (results.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        const user = results[0];

        // Compare passwords
        bcrypt.compare(password, user.password, (err, isMatch) => {
            if (err) {
                console.error('Error comparing passwords:', err);
                return res.status(500).json({ message: 'Internal server error' });
            }

            if (!isMatch) {
                return res.status(401).json({ message: 'Incorrect password' });
            }

            // Create a JWT token
            const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' });

            res.json({ message: 'Login successful', token });
        });
    });
});

// Logout
router.post('/logout', (req, res) => {
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
        return res.status(400).json({ message: 'No token provided' });
    }

    const token = authHeader.split(' ')[1]; // Extract the token from the "Bearer <token>" format

    console.log('Adding token to blacklist:', token);

    // Add token to blacklist
    tokenBlacklist.push(token);

    console.log('Current blacklist:', tokenBlacklist);

    res.json({ message: 'Logout successful' });
});

module.exports = router;
