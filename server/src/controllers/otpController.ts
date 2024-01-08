import { Request, Response } from "express";
import { storeOTP, generateOTP, verifyOTP } from "../services/otpService";
import { AppDataSource } from "../datasource";
import { User } from "../entity/User";
import { OTP } from "../entity/Otp";
import { ContactInfo } from "../entity/ContactInfo";
import { Staff } from "../entity/Staff";
import { Doctor } from "../entity/Doctor";
const jwt = require('jsonwebtoken');
import { MoreThanOrEqual } from "typeorm";
import axios from 'axios';

interface AuthPayload {
    user_id: number;
    role: number;
    doctor_id?: number; // Optional property
    doctor_name?: string; // Optional property
  }

export const sendOTP = async (req: Request, res: Response): Promise<void> => {
    const { phoneNumber } = req.body;
    const otp = generateOTP();
    console.log('number entered: ',phoneNumber);
    try {
        await storeOTP(phoneNumber, otp);
        // Replace this with your actual SMS service
        const url = `http://control.yourbulksms.com/api/sendhttp.php?authkey=39306c4031323332303650&mobiles=91${phoneNumber}&message=OTP ${otp} ERP login : VITALX EVOKES&sender=URBLKM&route=2&country=91&DLT_TE_ID=1707169641090797992`;
        const response = await axios.get(url);
        console.log(response);
        // await axios.get(url);
        res.json({ success: true, message: "OTP sent successfully." });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error sending OTP');
    }
};

export const verifyUserOTP = async (req: Request, res: Response): Promise<void> => {
    const { phoneNumber, otp } = req.body;

    try {
        const isValid = await verifyOTP(phoneNumber, otp);
        if (isValid) {
            // Find the ContactInfo by phone number
            const contactInfoRepository = AppDataSource.getRepository(ContactInfo);
            const contactInfo = await contactInfoRepository.findOne({
                where: { primary_phone_number: phoneNumber }
            });

            if (!contactInfo) {
                res.status(404).json({ success: false, message: "User not found" });
                return;
            }

            // Find the User by contact_info_id
            const userRepository = AppDataSource.getRepository(User);
            const user = await userRepository.findOne({
                where: { contact_info_id: contactInfo.contact_info_id }
            });

            if (!user) {
                res.status(404).json({ success: false, message: "User not found" });
                return;
            }

            // Find the Staff by user_id to get the role
            const staffRepository = AppDataSource.getRepository(Staff);
            const staffMember = await staffRepository.findOne({
                where: { user_id: user.user_id }
            });

            if (!staffMember) {
                res.status(404).json({ success: false, message: "Staff member not found" });
                return;
            }

            let payload: AuthPayload = { user_id: user.user_id, role: staffMember.role };

            // If the user's role is 'doctor', find their doctor details
            if (staffMember.role === 2) { // Assuming 2 represents a doctor
                const doctorRepository = AppDataSource.getRepository(Doctor);
                const doctor = await doctorRepository.findOne({
                    where: { user_id: user.user_id }
                });

                if (doctor) {
                    payload.doctor_id = doctor.doctor_id;
                    // payload.doctor_name = doctor.name;  //we need to add name to doctor table as well.
                }
            }

            // Generate a JWT token for the user
            const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

            // Respond with token and user role
            res.json({ success: true, token, role: staffMember.role });
        } else {
            res.status(400).json({ success: false, message: "Invalid OTP" });
        }
    } catch (error) {
        console.error('Error verifying OTP:', error);
        res.status(500).send('Server error');
    }
};

export const verifyOTPHandler = async (req: Request, res: Response): Promise<void> => {
    const { phoneNumber, otp } = req.body;
    try {
        const isValid = await verifyOTP(phoneNumber, otp);
        if (isValid) {
            res.json({ success: true, message: "OTP verified successfully." });
        } else {
            res.status(400).json({ success: false, message: "Invalid OTP" });
        }
    } catch (error) {
        console.error('Error verifying OTP:', error);
        res.status(500).send('Server error');
    }
};