"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerUser = void 0;
const jwt = require('jsonwebtoken');
const userService_1 = require("../services/userService");
const registerUser = async (req, res) => {
    const { email, password, role, doctor_name, clinic_name, phone_number } = req.body;
    try {
        const contact = await (0, userService_1.insertUserContactInfo)(phone_number, email);
        await (0, userService_1.insertUserAuthentication)(contact.contact_info_id, password);
        const newUser = await (0, userService_1.insertUserDetails)(doctor_name, contact.contact_info_id);
        const newClinic = await (0, userService_1.insertClinicDetails)(clinic_name, contact.contact_info_id);
        let roleNum;
        let newDoctor = null;
        if (role === 'doctor') {
            newDoctor = await (0, userService_1.insertDoctorData)(newUser.user_id, contact.contact_info_id);
            roleNum = 1; // Assuming 1 represents a doctor
        }
        else {
            roleNum = 2; // Assuming 2 represents other roles
        }
        const newStaff = await (0, userService_1.insertStaffDetails)(newUser.user_id, newClinic.clinic_id, roleNum);
        const tokenPayload = {
            user_id: newUser.user_id,
            role: role,
            doctor_id: newDoctor ? newDoctor.doctor_id : null,
            doctor_name: doctor_name
        };
        const token = jwt.sign(tokenPayload, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.status(201).json({ token, newUser, newDoctor });
    }
    catch (error) {
        console.error('Registration error:', error);
        res.status(500).send('Server error');
    }
};
exports.registerUser = registerUser;
