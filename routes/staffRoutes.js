const express = require('express');
const router = express.Router();
const db = require('../db');
const authenticateToken = require('../authMiddleware');

// Use the authenticateToken middleware
router.use(authenticateToken);

// Add new staff
router.post('/', (req, res) => {
    const { name, role, contact } = req.body;

    if (!name || !role || !contact) {
        return res.status(400).json({ message: 'Please provide name, role, and contact.' });
    }

    db.query('INSERT INTO staff (name, role, contact) VALUES (?, ?, ?)', 
        [name, role, contact], 
        (err, result) => {
            if (err) {
                console.error('Error adding staff:', err);
                return res.status(500).json({ message: 'Failed to add staff' });
            }

            res.json({ message: 'Staff added', staff_id: result.insertId });
        });
});

// Update staff details
router.put('/:staff_id', (req, res) => {
    const staffId = req.params.staff_id;
    const { name, role, contact } = req.body;

    if (!name || !role || !contact) {
        return res.status(400).json({ message: 'Please provide name, role, and contact.' });
    }

    db.query('UPDATE staff SET name = ?, role = ?, contact = ? WHERE staff_id = ?', 
        [name, role, contact, staffId], 
        (err, result) => {
            if (err) {
                console.error('Error updating staff:', err);
                return res.status(500).json({ message: 'Failed to update staff' });
            }

            res.json({ message: 'Staff details updated' });
        });
});

module.exports = router;
