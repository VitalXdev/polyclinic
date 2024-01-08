
import { Entity, PrimaryColumn, Column } from "typeorm";

@Entity()
export class Authentication {
    @PrimaryColumn()
    contact_info_id!: number;

    @Column({ nullable: true })
    last_otp!: number;

    @Column()
    hashed_password!: string;

    @Column({ type: "timestamp with time zone", default: () => "CURRENT_TIMESTAMP" })
    last_authenticated_at!: Date;

    // Add relationships here if any
}