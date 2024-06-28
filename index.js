require('dotenv').config();
require("./db");
const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const authenticateToken = require('./authMiddleware');
const app = express();

const port = process.env.PORT;

app.use(bodyParser.json());
app.use(cookieParser());

// Require route handlers
const patientRoutes = require('./routes/patientRoutes');
const visitRoutes = require('./routes/visitRoutes');
const authRoutes = require('./routes/authRoutes');
const appointmentRoutes = require('./routes/appointmentRoutes');
const prescriptionRoutes = require('./routes/prescriptionRoutes');
const adminRoutes = require('./routes/adminRoutes');

// Use route handlers
app.use('/patient', authenticateToken, patientRoutes);
app.use('/visit', authenticateToken, visitRoutes);
app.use('/auth', authRoutes);
app.use('/appointments', authenticateToken, appointmentRoutes);
app.use('/prescriptions', authenticateToken, prescriptionRoutes);
app.use('/admin', authenticateToken, adminRoutes);


// Start server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
