const express = require('express');
const router = express.Router();
const db = require('../db');
const authenticateToken = require('../authMiddleware');

// Use the authenticateToken middleware
router.use(authenticateToken);

// Admin routes
router.get('/', (req, res) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Access denied, admin role required' });
    }

    db.query('SELECT * FROM staff', (err, results) => {
        if (err) {
            console.error('Error querying staff:', err);
            return res.status(500).json({ message: 'Failed to retrieve staff' });
        }

        res.json(results);
    });
});

router.delete('/:staff_id', (req, res) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Access denied, admin role required' });
    }

    const staffId = req.params.staff_id;

    db.query('DELETE FROM staff WHERE staff_id = ?', [staffId], (err, result) => {
        if (err) {
            console.error('Error deleting staff:', err);
            return res.status(500).json({ message: 'Failed to delete staff' });
        }

        res.json({ message: 'Staff deleted' });
    });
});

module.exports = router;
