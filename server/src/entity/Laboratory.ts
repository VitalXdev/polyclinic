import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class Laboratory {
    @PrimaryGeneratedColumn()
    laboratory_id!: number;

    @Column()
    laboratory_name!: string;

    @Column({ nullable: true })
    laboratory_address_id!: number;

    @Column({ nullable: true })
    laboratory_qr_code_url!: string;

    @Column({ nullable: true })
    laboratory_contact_info_id!: number;

    @Column({ nullable: true })
    laboratory_org_id!: number;

    @Column({ type: "timestamp with time zone", default: () => "CURRENT_TIMESTAMP" })
    created_at!: Date;

    @Column({ type: "timestamp with time zone", default: () => "CURRENT_TIMESTAMP" })
    updated_at!: Date;

    // Add relationships here if any
}