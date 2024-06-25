require('dotenv').config();


const express = require('express');
const mysql = require('mysql2');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const bodyParser = require('body-parser');

const app = express();
const port = process.env.PORT ;
const SECRET_KEY = process.env.JWT_SECRET ;

app.use(bodyParser.json());

// MySQL connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: 'signup_db'
});

db.connect(err => {
    if (err) throw err;
    console.log('MySQL connected...');
});

// API Endpoints

// Get current status of a patient by name
app.get('/patient/status/:name', (req, res) => {
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

// Get all hospital visits for a patient with details
app.get('/patient/visits/:name', (req, res) => {
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

// Create a new patient
app.post('/patient/create', (req, res) => {
    const { name, hospital_id, disease_id, doctor_id } = req.body;
    if (!name || !hospital_id || !disease_id || !doctor_id) {
        return res.status(400).json({ message: 'Please provide patient name, hospital_id, disease_id, and doctor_id.' });
    }

    db.query('INSERT INTO patients (patient_name, hospital_id, disease_id, doctor_id, status) VALUES (?, ?, ?, ?, ?)', 
        [name, hospital_id, disease_id, doctor_id, 'primary_check'], 
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
app.put('/patient/update/:id/status', (req, res) => {
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

// Update patient visits with remarks
app.put('/patient/update/:id/visits', (req, res) => {
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

// Start server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});




