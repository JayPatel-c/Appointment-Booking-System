const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Create MySQL connection pool
const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'appointment_db',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Test Database Connection
pool.getConnection((err, connection) => {
    if (err) {
        console.error('Error connecting to MySQL database: ', err);
    } else {
        console.log('Successfully connected to MySQL database');

        // Auto-migration to add auth columns to existing database effortlessly
        connection.query("SHOW COLUMNS FROM doctors LIKE 'username'", (err, results) => {
            if (results && results.length === 0) {
                connection.query("ALTER TABLE doctors ADD COLUMN username VARCHAR(50) UNIQUE, ADD COLUMN password VARCHAR(100)", (err) => {
                    if (!err) {
                        connection.query("UPDATE doctors SET username = LOWER(SUBSTRING_INDEX(REPLACE(name, 'Dr. ', ''), ' ', 1)), password = 'password123'", () => {
                            console.log('Database auto-migrated: added default doctor login credentials (username=firstname, password=password123)');
                        });
                    }
                });
            }
        });

        connection.release();
    }
});

// API Routes

// Get all doctors
app.get('/api/doctors', (req, res) => {
    pool.query('SELECT * FROM doctors', (err, results) => {
        if (err) {
            console.error('Failed to fetch doctors:', err);
            return res.status(500).json({ error: 'Internal server error' });
        }
        res.json(results);
    });
});

// Book an appointment (Patient)
app.post('/api/appointments', (req, res) => {
    const { patient_name, patient_phone, doctor_id, appointment_date, time_slot } = req.body;

    if (!patient_name || !patient_phone || !doctor_id || !appointment_date || !time_slot) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    const query = `
        INSERT INTO appointments (patient_name, patient_phone, doctor_id, appointment_date, time_slot)
        VALUES (?, ?, ?, ?, ?)
    `;

    pool.query(query, [patient_name, patient_phone, doctor_id, appointment_date, time_slot], (err, result) => {
        if (err) {
            console.error('Failed to book appointment:', err);
            return res.status(500).json({ error: 'Failed to book appointment' });
        }
        res.status(201).json({ message: 'Appointment booked successfully', appointmentId: result.insertId });
    });
});

// Login (Doctor)
app.post('/api/login', (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) return res.status(400).json({ error: 'Username and password required' });

    pool.query('SELECT * FROM doctors WHERE username = ? AND password = ?', [username, password], (err, results) => {
        if (err) return res.status(500).json({ error: 'Internal server error' });
        if (results.length === 0) return res.status(401).json({ error: 'Invalid username or password' });

        const doctor = results[0];
        res.json({ message: 'Login successful', doctor: { id: doctor.id, name: doctor.name, specialization: doctor.specialization } });
    });
});

// Get all appointments (Admin)
app.get('/api/appointments', (req, res) => {
    const { doctorId } = req.query;
    let query = `
        SELECT a.id, a.patient_name, a.patient_phone, DATE_FORMAT(a.appointment_date, '%d-%m-%Y') as appointment_date, a.time_slot, a.status, d.name as doctor_name, d.specialization
        FROM appointments a
        JOIN doctors d ON a.doctor_id = d.id
    `;
    let queryParams = [];

    if (doctorId) {
        query += ` WHERE a.doctor_id = ? `;
        queryParams.push(doctorId);
    }

    query += ` ORDER BY a.appointment_date ASC, a.time_slot ASC `;

    pool.query(query, queryParams, (err, results) => {
        if (err) {
            console.error('Failed to fetch appointments:', err);
            return res.status(500).json({ error: 'Internal server error' });
        }
        res.json(results);
    });
});

// Update appointment status (Admin)
app.put('/api/appointments/:id', (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    if (!status || !['Pending', 'Approved', 'Completed', 'Cancelled'].includes(status)) {
        return res.status(400).json({ error: 'Invalid status' });
    }

    const query = 'UPDATE appointments SET status = ? WHERE id = ?';

    pool.query(query, [status, id], (err, result) => {
        if (err) {
            console.error('Failed to update appointment status:', err);
            return res.status(500).json({ error: 'Failed to update appointment status' });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Appointment not found' });
        }
        res.json({ message: 'Appointment status updated successfully' });
    });
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
