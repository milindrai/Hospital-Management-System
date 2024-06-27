const express = require('express');
const router = express.Router();
const db = require('../db');
const authenticateToken = require('../authMiddleware');

// Use the authenticateToken middleware
router.use(authenticateToken);

// Doctor-only routes
router.post('/', (req, res) => {
    if (req.user.role !== 'doctor') {
        return res.status(403).json({ message: 'Access denied, doctor role required' });
    }

    const { patient_id, doctor_id, medications } = req.body;

    if (!patient_id || !doctor_id || !medications) {
        return res.status(400).json({ message: 'Please provide patient_id, doctor_id, and medications.' });
    }

    const medicationsJSON = JSON.stringify(medications);

    db.query('INSERT INTO prescriptions (patient_id, doctor_id, medications) VALUES (?, ?, ?)',
        [patient_id, doctor_id, medicationsJSON],
        (err, result) => {
            if (err) {
                console.error('Error creating prescription:', err);
                return res.status(500).json({ message: 'Failed to create prescription' });
            }

            res.json({ message: 'Prescription created', prescription_id: result.insertId });
        });
});

router.put('/:prescription_id', (req, res) => {
    if (req.user.role !== 'doctor') {
        return res.status(403).json({ message: 'Access denied, doctor role required' });
    }

    const prescriptionId = req.params.prescription_id;
    const { medications } = req.body;

    if (!medications) {
        return res.status(400).json({ message: 'Please provide medications.' });
    }

    const medicationsJSON = JSON.stringify(medications);

    db.query('UPDATE prescriptions SET medications = ? WHERE prescription_id = ?',
        [medicationsJSON, prescriptionId],
        (err, result) => {
            if (err) {
                console.error('Error updating prescription:', err);
                return res.status(500).json({ message: 'Failed to update prescription' });
            }

            res.json({ message: 'Prescription updated' });
        });
});

module.exports = router;
