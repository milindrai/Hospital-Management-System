require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

// Require route handlers
const patientRoutes = require('./routes/patientRoutes');
const visitRoutes = require('./routes/visitRoutes');

// Use route handlers
app.use('/patient', patientRoutes);
app.use('/visit', visitRoutes);

// Start server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
