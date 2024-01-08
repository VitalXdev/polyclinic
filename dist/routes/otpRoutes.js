"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const otpController_1 = require("../controllers/otpController");
const router = (0, express_1.Router)();
router.post('/generateOTP', otpController_1.sendOTP);
router.post('/verifyOTP', otpController_1.verifyOTPHandler); // Now points to the correct handler for just verifying OTP
router.post('/verifyUserOTP', otpController_1.verifyUserOTP); // Use this for verifying OTP and returning the user object
exports.default = router;
