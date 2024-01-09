import { AppDataSource } from "../datasource";
import bcrypt from 'bcrypt';
import { User } from '../entity/User';
import { ContactInfo } from '../entity/ContactInfo';
import { Authentication } from '../entity/Authentication';
import { Clinic } from '../entity/Clinic';
import { Doctor } from '../entity/Doctor';
import { Staff } from '../entity/Staff';

export const findUserByPhoneNumber = async (phoneNumber: string): Promise<User | undefined> => {
    const contactInfoRepository = AppDataSource.getRepository(ContactInfo);
    const contactInfo = await contactInfoRepository.findOne({
      where: { primary_phone_number: phoneNumber }
    });
  
    if (!contactInfo) {
      return undefined; // Instead of returning null, return undefined here
    }
  
    const userRepository = AppDataSource.getRepository(User);
    userRepository.findOne({
      where: { contact_info_id: contactInfo.contact_info_id }
    });
    return;
  };



  export const insertUserContactInfo = async (phoneNumber: string, email: string): Promise<ContactInfo> => {
    const contactInfoRepository = AppDataSource.getRepository(ContactInfo);
    const contactInfo = contactInfoRepository.create({
      primary_phone_number: phoneNumber,
      primary_email_id: email,
    });
    return contactInfoRepository.save(contactInfo);
  };
  
  export const insertUserAuthentication = async (contactInfoId: number, password: string): Promise<Authentication> => {
    const authenticationRepository = AppDataSource.getRepository(Authentication);
    const hashedPassword = await bcrypt.hash(password, 10);
    const authentication = authenticationRepository.create({
      contact_info_id: contactInfoId,
      hashed_password: hashedPassword,
    });
    return authenticationRepository.save(authentication);
  };
  
  export const insertUserDetails = async (name: string, contactInfoId: number): Promise<User> => {
    const userRepository = AppDataSource.getRepository(User);
    const newUser = userRepository.create({
      name: name,
      contact_info_id: contactInfoId,
    });
    return userRepository.save(newUser);
  };

  export const insertClinicDetails = async (clinicName: string, contactInfoId: number): Promise<Clinic> => {
    const clinicRepository = AppDataSource.getRepository(Clinic);
    const clinic = clinicRepository.create({
      clinic_name: clinicName,
      clinic_contact_info_id: contactInfoId,
    });
    return clinicRepository.save(clinic);
  };

  export const insertDoctorData = async (userId: number, contactInfoId: number): Promise<Doctor> => {
    const doctorRepository = AppDataSource.getRepository(Doctor);
    const doctor = doctorRepository.create({
      user_id: userId,
      doctor_contact_info_id: contactInfoId,
    });
    return doctorRepository.save(doctor);
  };

  export const insertStaffDetails = async (userId: number, clinicId: number, roleNum: number): Promise<Staff> => {
    const staffRepository = AppDataSource.getRepository(Staff);
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