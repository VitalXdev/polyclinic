import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class Address {
    @PrimaryGeneratedColumn()
    address_id!: number;

    @Column({ nullable: true })
    street_1!: string;

    @Column({ nullable: true })
    street_2!: string;

    @Column({ nullable: true })
    city!: string;

    @Column({ nullable: true })
    state!: string;

    @Column({ nullable: true })
    country!: string;

    @Column({ nullable: true })
    pin_code!: string;

    @Column({ type: "timestamp with time zone", default: () => "CURRENT_TIMESTAMP" })
    created_at!: Date;

    @Column({ type: "timestamp with time zone", default: () => "CURRENT_TIMESTAMP" })
    updated_at!: Date;

    // Add relationships here if any
}