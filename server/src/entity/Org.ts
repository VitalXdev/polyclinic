import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class Org {
    @PrimaryGeneratedColumn()
    org_id!: number;

    @Column()
    org_name!: string;

    @Column({ nullable: true })
    org_contact_info_id!: number;

    @Column({ nullable: true })
    org_address_id!: number;

    @Column({ type: "timestamp with time zone", default: () => "CURRENT_TIMESTAMP" })
    created_at!: Date;

    @Column({ type: "timestamp with time zone", default: () => "CURRENT_TIMESTAMP" })
    updated_at!: Date;

    // Add relationships here if any
}