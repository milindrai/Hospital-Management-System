const express = require('express');
const router = express.Router();
const db = require('../db');
const authenticateToken = require('../authMiddleware');

// Use the authenticateToken middleware
router.use(authenticateToken);

// Admin and Doctor routes
router.get('/:patient_id', (req, res) => {
    if (req.user.role !== 'doctor' && req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Access denied, doctor or admin role required' });
    }

    const patientId = req.params.patient_id;

    db.query('SELECT * FROM visits WHERE patient_id = ?', [patientId], (err, results) => {
        if (err) {
            console.error('Error querying visits:', err);
            return res.status(500).json({ message: 'Failed to retrieve visits' });
        }

        res.json(results);
    });
});

router.delete('/:visit_id', (req, res) => {
    if (req.user.role !== 'doctor' && req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Access denied, doctor or admin role required' });
    }

    const visitId = req.params.visit_id;

    db.query('DELETE FROM visits WHERE visit_id = ?', [visitId], (err, result) => {
        if (err) {
            console.error('Error deleting visit:', err);
            return res.status(500).json({ message: 'Failed to delete visit' });
        }

        res.json({ message: 'Visit deleted' });
    });
});

module.exports = router;
