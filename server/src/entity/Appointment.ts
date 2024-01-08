import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { Doctor } from "./Doctor";
import { Patient } from "./Patient";
import { Clinic } from "./Clinic";

@Entity()
export class Appointment {
    @PrimaryGeneratedColumn()
    appointment_id!: number;

    @Column()
    status!: number;

    @Column()
    appointment_number!: number;

    @Column({ type: "timestamp with time zone", default: () => "CURRENT_TIMESTAMP" })
    created_at!: Date;

    @Column({ type: "timestamp with time zone", default: () => "CURRENT_TIMESTAMP" })
    updated_at!: Date;

    @ManyToOne(() => Doctor, doctor => doctor.appointments)
    doctor!: Doctor;

    @ManyToOne(() => Patient, patient => patient.appointments)
    patient!: Patient;

    @ManyToOne(() => Clinic, clinic => clinic.appointments)
    clinic!: Clinic;
}