import { AppDataSource } from "../datasource";
import { User } from "../entity/User";
import { ContactInfo } from "../entity/ContactInfo";

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