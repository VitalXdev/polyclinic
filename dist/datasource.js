"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppDataSource = void 0;
const typeorm_1 = require("typeorm");
const User_1 = require("./entity/User");
const Otp_1 = require("./entity/Otp");
const Appointment_1 = require("./entity/Appointment");
const Address_1 = require("./entity/Address");
const Authentication_1 = require("./entity/Authentication");
const Clinic_1 = require("./entity/Clinic");
const ContactInfo_1 = require("./entity/ContactInfo");
const Doctor_1 = require("./entity/Doctor");
const Hospital_1 = require("./entity/Hospital");
const Laboratory_1 = require("./entity/Laboratory");
const Org_1 = require("./entity/Org");
const Patient_1 = require("./entity/Patient");
const Staff_1 = require("./entity/Staff");
// Import other entities...
exports.AppDataSource = new typeorm_1.DataSource({
    type: "postgres", // or the type of your database
    host: process.env.PGHOST,
    port: Number(process.env.PGPORT),
    username: process.env.PGUSER,
    password: process.env.PGPASSWORD,
    database: process.env.PGDATABASE,
    synchronize: true, // should be false in production
    logging: true,
    entities: [User_1.User, Otp_1.OTP, Appointment_1.Appointment, Address_1.Address, Authentication_1.Authentication, Clinic_1.Clinic, ContactInfo_1.ContactInfo, Doctor_1.Doctor, Hospital_1.Hospital, Laboratory_1.Laboratory, Org_1.Org, Otp_1.OTP, Patient_1.Patient, Staff_1.Staff /*, other entities */],
    // subscribers, migrations can also be included here if needed
});
