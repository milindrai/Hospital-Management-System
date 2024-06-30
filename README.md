# Hospital Management System API

## Overview

The Hospital Management System API is designed to streamline the operations of a hospital by providing a comprehensive backend solution. Built using Node.js and Express.js, and leveraging a MySQL database, this API facilitates efficient management of patients, staff, appointments, and medical records.

## Features

### Authentication and Authorization
- Secure user authentication and authorization using JWT tokens.
- Role-based access control for different user types (e.g., admin, doctor, patient).

### Patient Management
- Registration of new patients with comprehensive details.
- Retrieval of patient information including medical history and current status.
- Update operations for patient records to reflect changes in status or details.

### Staff Management
- Addition of new staff members with roles and contact information.
- Update and retrieval of staff details.

### Appointment Scheduling
- Creation and management of appointments for patients with doctors.
- Viewing and updating appointment details.

### Visit Records
- Recording and updating details of patient visits, including visit date and remarks.
- Retrieval of all visit records for a particular patient.

### Prescription Management
- Issuance of prescriptions to patients.
- Retrieval and update of prescription details.

## Technologies Used
- Node.js
- Express.js
- MySQL
- JSON Web Tokens (JWT) for authentication
- bcrypt for password hashing


## To get the project up and running on your local machine, follow these steps:

- **Clone the repository to your local machine.**
- **Install the dependencies by running `npm install`.**
- **Set up your MySQL database and ensure it is running.**
- **Create a `.env` file in the root directory and populate it with your database credentials and JWT secret key.**
- **Start the server with `npm start`.**
