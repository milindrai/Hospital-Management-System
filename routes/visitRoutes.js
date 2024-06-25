const express = require('express');
const router = express.Router();
const db = require('../db');

// Get all hospital visits for a patient with details
router.get('/visits/:name', (req, res) => {
    const patientName = req.params.name;
    db.query('SELECT * FROM patients WHERE patient_name = ?', [patientName], (err, results) => {
        if (err) {
            console.error('Error querying MySQL:', err);
            return res.status(500).json({ message: 'Internal server error' });
        }

        if (results.length === 0) {
            return res.status(404).json({ message: 'Patient not found' });
        }

        const patientId = results[0].patient_id;
        db.query('SELECT * FROM visits WHERE patient_id = ? ORDER BY visit_date', [patientId], (err, visits) => {
            if (err) {
                console.error('Error querying MySQL:', err);
                return res.status(500).json({ message: 'Internal server error' });
            }

            res.json({
                patient: patientName,
                visits: visits.map(visit => ({
                    visit_date: visit.visit_date,
                    remarks: visit.remarks
                }))
            });
        });
    });
});

// Update patient visits with remarks
router.put('/update/:id/visits', (req, res) => {
    const patientId = req.params.id;
    const { visit_date, remarks } = req.body;
    if (!visit_date || !remarks) {
        return res.status(400).json({ message: 'Please provide visit_date and remarks' });
    }

    db.query('INSERT INTO visits (patient_id, visit_date, remarks) VALUES (?, ?, ?)', 
        [patientId, visit_date, remarks], 
        (err, result) => {
            if (err) {
                console.error('Error inserting visit:', err);
                return res.status(500).json({ message: 'Failed to update patient visits' });
            }

            res.json({ message: 'Patient visits updated', visit_id: result.insertId });
        });
});

module.exports = router;
