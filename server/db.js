const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  user: process.env.PGUSER,
  host: process.env.PGHOST,
  database: process.env.PGDATABASE,
  password: process.env.PGPASSWORD,
  port: process.env.PGPORT
});

const insertPatient = async (patientName, patientAge, patientWeight, patientContactNumber, gender) => {
  const res = await pool.query(
    'INSERT INTO Patient(patient_name, patient_age, patient_weight, patient_contact_number, gender) VALUES($1, $2, $3, $4, $5) RETURNING *',
    [patientName, patientAge, patientWeight, patientContactNumber, gender]
  );
  return res.rows[0];
};

const insertUserDetails=async (doctor_name,contactid)=>{
  const res=await pool.query(
   'INSERT INTO public.User (name,contact_info_id) VALUES ($1,$2) RETURNING user_id',
   [doctor_name,contactid]
  );
  return res.rows[0];
 }
 
const getDoctorIdFromUserId = async (userId) => {
  const res = await pool.query(
    'SELECT doctor_id FROM doctor WHERE user_id = $1',
    [userId]
  );
  return res.rows[0].doctor_id;
};

const getDoctorNameFromDoctorId = async (doctorId) => {
  const res = await pool.query(
    'SELECT doctor_name FROM doctor WHERE doctor_id = $1',
    [doctorId]
  );
  return res.rows[0].doctor_name;
};

const getTodaysAppointments = async (userId, date = new Date()) => {
  // Convert server time (GMT) to IST (GMT+5:30)
  const istOffset = 5.5 * 60 * 60 * 1000; // 5.5 hours in milliseconds
  const istDate = new Date(date.getTime() + istOffset);

  // Format the date for the query
  const formattedDate = istDate.toISOString().split('T')[0]; // IST date in 'YYYY-MM-DD' format

  // Log the adjusted IST date for verification
  console.log('Fetching appointments for IST date:', formattedDate);

  const doctorId = await getDoctorIdFromUserId(userId);

  const query = `
    SELECT
      a.appointment_id,
      CONCAT(p.patient_name, ', ', p.patient_age, 'y, ', p.gender) AS patient_details,
      a.status,
      ROW_NUMBER() OVER (PARTITION BY a.date_time::date ORDER BY a.date_time ASC) AS seq_no
    FROM
      appointment a
      JOIN patient p ON a.patient_id = p.patient_id
    WHERE
      a.doctor_id = $1 AND a.date_time::date = $2
    ORDER BY
      a.date_time ASC;
  `;

  const values = [doctorId, formattedDate];

  try {
    const res = await pool.query(query, values);
    return res.rows.map((row) => ({
      seq_no: row.seq_no,
      patient_details: row.patient_details,
      status: row.status === 0 ? 'Waiting' : row.status === 1 ? 'In Progress' : 'Completed'
    }));
  } catch (err) {
    console.error('Error fetching appointments:', err);
    throw err;
  }
};


const getNextAppointmentNumber = async (doctorId) => {
  const currentDate = new Date().toISOString().slice(0, 10);
  const res = await pool.query(
    'SELECT COUNT(*) FROM Appointment WHERE doctor_id = $1 AND date_time::date = $2',
    [doctorId, currentDate]
  );
  const nextNumber = parseInt(res.rows[0].count) + 1;
  console.log(currentDate);
  return nextNumber;
}

const insertAppointment = async (patientId, doctorId) => {
  const appointmentNumber = await getNextAppointmentNumber(doctorId);
  const res = await pool.query(
    'INSERT INTO Appointment(patient_id, doctor_id, date_time, status, appointment_number) VALUES($1, $2, NOW(), 0, $3) RETURNING *',
    [patientId, doctorId, appointmentNumber]
  );

  const waitingAppointmentsCount = await pool.query(
    'SELECT COUNT(*) FROM Appointment WHERE doctor_id = $1 AND status = 0 AND appointment_number < $2',
    [doctorId, appointmentNumber]
  );

  return {
    appointment: res.rows[0],
    peopleAhead: parseInt(waitingAppointmentsCount.rows[0].count, 10)
  };
};

const getPatientsByDoctorId = async (doctorId) => {
  const query = `
    SELECT 
      p.patient_id,
      p.patient_name,
      p.patient_age,
      p.patient_weight,
      p.patient_contact_number,
      p.gender,
      MAX(a.date_time) as last_appointment
    FROM 
      patient p
      JOIN appointment a ON p.patient_id = a.patient_id
    WHERE 
      a.doctor_id = $1
    GROUP BY 
      p.patient_id
    ORDER BY 
      last_appointment DESC;
  `;

  try {
    const { rows } = await pool.query(query, [doctorId]);
    return rows;
  } catch (error) {
    console.error('Error in getPatientsByDoctorId:', error);
    throw error;
  }
};


const findUserByPhoneNumber = async (phoneNumber) => {
  const query = 'SELECT * FROM users WHERE phone_number = $1';
  const { rows } = await pool.query(query, [phoneNumber]);
  return rows[0]; // This will be undefined if the user is not found
};

const storeOTP = async (phoneNumber, otp) => {
  const query = `
    INSERT INTO otp (mobile_number, otp_sent, created_at, expires_at) 
    VALUES (
      $1, 
      $2, 
      CURRENT_TIMESTAMP,
      CURRENT_TIMESTAMP + INTERVAL '5 minutes' 
    )
  `;
  await pool.query(query, [phoneNumber, otp]);
};



const verifyOTP = async (phoneNumber, otp) => {
  const query = `
    SELECT otp_sent 
    FROM otp 
    WHERE mobile_number = $1 
      AND expires_at > CURRENT_TIMESTAMP
  `;

  const { rows } = await pool.query(query, [phoneNumber]);

  if (rows.length > 0 && rows[0].otp_sent === otp) {
    const updateQuery = 'UPDATE otp SET validated = TRUE WHERE mobile_number = $1';
    await pool.query(updateQuery, [phoneNumber]);
    return true; // OTP is correct and mobile number is now verified
  } else {
    return false; // OTP is incorrect or expired
  }
};

const findPatientByContactNumber = async (contactNumber) => {
  const res = await pool.query(
    'SELECT * FROM Contact_info WHERE primary_phone_number = $1',
    [contactNumber]
  );
  return res.rows[0]; // Returns undefined if no patient is found
};

const updateDoctorQRCode = async (doctorId, qrCodeUrl) => {
  await pool.query('UPDATE Doctor SET qr_code_url = $1 WHERE doctor_id = $2', [qrCodeUrl, doctorId]);
};

const insertDoctor = async (userId, contactId) => {
  // Insert data to Doctor Table
  const insertRes = await pool.query(
    'INSERT INTO Doctor(user_id, doctor_contact_info_id ) VALUES($1, $2) RETURNING doctor_id',
    [userId, contactId]
  );
  return insertRes.rows[0]; 
};

const getPeopleAheadCount = async (appointmentNumber, doctorId) => {
  const result = await pool.query(
    'SELECT COUNT(*) FROM Appointment WHERE doctor_id = $1 AND status = 0 AND appointment_number < $2',
    [doctorId, appointmentNumber]
  );
  return parseInt(result.rows[0].count, 10);
};

const insertUserContactInfo = async (phone_number,email) => {
  const res = await pool.query(
    'INSERT INTO Contact_info (primary_phone_number, primary_email_id) VALUES ($1, $2) RETURNING contact_info_id',
    [phone_number,email]
  );
  return res.rows[0];
};

const insertUserAuthentication = async (contact_info_id, hashedPassword) => {
  // Step 1: Derive contact_number from contact_info_id
  const contactInfoResult = await pool.query(
    'SELECT primary_phone_number FROM Contact_info WHERE contact_info_id = $1',
    [contact_info_id]
  );

  if (contactInfoResult.rows.length === 0) {
    // Handle the case where no contact info is found for the given ID
    throw new Error('Contact info not found for the provided ID');
  }

  const contact_number = contactInfoResult.rows[0].primary_phone_number;

  // Step 2: Find the last OTP and last_authenticated_at for the contact_number
  const otpResult = await pool.query(
    'SELECT otp_sent FROM Otp WHERE mobile_number = $1 ORDER BY created_at DESC LIMIT 1',
    [contact_number]
  );

  let lastOTP = null;
    // Check if there are any rows returned by the query
  if (otpResult.rows.length > 0) {
    lastOTP = otpResult.rows[0].otp_sent;
  } else {
    // Handle the case where no OTP is found for the given contact_number
    throw new Error('No OTP found for the provided contact_number');
  }  
  // Step 3: Insert authentication record with lastOTP and lastAuthenticatedAt
  await pool.query(
    'INSERT INTO Authentication (contact_info_id, last_otp, hashed_password) VALUES ($1, $2, $3)',
    [contact_info_id, lastOTP, hashedPassword]
  );
};

const insertUser = async (email, hashedPassword, role, phone_number, isMobileOTPAuthenticated) => {
  const res = await pool.query(
    'INSERT INTO users (email, hashed_password, role, phone_number, mobile_verified) VALUES ($1, $2, $3, $4, $5) RETURNING user_id, role',
    [email, hashedPassword, role, phone_number, isMobileOTPAuthenticated]
  );
  return res.rows[0];
};

const findUserByEmail = async (email) => {
  const res = await pool.query(
    'SELECT * FROM users WHERE email = $1',
    [email]
  );
  return res.rows[0];
};

// Set the status of the current patient to treated (2)
const setPatientStatusTreated = async (appointmentId) => {
  await pool.query(
    'UPDATE appointment SET status = 2 WHERE appointment_id = $1',
    [appointmentId]
  );
};

// Set the status of the next patient in the queue to being treated (1)
const setNextPatientStatus = async (doctorId) => {
  const res = await pool.query(
    `SELECT appointment_id FROM appointment
     WHERE doctor_id = $1 AND status = 0
     ORDER BY date_time ASC LIMIT 1`,
    [doctorId]
  );

  const nextAppointmentId = res.rows[0]?.appointment_id;
  if (nextAppointmentId) {
    await pool.query(
      'UPDATE appointment SET status = 1 WHERE appointment_id = $1',
      [nextAppointmentId]
    );
  }

  return nextAppointmentId; // Return this for confirmation or further processing if needed
};

const updateAppointmentStatus = async (appointmentId, newStatus) => {
  console.log('lo: ',appointmentId, newStatus);
  const query = 'UPDATE appointment SET status = $1 WHERE appointment_number = $2';
  await pool.query(query, [newStatus, appointmentId]);
};


const updateAppointmentStatuses = async (doctorId) => {
  await pool.query('BEGIN'); // Start a transaction

  try {
    // Get the current date in a format compatible with your database
    const currentDate = new Date().toISOString().split('T')[0];

    // Set the status of the currently being treated appointment to treated (2)
    await pool.query(
      `UPDATE appointment SET status = 2 
      WHERE appointment_id = (
        SELECT appointment_id FROM appointment
        WHERE doctor_id = $1 AND status = 1 AND date_time::date = $2
        ORDER BY date_time ASC LIMIT 1
      )`, [doctorId, currentDate]
    );

    // Set the status of the next appointment in the queue to being treated (1)
    const res = await pool.query(
      `UPDATE appointment SET status = 1 
      WHERE appointment_id = (
        SELECT appointment_id FROM appointment
        WHERE doctor_id = $1 AND status = 0 AND date_time::date = $2
        ORDER BY date_time ASC LIMIT 1
      ) RETURNING appointment_id`, [doctorId, currentDate]
    );

    await pool.query('COMMIT'); // Commit the transaction if successful

    const nextAppointmentId = res.rows[0]?.appointment_id;
    return nextAppointmentId || null; // Return the next appointment ID, or null if no more appointments
  } catch (err) {
    await pool.query('ROLLBACK'); // Roll back the transaction on error
    throw err; // Re-throw the error to be handled in the route
  }
};





module.exports = { insertPatient,getTodaysAppointments,getPatientsByDoctorId, updateAppointmentStatus,insertAppointment, findPatientByContactNumber, insertDoctor, updateDoctorQRCode,insertUser, findUserByEmail, setNextPatientStatus ,setPatientStatusTreated,getDoctorIdFromUserId,updateAppointmentStatuses, getPeopleAheadCount, storeOTP, verifyOTP, findUserByPhoneNumber, getDoctorNameFromDoctorId, insertUserContactInfo, insertUserAuthentication, insertUserDetails};
