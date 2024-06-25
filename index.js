require('dotenv').config();

const express = require('express');
const mysql = require('mysql2');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const bodyParser = require('body-parser');

const app = express();
const port = process.env.PORT || 3000;
const SECRET_KEY = process.env.JWT_SECRET || '2MQajZZkmcWpefBlZ5HcM3DBhncw83lxYmN1jfVIgGA=';

app.use(bodyParser.json());

// MySQL connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: 'signup_db'
});

db.connect(err => {
    if (err) throw err;
    console.log('MySQL connected...');
});

// Signup route
app.post('/signup', (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({ message: 'Please provide name, email, and password.' });
    }

    // Check if user already exists
    db.query('SELECT email FROM users WHERE email = ?', [email], (err, results) => {
        if (err) throw err;

        if (results.length > 0) {
            return res.status(400).json({ message: 'Email already exists.' });
        }

        // Hash the password
        bcrypt.hash(password, 10, (err, hashedPassword) => {
            if (err) throw err;

            // Insert user into the database
            db.query('INSERT INTO users (name, email, password) VALUES (?, ?, ?)', [name, email, hashedPassword], (err, results) => {
                if (err) throw err;

                // Generate JWT token
                const token = jwt.sign({ id: results.insertId, email }, SECRET_KEY, { expiresIn: '1h' });

                res.json({ token });
            });
        });
    });
});

// Login route
app.post('/login', (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' });
    }

    // Check if user exists
    db.query('SELECT * FROM users WHERE email = ?', [email], async (err, results) => {
        if (err) {
            console.error('Error querying MySQL:', err);
            return res.status(500).json({ message: 'Internal server error' });
        }

        if (results.length === 0) {
            // If user does not exist, respond with user not found message
            return res.status(404).json({ message: 'User not found' });
        } else {
            const user = results[0];

            // Check password
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return res.status(401).json({ message: 'Invalid credentials' });
            }

            // Create JWT token
            const token = jwt.sign({ id: user.id, email: user.email }, SECRET_KEY, { expiresIn: '1h' });

            res.json({ message: 'Login successful', token });
        }
    });
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});