const API_URL = 'http://localhost:3000/api';

// On Document Load
document.addEventListener('DOMContentLoaded', () => {
    // If we are on the booking page
    if (document.getElementById('appointmentForm')) {
        loadDoctors();
        document.getElementById('appointmentForm').addEventListener('submit', handleBookingSubmit);
        
        // Suggest today's date slightly modified
        const todayObj = new Date();
        const todayStr = todayObj.toISOString().split('T')[0];
        const nextYearObj = new Date();
        nextYearObj.setFullYear(todayObj.getFullYear() + 1);
        const nextYearStr = nextYearObj.toISOString().split('T')[0];
        
        const appointmentDate = document.getElementById('appointmentDate');
        if (appointmentDate) {
            appointmentDate.setAttribute('min', todayStr);
            appointmentDate.setAttribute('max', nextYearStr);
        }
    }

    // If we are on the admin page
    if (document.getElementById('appointmentsTableBody')) {
        const doctorId = localStorage.getItem('doctorId');
        if (!doctorId) {
            window.location.href = 'login.html';
            return;
        }
        const doctorNameDisplay = document.getElementById('doctorNameDisplay');
        if (doctorNameDisplay) doctorNameDisplay.textContent = localStorage.getItem('doctorName');
        
        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', (e) => {
                e.preventDefault();
                localStorage.removeItem('doctorId');
                localStorage.removeItem('doctorName');
                window.location.href = 'login.html';
            });
        }
        loadAppointments();
    }
    
    // If we are on the login page
    if (document.getElementById('loginForm')) {
        document.getElementById('loginForm').addEventListener('submit', handleLoginSubmit);
        
        const togglePassword = document.getElementById('togglePassword');
        const passwordInput = document.getElementById('password');
        if (togglePassword && passwordInput) {
            togglePassword.addEventListener('click', () => {
                const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
                passwordInput.setAttribute('type', type);
                togglePassword.classList.toggle('fa-eye');
                togglePassword.classList.toggle('fa-eye-slash');
            });
        }
    }
});

// --- Booking Logic (index.html) ---

async function loadDoctors() {
    try {
        const response = await fetch(`${API_URL}/doctors`);
        if (!response.ok) throw new Error('Failed to fetch doctors');
        
        const doctors = await response.json();
        const doctorSelect = document.getElementById('doctorId');
        
        doctorSelect.innerHTML = '<option value="" disabled selected>Select doctor</option>';
        doctors.forEach(doctor => {
            const option = document.createElement('option');
            option.value = doctor.id;
            option.textContent = `${doctor.name} - ${doctor.specialization}`;
            doctorSelect.appendChild(option);
        });
    } catch (error) {
        console.error(error);
        const doctorSelect = document.getElementById('doctorId');
        if (doctorSelect) {
            doctorSelect.innerHTML = '<option value="" disabled>Error loading doctors</option>';
        }
    }
}

async function handleBookingSubmit(e) {
    e.preventDefault();
    
    const form = e.target;
    const submitBtn = document.getElementById('submitBtn');
    const msgDiv = document.getElementById('formMessage');
    
    const nameInput = document.getElementById('patientName');
    const phoneInput = document.getElementById('patientPhone');
    const doctorInput = document.getElementById('doctorId');
    const dateInput = document.getElementById('appointmentDate');
    const timeInput = document.getElementById('timeSlot');
    
    const nameError = document.getElementById('nameError');
    const phoneError = document.getElementById('phoneError');
    const doctorError = document.getElementById('doctorError');
    const dateError = document.getElementById('dateError');
    const timeError = document.getElementById('timeError');
    let isValid = true;

    [nameInput, phoneInput, doctorInput, dateInput, timeInput].forEach(el => el.classList.remove('input-invalid'));
    [nameError, phoneError, doctorError, dateError, timeError].forEach(el => el.textContent = '');

    if (!nameInput.value.trim()) {
        nameInput.classList.add('input-invalid');
        nameError.textContent = 'Name is required.';
        isValid = false;
    } else if (!/^[A-Za-z\s]+$/.test(nameInput.value)) {
        nameInput.classList.add('input-invalid');
        nameError.textContent = 'Please enter a valid name (letters only).';
        isValid = false;
    }

    const phoneRaw = phoneInput.value.replace(/\s/g, '');
    if (!phoneRaw) {
        phoneInput.classList.add('input-invalid');
        phoneError.textContent = 'Phone number is required.';
        isValid = false;
    } else if (!/^[0-9]{10}$/.test(phoneRaw)) {
        phoneInput.classList.add('input-invalid');
        phoneError.textContent = 'Please enter exactly a 10-digit phone number.';
        isValid = false;
    }

    if (!doctorInput.value) {
        doctorInput.classList.add('input-invalid');
        doctorError.textContent = 'Please select a doctor.';
        isValid = false;
    }

    if (!dateInput.value) {
        dateInput.classList.add('input-invalid');
        dateError.textContent = 'Please select a date.';
        isValid = false;
    } else {
        const selectedDate = new Date(dateInput.value);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const nextYear = new Date();
        nextYear.setFullYear(today.getFullYear() + 1);
        nextYear.setHours(0, 0, 0, 0);

        if (selectedDate < today) {
            dateInput.classList.add('input-invalid');
            dateError.textContent = 'Appointment date cannot be in the past.';
            isValid = false;
        } else if (selectedDate > nextYear) {
            dateInput.classList.add('input-invalid');
            dateError.textContent = 'You cannot book an appointment more than a year in advance.';
            isValid = false;
        }
    }

    if (!timeInput.value) {
        timeInput.classList.add('input-invalid');
        timeError.textContent = 'Please select a time slot.';
        isValid = false;
    }

    if (!isValid) return;

    // UI Loading state
    submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Booking...';
    submitBtn.disabled = true;
    msgDiv.className = 'message hidden';

    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    try {
        const response = await fetch(`${API_URL}/appointments`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        const result = await response.json();

        if (response.ok) {
            msgDiv.textContent = 'Appointment booked successfully!';
            msgDiv.className = 'message msg-success';
            form.reset();
        } else {
            msgDiv.textContent = result.error || 'Failed to book appointment';
            msgDiv.className = 'message msg-error';
        }
    } catch (error) {
        console.error(error);
        msgDiv.textContent = 'Network error. Please try again.';
        msgDiv.className = 'message msg-error';
    } finally {
        submitBtn.innerHTML = 'Confirm Booking <i class="fa-solid fa-arrow-right"></i>';
        submitBtn.disabled = false;
    }
}


// --- Admin Logic (admin.html) ---

async function loadAppointments() {
    const tbody = document.getElementById('appointmentsTableBody');
    if (!tbody) return;

    tbody.innerHTML = '<tr><td colspan="7" class="text-center py-4"><i class="fa-solid fa-spinner fa-spin"></i> Loading...</td></tr>';

    try {
        const doctorId = localStorage.getItem('doctorId');
        const response = await fetch(`${API_URL}/appointments?doctorId=${doctorId}`);
        if (!response.ok) throw new Error('Failed to fetch appointments');
        
        const appointments = await response.json();
        
        // Update stats
        document.getElementById('totalAppt').textContent = appointments.length;
        document.getElementById('pendingAppt').textContent = appointments.filter(a => a.status === 'Pending').length;
        document.getElementById('completedAppt').textContent = appointments.filter(a => a.status === 'Completed').length;

        tbody.innerHTML = '';

        if (appointments.length === 0) {
            tbody.innerHTML = '<tr><td colspan="7" class="text-center py-4">No appointments found.</td></tr>';
            return;
        }

        appointments.forEach(appt => {
            const tr = document.createElement('tr');
            
            // Badge logic
            let badgeClass = '';
            switch(appt.status) {
                case 'Pending': badgeClass = 'badge-pending'; break;
                case 'Approved': badgeClass = 'badge-approved'; break;
                case 'Completed': badgeClass = 'badge-completed'; break;
                case 'Cancelled': badgeClass = 'badge-cancelled'; break;
            }

            let actionHtml = '';
            if (appt.status === 'Pending') {
                actionHtml += `<button class="btn-icon btn-approve" title="Approve" onclick="updateStatus(${appt.id}, 'Approved')"><i class="fa-solid fa-check"></i></button> `;
            }
            if (appt.status === 'Pending' || appt.status === 'Approved') {
                actionHtml += `<button class="btn-icon btn-complete" title="Mark Completed" onclick="updateStatus(${appt.id}, 'Completed')"><i class="fa-solid fa-check-double"></i></button> `;
            }
            if (appt.status !== 'Cancelled' && appt.status !== 'Completed') {
                actionHtml += `<button class="btn-icon btn-cancel" title="Cancel" onclick="updateStatus(${appt.id}, 'Cancelled')"><i class="fa-solid fa-xmark"></i></button>`;
            }

            tr.innerHTML = `
                <td>#${appt.id}</td>
                <td><strong>${appt.patient_name}</strong></td>
                <td>${appt.patient_phone}</td>
                <td>
                    <div style="font-weight: 500">${appt.doctor_name}</div>
                    <div style="font-size: 0.8rem; color: var(--text-muted)">${appt.specialization}</div>
                </td>
                <td>
                    <div>${appt.appointment_date}</div>
                    <div style="color: var(--accent); font-size: 0.85rem">${appt.time_slot}</div>
                </td>
                <td><span class="badges ${badgeClass}">${appt.status}</span></td>
                <td>
                    <div class="action-btns">
                        ${actionHtml}
                    </div>
                </td>
            `;
            tbody.appendChild(tr);
        });

    } catch (error) {
        console.error(error);
        tbody.innerHTML = '<tr><td colspan="7" class="text-center py-4 text-danger">Failed to load appointments.</td></tr>';
    }
}

async function updateStatus(id, newStatus) {
    if(!confirm(`Are you sure you want to mark appointment #${id} as ${newStatus}?`)) return;

    try {
        const response = await fetch(`${API_URL}/appointments/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status: newStatus })
        });

        if (response.ok) {
            loadAppointments(); // Refresh list
        } else {
            alert('Failed to update status');
        }
    } catch (error) {
        console.error(error);
        alert('Network error while updating status');
    }
}


// --- Login Logic (login.html) ---

async function handleLoginSubmit(e) {
    e.preventDefault();
    const form = e.target;
    const submitBtn = document.getElementById('loginSubmitBtn');
    const msgDiv = document.getElementById('formMessage');
    
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    const usernameError = document.getElementById('loginUsernameError');
    const passwordError = document.getElementById('loginPasswordError');
    let isValid = true;
    
    usernameInput.classList.remove('input-invalid');
    passwordInput.classList.remove('input-invalid');
    usernameError.textContent = '';
    passwordError.textContent = '';

    if (!usernameInput.value.trim()) {
        usernameInput.classList.add('input-invalid');
        usernameError.textContent = 'Username is required.';
        isValid = false;
    }
    if (!passwordInput.value.trim()) {
        passwordInput.classList.add('input-invalid');
        passwordError.textContent = 'Password is required.';
        isValid = false;
    }

    if (!isValid) return;

    submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Signing in...';
    submitBtn.disabled = true;
    msgDiv.className = 'message hidden';

    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    try {
        const response = await fetch(`${API_URL}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        const result = await response.json();

        if (response.ok) {
            msgDiv.textContent = 'Login successful! Redirecting...';
            msgDiv.className = 'message msg-success';
            localStorage.setItem('doctorId', result.doctor.id);
            localStorage.setItem('doctorName', result.doctor.name);
            setTimeout(() => window.location.href = 'admin.html', 1000);
        } else {
            msgDiv.textContent = result.error || 'Invalid credentials';
            msgDiv.className = 'message msg-error';
        }
    } catch (error) {
        console.error(error);
        msgDiv.textContent = 'Network error. Please try again.';
        msgDiv.className = 'message msg-error';
    } finally {
        submitBtn.innerHTML = 'Sign In <i class="fa-solid fa-right-to-bracket"></i>';
        submitBtn.disabled = false;
    }
}
