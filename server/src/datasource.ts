

import { DataSource } from "typeorm";
import { User } from "./entity/User";
import { OTP } from "./entity/Otp";
import { Appointment } from "./entity/Appointment";
import { Address } from "./entity/Address";
import { Authentication } from "./entity/Authentication";
import { Clinic } from "./entity/Clinic";
import { ContactInfo } from "./entity/ContactInfo";
import { Doctor } from "./entity/Doctor";
import { Hospital } from "./entity/Hospital";
import { Laboratory } from "./entity/Laboratory";
import { Org } from "./entity/Org";
import { Patient } from "./entity/Patient";
import { Staff } from "./entity/Staff";
// Import other entities...

export const AppDataSource = new DataSource({
    type: "postgres", // or the type of your database
    host: process.env.PGHOST,
    port: Number(process.env.PGPORT),
    username: process.env.PGUSER,
    password: process.env.PGPASSWORD,
    database: process.env.PGDATABASE,
    synchronize: true, // should be false in production
    logging: true,
    entities: [User, OTP ,Appointment,Address,Authentication,Clinic,ContactInfo,Doctor,Hospital,Laboratory,Org,OTP,Patient,Staff/*, other entities */],
    // subscribers, migrations can also be included here if needed
});