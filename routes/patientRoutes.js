const express = require('express');
const router = express.Router();
const db = require('../db');
const authenticateToken = require('../authMiddleware');

// Use the authenticateToken middleware
router.use(authenticateToken);

// Patient-only routes
router.get('/status/:name', (req, res) => {
    if (req.user.role !== 'user' && req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Access denied, only users can view appointment details' });
    }
    const patientName = req.params.name;
    db.query('SELECT * FROM patients WHERE patient_name = ?', [patientName], (err, results) => {
        if (err) {
            console.error('Error querying MySQL:', err);
            return res.status(500).json({ message: 'Internal server error' });
        }

        if (results.length === 0) {
            return res.status(404).json({ message: 'Patient not found' });
        }

        const currentStatus = results[0].status;
        res.json({ name: patientName, status: currentStatus });
    });
});


//error in this api
router.get('/visits/:name', (req, res) => {
    const patientName = req.params.name;
    db.query('SELECT * FROM visits WHERE patient_name = ?', [patientName], (err, results) => {
        if (err) {
            console.error('Error querying MySQL:', err);
            return res.status(500).json({ message: 'Internal server error' });
        }

        if (results.length === 0) {
            console.log('No visits found for patient', patientName);
            return res.status(404).json({ message: 'Visits not found for patient' });
        }

        res.json(results);
    });
});

module.exports = router;
