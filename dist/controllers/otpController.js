"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyOTPHandler = exports.verifyUserOTP = exports.sendOTP = void 0;
const otpService_1 = require("../services/otpService");
const datasource_1 = require("../datasource");
const User_1 = require("../entity/User");
const ContactInfo_1 = require("../entity/ContactInfo");
const Staff_1 = require("../entity/Staff");
const Doctor_1 = require("../entity/Doctor");
const jwt = require('jsonwebtoken');
const axios_1 = __importDefault(require("axios"));
const sendOTP = async (req, res) => {
    const { phoneNumber } = req.body;
    const otp = (0, otpService_1.generateOTP)();
    console.log('number entered: ', phoneNumber);
    try {
        await (0, otpService_1.storeOTP)(phoneNumber, otp);
        // Replace this with your actual SMS service
        const url = `http://control.yourbulksms.com/api/sendhttp.php?authkey=39306c4031323332303650&mobiles=91${phoneNumber}&message=OTP ${otp} ERP login : VITALX EVOKES&sender=URBLKM&route=2&country=91&DLT_TE_ID=1707169641090797992`;
        const response = await axios_1.default.get(url);
        console.log(response);
        // await axios.get(url);
        res.json({ success: true, message: "OTP sent successfully." });
    }
    catch (error) {
        console.error(error);
        res.status(500).send('Error sending OTP');
    }
};
exports.sendOTP = sendOTP;
const verifyUserOTP = async (req, res) => {
    const { phoneNumber, otp } = req.body;
    try {
        const isValid = await (0, otpService_1.verifyOTP)(phoneNumber, otp);
        if (isValid) {
            // Find the ContactInfo by phone number
            const contactInfoRepository = datasource_1.AppDataSource.getRepository(ContactInfo_1.ContactInfo);
            const contactInfo = await contactInfoRepository.findOne({
                where: { primary_phone_number: phoneNumber }
            });
            if (!contactInfo) {
                res.status(404).json({ success: false, message: "User not found" });
                return;
            }
            // Find the User by contact_info_id
            const userRepository = datasource_1.AppDataSource.getRepository(User_1.User);
            const user = await userRepository.findOne({
                where: { contact_info_id: contactInfo.contact_info_id }
            });
            if (!user) {
                res.status(404).json({ success: false, message: "User not found" });
                return;
            }
            // Find the Staff by user_id to get the role
            const staffRepository = datasource_1.AppDataSource.getRepository(Staff_1.Staff);
            const staffMember = await staffRepository.findOne({
                where: { user_id: user.user_id }
            });
            if (!staffMember) {
                res.status(404).json({ success: false, message: "Staff member not found" });
                return;
            }
            let payload = { user_id: user.user_id, role: staffMember.role };
            // If the user's role is 'doctor', find their doctor details
            if (staffMember.role === 2) { // Assuming 2 represents a doctor
                const doctorRepository = datasource_1.AppDataSource.getRepository(Doctor_1.Doctor);
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
        }
        else {
            res.status(400).json({ success: false, message: "Invalid OTP" });
        }
    }
    catch (error) {
        console.error('Error verifying OTP:', error);
        res.status(500).send('Server error');
    }
};
exports.verifyUserOTP = verifyUserOTP;
const verifyOTPHandler = async (req, res) => {
    const { phoneNumber, otp } = req.body;
    try {
        const isValid = await (0, otpService_1.verifyOTP)(phoneNumber, otp);
        if (isValid) {
            res.json({ success: true, message: "OTP verified successfully." });
        }
        else {
            res.status(400).json({ success: false, message: "Invalid OTP" });
        }
    }
    catch (error) {
        console.error('Error verifying OTP:', error);
        res.status(500).send('Server error');
    }
};
exports.verifyOTPHandler = verifyOTPHandler;
