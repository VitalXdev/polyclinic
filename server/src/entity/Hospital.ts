
import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class Hospital {
    @PrimaryGeneratedColumn()
    hospital_id!: number;

    @Column()
    hospital_name!: string;

    @Column({ nullable: true })
    hospital_address_id!: number;

    @Column({ nullable: true })
    hospital_qr_code_url!: string;

    @Column({ nullable: true })
    hospital_contact_info_id!: number;

    @Column({ nullable: true })
    hospital_org_id!: number;

    @Column({ type: "timestamp with time zone", default: () => "CURRENT_TIMESTAMP" })
    created_at!: Date;

    @Column({ type: "timestamp with time zone", default: () => "CURRENT_TIMESTAMP" })
    updated_at!: Date;

    // Add relationships here if any
}