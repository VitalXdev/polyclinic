import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne } from "typeorm";
import { Appointment } from "./Appointment";
import { User } from "./User";
import { ContactInfo } from "./ContactInfo";
import { Address } from "./Address";

@Entity()
export class Patient {
    @PrimaryGeneratedColumn()
    patient_id!: number;

    @Column({ nullable: true })
    user_id!: number;

    @Column({ nullable: true })
    patient_contact_info_id!: number;

    @Column({ nullable: true })
    patient_address_id!: number;

    @Column({ nullable: true })
    related_patient_id!: number;

    @Column({ nullable: true })
    relation_type!: string;

    @Column({ type: "timestamp with time zone", default: () => "CURRENT_TIMESTAMP" })
    created_at!: Date;

    @Column({ type: "timestamp with time zone", default: () => "CURRENT_TIMESTAMP" })
    updated_at!: Date;

    @OneToMany(() => Appointment, appointment => appointment.patient)
    appointments!: Appointment[];

    @ManyToOne(() => User, user => user.patient)
    user!: User;

    // @ManyToOne(() => ContactInfo, contactInfo => contactInfo.patient)
    // contactInfo!: ContactInfo;

    // @ManyToOne(() => Address, address => address.patient)
    // address!: Address;
}