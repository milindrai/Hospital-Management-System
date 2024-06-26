require('dotenv').config();
require("./db");
const express = require('express');
const bodyParser = require('body-parser');
const app = express();

const port = process.env.PORT;

app.use(bodyParser.json());

// Require route handlers
const patientRoutes = require('./routes/patientRoutes');
const visitRoutes = require('./routes/visitRoutes');
const authRoutes = require('./routes/authRoutes');

// Use route handlers
app.use('/patient', patientRoutes);
app.use('/visit', visitRoutes);
app.use('/auth', authRoutes); 

// Start server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
