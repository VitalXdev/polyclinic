import { AppDataSource } from "../datasource";
import { OTP } from "../entity/Otp";
import { MoreThanOrEqual } from "typeorm";


export const generateOTP = (): string => {
    return Math.floor(1000 + Math.random() * 9000).toString();
};

export const storeOTP = async (phoneNumber: string, otp: string): Promise<void> => {
    const otpRepository = AppDataSource.getRepository(OTP);
    const newOtp = otpRepository.create({
        mobile_number: phoneNumber,
        otp_sent: otp,
        created_at: new Date(),
        expires_at: new Date(new Date().getTime() + 5 * 60000), // Expires in 5 minutes
    });
    await otpRepository.save(newOtp);
};

export const verifyOTP = async (phoneNumber: string, otp: string): Promise<boolean> => {
    const otpRepository = AppDataSource.getRepository(OTP);
    const foundOtp = await otpRepository.findOneBy({
        mobile_number: phoneNumber,
        otp_sent: otp,
        expires_at: MoreThanOrEqual(new Date()) // Use MoreThanOrEqual from "typeorm"
    });

    if (foundOtp) {
        // If OTP is found and not expired, set validated to true
        foundOtp.validated = true;
        await otpRepository.save(foundOtp);
        return true;
    }

    return false;
};