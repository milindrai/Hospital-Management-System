# Hospital Management System API

## Overview

The Hospital Management System API is designed to streamline the operations of a hospital by providing a comprehensive backend solution. Built using Node.js and Express.js, and leveraging a MySQL database, this API facilitates efficient management of patients, appointments, and access control based on user roles.

## API Endpoints

### User Management
- POST /signup: Register a new user.
- POST /login: Log in a user.
- POST /logout: Log out the current user.

### Patient Management
- POST /admin/patient/create: Create a new patient.
- GET /patient/status/:name: Retrieve patient details by name.
- PUT /admin/patient/update/:id/status: Update patient status.
- GET /patient/visits/:patient_id: Retrieve all visits for a patient. 

### Appointment Scheduling
- POST /appointments: Book a new appointment.
- PUT /appointments/:appointment_id: Update an appointment.
- DELETE /appointments/:appointment_id: Cancel an appointment.
- GET /appointments/:appointment_id: Retrieve details of a specific appointment.

### Prescription Management
- POST /prescriptions: Create a new prescription.
- PUT /prescriptions/:prescription_id: Update a prescription.

### Visit Management
- GET /visits/visit_id: Retrieve visit details.
- PUT /admin/visits/visit_id: Update visit details.

### Staff Management
- POST /admin/staff: Add a new staff member.
- PUT /admin/staff/:staff_id: Update staff details.
- GET /admin/staff
- DELETE /admin/staff/:staff_id:

## Technologies Used
- Node.js
- Express.js
- MySQL
- JSON Web Tokens (JWT) for authentication

## Setup Instructions

To get the project up and running on your local machine, follow these steps:

- **Clone the repository to your local machine.**
- **Install the dependencies by running `npm install`.**
- **Set up your MySQL database and ensure it is running.**
- **Create a `.env` file in the root directory and populate it with your database credentials and JWT secret key.**
- **Start the server with `npm start`.**
