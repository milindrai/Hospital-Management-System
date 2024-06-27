const express = require('express');
const router = express.Router();
const db = require('../db');
const authenticateToken = require('../authMiddleware');

// Use the authenticateToken middleware
router.use(authenticateToken);

// Patient-only routes
router.get('/status/:name', (req, res) => {
    if (req.user.role !== 'doctor' && req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Access denied, only doctors and admins can view these details' });
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
router.get('/visits/:patient_id', (req, res) => {
    const patientId = req.params.patient_id;
    db.query('SELECT * FROM visits WHERE patient_id = ?', [patientId], (err, results) => {
        if (err) {
            console.error('Error querying MySQL:', err);
            return res.status(500).json({ message: 'Internal server error' });
        }

        if (results.length === 0) {
            console.log('No visits found for patient ID', patientId);
            return res.status(404).json({ message: 'Visits not found for patient ID' });
        }

        res.json(results);
    });
});


module.exports = router;
