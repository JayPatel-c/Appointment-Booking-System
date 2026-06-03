# 🏥 MediCare - Online Appointment Booking System

![NodeJS](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-404D59?style=for-the-badge)
![MySQL](https://img.shields.io/badge/MySQL-005C84?style=for-the-badge&logo=mysql&logoColor=white)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)

A premium, full-stack Patient Appointment Booking System featuring a responsive glassmorphic UI design. 
This application provides a seamless experience for patients to book appointments and for doctors/admins to manage them.

---

## ✨ Features

- **For Patients:**
  - Modern, intuitive, and responsive "Glassmorphism" UI.
  - Browse available doctors and specialties.
  - Book appointments easily in real-time.
- **For Doctors / Admins:**
  - Secure login portal.
  - Dashboard to view and manage upcoming appointments.
  - Real-time updates fetching data from the database.
- **Technical Highlights:**
  - RESTful API architecture.
  - Connection pooling for efficient database operations.
  - Environment variables for secure credential management.

---

## 🛠️ Tech Stack

- **Frontend:** HTML5, CSS3 (Vanilla), JavaScript
- **Backend:** Node.js, Express.js
- **Database:** MySQL
- **Other Tools:** CORS, Dotenv

---

## 🚀 Getting Started

Follow these instructions to set up and run the project on your local machine.

### Prerequisites

Ensure you have the following installed on your system:
- [Node.js](https://nodejs.org/) (v14 or higher recommended)
- [MySQL Server](https://dev.mysql.com/downloads/mysql/) installed and running

### 1. Database Setup

1. Open your MySQL client (e.g., MySQL Workbench, phpMyAdmin, or CLI).
2. Run the provided `database.sql` script. This will:
   - Create the `appointment_db` database.
   - Set up the necessary tables (`doctors`, `patients`, `appointments`).
   - Seed initial sample data.

### 2. Configure Environment Variables

1. Locate the `.env` file in the root directory (or create one if it's missing based on `.env.example`).
2. Update your MySQL credentials:
   ```env
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=your_mysql_password
   DB_NAME=appointment_db
   PORT=3000
   ```

### 3. Install Dependencies

Open your terminal in the project root directory and install the required Node modules:

```bash
npm install
```

### 4. Start the Application

Run the server using Node:

```bash
node server.js
```
*You should see terminal messages confirming successful database connection and the server running port.*

---

## 💻 Usage

- **Patient Booking Page:** Navigate to `http://localhost:3000` in your web browser.
- **Admin/Doctor Login:** Navigate to `http://localhost:3000/login.html` to access the secure portal.
- **Admin Dashboard:** Navigate to `http://localhost:3000/admin.html` (Requires login via the portal).

---

## 📂 Project Structure

```text
├── public/                 # Frontend static files (HTML, CSS, JS)
│   ├── index.html          # Patient booking UI
│   ├── login.html          # Doctor/Admin login page
│   ├── admin.html          # Doctor/Admin dashboard
│   ├── style.css           # Glassmorphic UI styles
│   └── script.js           # Frontend logic and API calls
├── server.js               # Express server and backend API routes
├── database.sql            # MySQL schema and initial seed data
├── .env                    # Environment variables (Credentials)
├── project_overview.md     # Detailed architectural documentation
└── package.json            # Node.js dependencies and scripts
```

---

*For an in-depth look at the architecture and how the frontend communicates with the backend, please see the [Project Overview](project_overview.md) and [ER Diagram](er_diagram.md).*
