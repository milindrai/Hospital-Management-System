const express = require('express');
const router = express.Router();
const db = require('../db');
const authenticateToken = require('../authMiddleware');
require('dotenv').config();

// Use the authenticateToken middleware
router.use(authenticateToken);

// Get current status of a patient by name
router.get('/status/:name', (req, res) => {
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

// Create a new patient
router.post('/create', (req, res) => {
    const { name, hospital_id, disease_id, doctor_id, department } = req.body;

    if (!name || !hospital_id || !disease_id || !doctor_id || !department) {
        return res.status(400).json({ message: 'Please provide patient name, hospital_id, disease_id, doctor_id, and department.' });
    }

    db.query('INSERT INTO patients (patient_name, hospital_id, disease_id, doctor_id, department, status) VALUES (?, ?, ?, ?, ?, ?)', 
        [name, hospital_id, disease_id, doctor_id, department, 'primary_check'], 
        (err, result) => {
            if (err) {
                console.error('Error inserting patient:', err);
                return res.status(500).json({ message: 'Failed to create patient' });
            }

            const patientNumber = result.insertId;
            res.json({ message: 'Patient created', patient_number: patientNumber });
        });
});

// Update patient status
router.put('/update/:id/status', (req, res) => {
    const patientId = req.params.id;
    const { status } = req.body;
    if (!status) {
        return res.status(400).json({ message: 'Please provide status to update' });
    }

    db.query('UPDATE patients SET status = ? WHERE patient_id = ?', [status, patientId], (err, result) => {
        if (err) {
            console.error('Error updating patient status:', err);
            return res.status(500).json({ message: 'Failed to update patient status' });
        }

        res.json({ message: 'Patient status updated', patient_id: patientId });
    });
});

module.exports = router;
