import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne } from "typeorm";
import { Appointment } from "./Appointment";
import { User } from "./User";
import { ContactInfo } from "./ContactInfo";

@Entity()
export class Doctor {
    @PrimaryGeneratedColumn()
    doctor_id!: number;

    @Column()
    user_id!: number;

    @Column({ nullable: true })
    doctor_qualification!: string;

    @Column({ nullable: true })
    doctor_speciality!: string;

    @Column({ nullable: true })
    doctor_contact_info_id!: number;

    @Column({ nullable: true })
    doctor_address_id!: number;

    @Column({ type: "timestamp with time zone", default: () => "CURRENT_TIMESTAMP" })
    created_at!: Date;

    @Column({ type: "timestamp with time zone", default: () => "CURRENT_TIMESTAMP" })
    updated_at!: Date;

    @OneToMany(() => Appointment, appointment => appointment.doctor)
    appointments!: Appointment[];

    @ManyToOne(() => User, user => user.doctor)
    user!: User;

    // @ManyToOne(() => ContactInfo, contactInfo => contactInfo.doctor)
    // contactInfo!: ContactInfo;

    // other relationships...
}