
import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class ContactInfo {
    @PrimaryGeneratedColumn()
    contact_info_id!: number;

    @Column()
    primary_phone_number!: string;

    @Column({ nullable: true })
    secondary_phone_number!: string;

    @Column({ nullable: true })
    tertiary_phone_number!: string;

    @Column({ nullable: true })
    primary_email_id!: string;

    @Column({ nullable: true })
    secondary_email_id!: string;

    @Column({ nullable: true })
    is_primary_phone_verified!: boolean;

    @Column({ type: "timestamp with time zone", default: () => "CURRENT_TIMESTAMP" })
    created_at!: Date;

    @Column({ type: "timestamp with time zone", default: () => "CURRENT_TIMESTAMP" })
    updated_at!: Date;

    // Add relationships here if any
}