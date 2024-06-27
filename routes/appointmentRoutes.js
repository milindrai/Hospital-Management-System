const express = require('express');
const router = express.Router();
const db = require('../db');
const authenticateToken = require('../authMiddleware');

// Use the authenticateToken middleware
router.use(authenticateToken);

// Create Appointment - accessible only to users
router.post('/', (req, res) => {
    // Check if the requester is not a user
    if (req.user.role !== 'user') {
        return res.status(403).json({ message: 'Access denied, only users can create appointments' });
    }

    const { patient_id, doctor_id, appointment_date, appointment_time, remarks } = req.body;

    // Check if all required fields are present
    if (!patient_id || !doctor_id || !appointment_date || !appointment_time || !remarks) {
        return res.status(400).json({ message: 'Please provide patient_id, doctor_id, appointment_date, appointment_time, and remarks.' });
    }

    // Proceed with database insertion
    db.query('INSERT INTO appointments (patient_id, doctor_id, appointment_date, appointment_time, remarks) VALUES (?, ?, ?, ?, ?)',
        [patient_id, doctor_id, appointment_date, appointment_time, remarks],
        (err, result) => {
            if (err) {
                console.error('Error creating appointment:', err);
                return res.status(500).json({ message: 'Failed to create appointment' });
            }

            res.json({ message: 'Appointment created', appointment_id: result.insertId });
        });
});


// Get Appointment Details - accessible only to users
router.get('/:appointment_id', (req, res) => {
    // Check if the requester is not a user
    if (req.user.role !== 'user') {
        return res.status(403).json({ message: 'Access denied, only users can view appointment details' });
    }

    const appointmentId = req.params.appointment_id;

    db.query('SELECT * FROM appointments WHERE appointment_id = ?', [appointmentId], (err, results) => {
        if (err) {
            console.error('Error fetching appointment:', err);
            return res.status(500).json({ message: 'Internal server error' });
        }

        if (results.length === 0) {
            return res.status(404).json({ message: 'Appointment not found' });
        }

        res.json(results[0]);
    });
});

// Cancel Appointment - accessible only to users
router.delete('/:appointment_id', (req, res) => {
    // Check if the requester is not a user
    if (req.user.role !== 'user') {
        return res.status(403).json({ message: 'Access denied, only users can cancel appointments' });
    }

    const appointmentId = req.params.appointment_id;

    db.query('DELETE FROM appointments WHERE appointment_id = ?', [appointmentId], (err, result) => {
        if (err) {
            console.error('Error canceling appointment:', err);
            return res.status(500).json({ message: 'Failed to cancel appointment' });
        }

        res.json({ message: 'Appointment canceled' });
    });
});

module.exports = router;
