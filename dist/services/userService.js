"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.insertStaffDetails = exports.insertDoctorData = exports.insertClinicDetails = exports.insertUserDetails = exports.insertUserAuthentication = exports.insertUserContactInfo = exports.findUserByPhoneNumber = void 0;
const datasource_1 = require("../datasource");
const bcrypt_1 = __importDefault(require("bcrypt"));
const User_1 = require("../entity/User");
const ContactInfo_1 = require("../entity/ContactInfo");
const Authentication_1 = require("../entity/Authentication");
const Clinic_1 = require("../entity/Clinic");
const Doctor_1 = require("../entity/Doctor");
const Staff_1 = require("../entity/Staff");
const findUserByPhoneNumber = async (phoneNumber) => {
    const contactInfoRepository = datasource_1.AppDataSource.getRepository(ContactInfo_1.ContactInfo);
    const contactInfo = await contactInfoRepository.findOne({
        where: { primary_phone_number: phoneNumber }
    });
    if (!contactInfo) {
        return undefined; // Instead of returning null, return undefined here
    }
    const userRepository = datasource_1.AppDataSource.getRepository(User_1.User);
    userRepository.findOne({
        where: { contact_info_id: contactInfo.contact_info_id }
    });
    return;
};
exports.findUserByPhoneNumber = findUserByPhoneNumber;
const insertUserContactInfo = async (phoneNumber, email) => {
    const contactInfoRepository = datasource_1.AppDataSource.getRepository(ContactInfo_1.ContactInfo);
    const contactInfo = contactInfoRepository.create({
        primary_phone_number: phoneNumber,
        primary_email_id: email,
    });
    return contactInfoRepository.save(contactInfo);
};
exports.insertUserContactInfo = insertUserContactInfo;
const insertUserAuthentication = async (contactInfoId, password) => {
    const authenticationRepository = datasource_1.AppDataSource.getRepository(Authentication_1.Authentication);
    const hashedPassword = await bcrypt_1.default.hash(password, 10);
    const authentication = authenticationRepository.create({
        contact_info_id: contactInfoId,
        hashed_password: hashedPassword,
    });
    return authenticationRepository.save(authentication);
};
exports.insertUserAuthentication = insertUserAuthentication;
const insertUserDetails = async (name, contactInfoId) => {
    const userRepository = datasource_1.AppDataSource.getRepository(User_1.User);
    const newUser = userRepository.create({
        name: name,
        contact_info_id: contactInfoId,
    });
    return userRepository.save(newUser);
};
exports.insertUserDetails = insertUserDetails;
const insertClinicDetails = async (clinicName, contactInfoId) => {
    const clinicRepository = datasource_1.AppDataSource.getRepository(Clinic_1.Clinic);
    const clinic = clinicRepository.create({
        clinic_name: clinicName,
        clinic_contact_info_id: contactInfoId,
    });
    return clinicRepository.save(clinic);
};
exports.insertClinicDetails = insertClinicDetails;
const insertDoctorData = async (userId, contactInfoId) => {
    const doctorRepository = datasource_1.AppDataSource.getRepository(Doctor_1.Doctor);
    const doctor = doctorRepository.create({
        user_id: userId,
        doctor_contact_info_id: contactInfoId,
    });
    return doctorRepository.save(doctor);
};
exports.insertDoctorData = insertDoctorData;
const insertStaffDetails = async (userId, clinicId, roleNum) => {
    const staffRepository = datasource_1.AppDataSource.getRepository(Staff_1.Staff);
    const staff = staffRepository.create({
        user_id: userId,
        employer_id: clinicId,
        employer_type: 1, // Assuming '1' is a constant value in your context
        role: roleNum,
        status: 1, // Assuming '1' represents active status or similar
        start_date: new Date(), // Current date as the start date
    });
    return staffRepository.save(staff);
};
exports.insertStaffDetails = insertStaffDetails;
