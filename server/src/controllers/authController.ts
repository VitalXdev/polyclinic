import { Doctor } from '../entity/Doctor';
import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
const jwt = require('jsonwebtoken');
import { 
  insertUserContactInfo, 
  insertUserAuthentication, 
  insertUserDetails,
  insertClinicDetails,
  insertDoctorData,
  insertStaffDetails
} from '../services/userService';


export const registerUser = async (req: Request, res: Response): Promise<void> => {
    const { email, password, role, doctor_name, clinic_name, phone_number } = req.body;
  
    try {
      const contact = await insertUserContactInfo(phone_number, email);
      await insertUserAuthentication(contact.contact_info_id, password);
      const newUser = await insertUserDetails(doctor_name, contact.contact_info_id);
      const newClinic = await insertClinicDetails(clinic_name, contact.contact_info_id);
  
      let roleNum;
      let newDoctor: Doctor | null = null;
      if (role === 'doctor') {
        newDoctor = await insertDoctorData(newUser.user_id, contact.contact_info_id);
        roleNum = 1; // Assuming 1 represents a doctor
      } else {
        roleNum = 2; // Assuming 2 represents other roles
      }
      const newStaff = await insertStaffDetails(newUser.user_id, newClinic.clinic_id, roleNum);
  
      const tokenPayload = {
        user_id: newUser.user_id,
        role: role,
        doctor_id: newDoctor ? newDoctor.doctor_id : null,
        doctor_name: doctor_name
      };
      const token = jwt.sign(tokenPayload, process.env.JWT_SECRET, { expiresIn: '1h' });
  
      res.status(201).json({ token, newUser, newDoctor });
    } catch (error) {
      console.error('Registration error:', error);
      res.status(500).send('Server error');
    }
  };