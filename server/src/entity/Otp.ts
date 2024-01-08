// server/src/entity/OTP.ts

import { Entity, PrimaryColumn, Column } from "typeorm";

@Entity()
export class OTP {
    @PrimaryColumn()
    mobile_number!: string;

    @Column()
    otp_sent!: string;

    @Column()
    created_at!: Date;

    @Column()
    expires_at!: Date;

    @Column({ default: false })
    validated!: boolean;
}
