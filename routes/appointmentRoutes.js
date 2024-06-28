const express = require('express');
const router = express.Router();
const db = require('../db');
const authenticateToken = require('../authMiddleware');

// Use the authenticateToken middleware
router.use(authenticateToken);

router.post('/', (req, res) => {
    if (req.user.role !== 'user' && req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Access denied' });
    }

    const { patient_id, appointment_date, appointment_time, remarks } = req.body;

    if (!patient_id || !appointment_date || !appointment_time || !remarks) {
        return res.status(400).json({ message: 'Please provide patient_id, appointment_date, appointment_time, and remarks.' });
    }

    db.query('INSERT INTO appointments (patient_id, appointment_date, appointment_time, remarks) VALUES (?, ?,  ?, ?)',
        [patient_id, appointment_date, appointment_time, remarks],
        (err, result) => {
            if (err) {
                console.error('Error creating appointment:', err);
                return res.status(500).json({ message: 'Failed to create appointment' });
            }

            res.json({ message: 'Appointment created', appointment_id: result.insertId });
        });
});


router.put('/:appointment_id', (req, res) => {
    if (req.user.role !== 'user' && req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Access denied' });
    }
    const appointmentId = req.params.appointment_id;

    const { appointment_date, appointment_time, remarks } = req.body;

    if (!appointment_date || !appointment_time || !remarks) {
        return res.status(400).json({ message: 'Please provide appointment_date, appointment_time, and remarks.' });
    }

    db.query(
        'UPDATE appointments SET appointment_date = ?, appointment_time = ?, remarks = ? WHERE appointment_id = ?',
        [appointment_date, appointment_time, remarks, appointmentId],
        (err, result) => {
            if (err) {
                console.error('Error updating appointment:', err);
                return res.status(500).json({ message: 'Failed to update appointment' });
            }

            if (result.affectedRows === 0) {
                return res.status(404).json({ message: 'Appointment not found' });
            }

            res.json({ message: 'Appointment updated', appointment_id: appointmentId });
        }
    );
});


router.get('/:appointment_id', (req, res) => {
    if (req.user.role !== 'user' && req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Access denied' });
    }

    const appointmentId = req.params.appointment_id;

    db.query('SELECT * FROM appointments WHERE appointment_id = ?', [appointmentId], (err, results) => {
        if (err) {
            console.error('Error fetching appointment:', err);
            return res.status(500).json({ message: 'Server error' });
        }

        if (results.length === 0) {
            return res.status(404).json({ message: 'Appointment not found' });
        }

        res.json(results[0]);
    });
});

router.delete('/:appointment_id', (req, res) => {
    if (req.user.role !== 'user' && req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Access denied' });
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
