import { Router } from "express";
import { sendOTP, verifyOTPHandler, verifyUserOTP } from "../controllers/otpController";

const router = Router();

router.post('/generateOTP', sendOTP);
router.post('/verifyOTP', verifyOTPHandler); // Now points to the correct handler for just verifying OTP
router.post('/verifyUserOTP', verifyUserOTP); // Use this for verifying OTP and returning the user object

export default router;