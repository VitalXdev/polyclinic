"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyOTP = exports.storeOTP = exports.generateOTP = void 0;
const datasource_1 = require("../datasource");
const Otp_1 = require("../entity/Otp");
const typeorm_1 = require("typeorm");
const generateOTP = () => {
    return Math.floor(1000 + Math.random() * 9000).toString();
};
exports.generateOTP = generateOTP;
const storeOTP = async (phoneNumber, otp) => {
    const otpRepository = datasource_1.AppDataSource.getRepository(Otp_1.OTP);
    const newOtp = otpRepository.create({
        mobile_number: phoneNumber,
        otp_sent: otp,
        created_at: new Date(),
        expires_at: new Date(new Date().getTime() + 5 * 60000), // Expires in 5 minutes
    });
    await otpRepository.save(newOtp);
};
exports.storeOTP = storeOTP;
const verifyOTP = async (phoneNumber, otp) => {
    const otpRepository = datasource_1.AppDataSource.getRepository(Otp_1.OTP);
    const foundOtp = await otpRepository.findOneBy({
        mobile_number: phoneNumber,
        otp_sent: otp,
        expires_at: (0, typeorm_1.MoreThanOrEqual)(new Date()) // Use MoreThanOrEqual from "typeorm"
    });
    if (foundOtp) {
        // If OTP is found and not expired, set validated to true
        foundOtp.validated = true;
        await otpRepository.save(foundOtp);
        return true;
    }
    return false;
};
exports.verifyOTP = verifyOTP;
