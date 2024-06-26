const express = require('express');
const router = express.Router();
const db = require('../db');
const authenticateToken = require('../authMiddleware');

// Use the authenticateToken middleware
router.use(authenticateToken);

router.post('/patient/create', (req, res) => {
    if (req.user.role !== 'admin' && req.user.role !== 'user') {
        return res.status(403).json({ message: 'Access denied' });
    }

    const { name, hospital_id, disease_id, doctor_id } = req.body;

    if (!name || !hospital_id || !disease_id || !doctor_id ) {
        return res.status(400).json({ message: 'Please provide patient name, hospital_id, disease_id and doctor_id.' });
    }

    db.query('INSERT INTO patients (patient_name, hospital_id, disease_id, doctor_id, status) VALUES (?, ?, ?, ?, ?)',
        [name, hospital_id, disease_id, doctor_id, 'primary_check'],
        (err, result) => {
            if (err) {
                return res.status(500).json({ message: 'Failed to create patient' });
            }

            const patientNumber = result.insertId;
            res.json({ message: 'Patient created', patient_number: patientNumber });
        });
});

router.put('/patient/update/:id/status', (req, res) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Access denied' });
    }

    const patientId = req.params.id;
    const { status } = req.body;
    if (!status) {
        return res.status(400).json({ message: 'Please provide current status to update' });
    }

    db.query('UPDATE patients SET status = ? WHERE patient_id = ?', [status, patientId], (err, result) => {
        if (err) {
            console.error('Error updating patient status:', err);
            return res.status(500).json({ message: 'Failed to update patient status' });
        }

        res.json({ message: 'Patient status updated', patient_id: patientId });
    });
});

router.put('/visit/update/:id', (req, res) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Access denied' });
    }

    const patientId = req.params.id;
    const { visit_date, remarks } = req.body;
    if (!visit_date || !remarks) {
        return res.status(400).json({ message: 'Please provide visit_date and remarks' });
    }

    db.query('INSERT INTO visits (patient_id, visit_date, remarks) VALUES (?, ?, ?)',
        [patientId, visit_date, remarks],
        (err, result) => {
            if (err) {
                console.error('Error inserting visit details:', err);
                return res.status(500).json({ message: 'Failed to update patient visits' });
            }

            res.json({ message: 'Patient visits updated', visit_id: result.insertId });
        });
});

router.post('/staff', (req, res) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Access denied' });
    }

    const { name, role, contact } = req.body;

    if (!name || !role || !contact) {
        return res.status(400).json({ message: 'Please provide name, role, and contact.' });
    }

    db.query('INSERT INTO staff (name, role, contact) VALUES (?, ?, ?)',
        [name, role, contact],
        (err, result) => {
            if (err) {
                console.error('Error adding staff:', err);
                return res.status(500).json({ message: 'Failed to add staff' });
            }

            res.json({ message: 'Staff added', staff_id: result.insertId });
        });
});

router.put('/staff/:staff_id', (req, res) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Access denied, admin role required' });
    }

    const staffId = req.params.staff_id;
    const { name, role, contact } = req.body;

    if (!name || !role || !contact) {
        return res.status(400).json({ message: 'Please provide name, role, and contact.' });
    }

    db.query('UPDATE staff SET name = ?, role = ?, contact = ? WHERE staff_id = ?',
        [name, role, contact, staffId],
        (err, result) => {
            if (err) {
                console.error('Error updating staff:', err);
                return res.status(500).json({ message: 'Failed to update staff' });
            }

            res.json({ message: 'Staff details updated' });
        });
});

router.get('/staff', (req, res) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Access denied' });
    }

    db.query('SELECT * FROM staff', (err, results) => {
        if (err) {
            console.error('Error querying staff:', err);
            return res.status(500).json({ message: 'Failed to retrieve staff' });
        }

        res.json(results);
    });
});

router.delete('/staff/:staff_id', (req, res) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Access denied' });
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
