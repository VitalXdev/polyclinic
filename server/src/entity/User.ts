import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { Appointment } from "./Appointment";
import { Doctor } from "./Doctor";
import { Patient } from "./Patient";
import { Staff } from "./Staff";

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    user_id!: number;

    @Column({nullable: true})
    name!: string;

    @Column({ type: "date", nullable: true })
    date_of_birth!: Date;

    @Column({ nullable: true })
    gender!: string;

    @Column({ type: "timestamp with time zone", default: () => "CURRENT_TIMESTAMP" })
    created_at!: Date;

    @Column({ type: "timestamp with time zone", default: () => "CURRENT_TIMESTAMP" })
    updated_at!: Date;

    @Column()
    contact_info_id!: number;

    @OneToMany(() => Appointment, appointment => appointment.patient)
    appointments!: Appointment[];

    @OneToMany(() => Doctor, doctor => doctor.user)
    doctor!: Doctor[];

    @OneToMany(() => Patient, patient => patient.user)
    patient!: Patient[];

    @OneToMany(() => Staff, staff => staff.user)
    staff!: Staff[];
}