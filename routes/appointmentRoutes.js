const express = require('express');
const router = express.Router();
const db = require('../db');
const authenticateToken = require('../authMiddleware');

// Use the authenticateToken middleware
router.use(authenticateToken);

// Create an appointment
router.post('/', (req, res) => {
    const { patient_id, doctor_id, appointment_date, appointment_time } = req.body;

    if (!patient_id || !doctor_id || !appointment_date || !appointment_time) {
        return res.status(400).json({ message: 'Please provide patient_id, doctor_id, appointment_date, and appointment_time.' });
    }

    db.query('INSERT INTO appointments (patient_id, doctor_id, appointment_date, appointment_time) VALUES (?, ?, ?, ?)', 
        [patient_id, doctor_id, appointment_date, appointment_time], 
        (err, result) => {
            if (err) {
                console.error('Error creating appointment:', err);
                return res.status(500).json({ message: 'Failed to create appointment' });
            }

            res.json({ message: 'Appointment created', appointment_id: result.insertId });
        });
});


// Update appointment endpoint
router.put('/:appointment_id', (req, res) => {
    const appointment_id = req.params.appointment_id;
    const { appointment_date, appointment_time } = req.body;

    const query = `
        UPDATE appointments
        SET appointment_date = ?, appointment_time = ?
        WHERE appointment_id = ?
    `;

    db.query(query, [appointment_date, appointment_time, appointment_id], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).send('An error occurred');
        }
        if (result.affectedRows === 0) {
            return res.status(404).send('Appointment not found');
        }
        res.send('Appointment updated successfully');
    });
});

// Get appointment details
router.get('/:appointment_id', (req, res) => {
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

// Cancel an appointment
router.delete('/:appointment_id', (req, res) => {
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
