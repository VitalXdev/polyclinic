const { Pool } = require('pg');

const pool = new Pool({
    user: process.env.PGUSER,
    host: process.env.PGHOST,
    database: process.env.PGDATABASE,
    password: process.env.PGPASSWORD,
    port: process.env.PGPORT || 5432, // Default to 5432 if DB_PORT is not set
  });

const insertPatient = async (patientName, patientAge, patientWeight, patientContactNumber) => {
  const res = await pool.query(
    'INSERT INTO Patient(patient_name, patient_age, patient_weight, patient_contact_number) VALUES($1, $2, $3, $4) RETURNING *',
    [patientName, patientAge, patientWeight, patientContactNumber]
  );
  return res.rows[0];
};

const insertAppointment = async (patientId) => {
  const res = await pool.query(
    'INSERT INTO Appointment(patient_id, date_time, status) VALUES($1, NOW(), 0) RETURNING *',
    [patientId]
  );
  return res.rows[0];
};

const findPatientByContactNumber = async (contactNumber) => {
    const res = await pool.query(
      'SELECT * FROM Patient WHERE patient_contact_number = $1',
      [contactNumber]
    );
    return res.rows[0]; // Returns undefined if no patient is found
};

const updateDoctorQRCode = async (doctorId, qrCodeUrl) => {
    await pool.query('UPDATE Doctor SET qr_code_url = $1 WHERE doctor_id = $2', [qrCodeUrl, doctorId]);
  };

const insertDoctor = async (doctorName, clinicName) => {
    // Generate QR Code URL
    // For simplicity, assuming doctor_id is known after insert, which is not usually the case
    // You would normally need to retrieve the doctor_id after insert
    const qrCodeURL = `http://localhost:3000/doctor/`; // Append doctor_id after insertion

    const res = await pool.query(
        'INSERT INTO Doctor(doctor_name, clinic_name, qr_code_url) VALUES($1, $2, $3) RETURNING *',
        [doctorName, clinicName, qrCodeURL]
    );

    return res.rows[0];
};

module.exports = { insertPatient, insertAppointment, findPatientByContactNumber, insertDoctor, updateDoctorQRCode };

