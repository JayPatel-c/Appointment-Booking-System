# Project ER Diagram

Below is the Entity-Relationship (ER) diagram for your Appointment Booking System, visualizing the connections between doctors and appointments.

```mermaid
erDiagram
    DOCTOR ||--o{ APPOINTMENT : "manages"

    DOCTOR {
        int id PK
        string name
        string specialization
        string username
        string password
    }

    APPOINTMENT {
        int id PK
        string patient_name
        string patient_phone
        int doctor_id FK "References DOCTOR.id"
        date appointment_date
        string time_slot
        enum status "Pending, Approved, Completed, Cancelled"
        timestamp created_at
    }
```

### Key Components

*   **Doctor Entity**: Stores professional details and login credentials for medical staff.
*   **Appointment Entity**: Captures patient details, scheduled time, and its link to a specific doctor.
*   **Relationship**: A **one-to-many (1:N)** relationship exists from `Doctors` to `Appointments`, as one doctor can manage multiple patient bookings.
