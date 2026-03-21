# MediCare - Online Appointment Booking System

A full-stack project built with HTML, CSS, JavaScript, Node.js, Express, and MySQL. It features a premium, responsive glassmorphic UI design.

## Prerequisites
- Node.js installed
- MySQL Server installed and running

## Getting Started

1. **Database Setup:**
   - Open your MySQL client (e.g., MySQL Workbench, phpMyAdmin, or CLI) and run the `database.sql` script to create the `appointment_db` database, tables, and seed the doctors data.
   - Open the `.env` file in the project folder and update your MySQL credentials (especially `DB_PASSWORD` if you have one for your `root` user).

2. **Install Dependencies:**
   - If you haven't already, run `npm install` in your terminal to install Express, MySQL2, CORS, and Dotenv.

3. **Starting the Server:**
   - In your terminal, run `node server.js`
   - You should see "Successfully connected to MySQL database" and "Server running at http://localhost:3000".

4. **Using the Application:**
   - **Patient Booking Page:** Open [http://localhost:3000](http://localhost:3000) in your browser to book an appointment.
   - **Admin Dashboard:** Open [http://localhost:3000/admin.html](http://localhost:3000/admin.html) in your browser to view and manage appointments.
