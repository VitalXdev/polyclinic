const express = require('express');
const { insertPatient, getTodaysAppointments, insertAppointment, findPatientByContactNumber, insertDoctor, updateDoctorQRCode,insertUser, findUserByEmail } = require('./db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const app = express();
const cors = require('cors');
const port = process.env.PORT || 5001;
app.use(cors());
require('dotenv').config();

const corsOptions = {
  origin: ['http://localhost:3000', 'https://thriving-bonbon-27d691.netlify.app'],
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
};

app.use(cors(corsOptions));

app.use(express.json());

app.post('/register', async (req, res) => {
  try {
    const { patient_name, patient_age, patient_weight, patient_contact_number, doctor_id } = req.body;
    console.log("Request body:", req.body); // For debugging
    // Check if patient already exists
    let patient = await findPatientByContactNumber(patient_contact_number);

    if (!patient) {
      // If patient doesn't exist, create new patient
      patient = await insertPatient(patient_name, patient_age, patient_weight, patient_contact_number);
    }

    // Create a new appointment with doctorId
    const appointment = await insertAppointment(patient.patient_id, doctor_id);

    res.status(201).json({ patient, appointment });
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
});

app.post('/registerDoctor', async (req, res) => {
  try {
    const { doctor_name, clinic_name } = req.body;
    let doctor = await insertDoctor(doctor_name, clinic_name);

    // Generate QR code URL with doctor_id
    const qrCodeURL = `https://thriving-bonbon-27d691.netlify.app/?doctorId=${doctor.doctor_id}`;
    await updateDoctorQRCode(doctor.doctor_id, qrCodeURL);

    // Send updated doctor info, including QR code URL
    res.status(201).json({ doctor: {...doctor, qr_code_url: qrCodeURL} });
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
});

app.post('/auth/register', async (req, res) => {
  const { email, password, role, doctor_name, clinic_name } = req.body;
  try {
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert user and get user_id
    const user = await insertUser(email, hashedPassword, role);

    let doctor;
    if (role === 'doctor') {
      // Insert doctor and get doctor_id
      doctor = await insertDoctor(user.user_id, doctor_name, clinic_name);

      // Generate QR code URL with doctor_id
      const qrCodeURL = `https://thriving-bonbon-27d691.netlify.app/?doctorId=${doctor.doctor_id}`;
      await updateDoctorQRCode(doctor.doctor_id, qrCodeURL);

      doctor.qr_code_url = qrCodeURL;
    }

    // Create a token
    const token = jwt.sign({ user_id: user.user_id, role }, process.env.JWT_SECRET, { expiresIn: '1h' });

    // Respond with the token and user info
    res.status(201).json({ token, user, doctor }); // doctor will be undefined if role is not 'doctor'
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).send('Server error');
  }
});


app.post('/auth/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await findUserByEmail(email);
    if (user && await bcrypt.compare(password, user.hashed_password)) {
      const token = jwt.sign({ user_id: user.user_id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
      res.json({ token, role: user.role });
    } else {
      res.status(401).send('Invalid credentials');
    }
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).send('Server error');
  }
});


app.get('/', (req, res) => {
  res.send('Hello, VitalX!');
});

app.get('/appointments/today', async (req, res) => {
  const userId = req.query.userId; // Assuming you pass doctorId as a query parameter
  const date = req.query.date; // Optional: if a date is passed as a query parameter

  try {
    const appointments = await getTodaysAppointments(userId, date ? new Date(date) : undefined);
    res.json(appointments);
  } catch (error) {
    console.error('Error fetching appointments:', error);
    res.status(500).send('Server error');
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
