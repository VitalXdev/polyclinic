import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { Appointment } from "./Appointment";

@Entity()
export class Clinic {
    @PrimaryGeneratedColumn()
    clinic_id!: number;

    @Column({ nullable: false })
    clinic_name!: string;

    @Column({ nullable: true })
    clinic_address_id!: number;

    @Column({ nullable: true })
    clinic_qr_code_url!: string;

    @Column()
    clinic_contact_info_id!: number;

    @Column({ nullable: true })
    org_id!: number;

    @Column({ type: "timestamp with time zone", default: () => "CURRENT_TIMESTAMP" })
    created_at!: Date;

    @Column({ type: "timestamp with time zone", default: () => "CURRENT_TIMESTAMP" })
    updated_at!: Date;

    @OneToMany(() => Appointment, appointment => appointment.clinic)
    appointments!: Appointment[];

    // Add relationships here if any
}