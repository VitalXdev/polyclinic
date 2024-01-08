"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findUserByPhoneNumber = void 0;
const datasource_1 = require("../datasource");
const User_1 = require("../entity/User");
const ContactInfo_1 = require("../entity/ContactInfo");
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
