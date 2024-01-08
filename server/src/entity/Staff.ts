import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { User } from "./User";

@Entity()
export class Staff {
    @PrimaryGeneratedColumn()
    staff_id!: number;

    @Column()
    user_id!: number;

    @Column()
    employer_id!: number;

    @Column()
    employer_type!: number;

    @Column()
    role!: number;

    @Column({ default: 1 })
    status!: number;

    @Column({ nullable: true })
    start_date!: Date;

    @Column({ nullable: true })
    end_date!: Date;

    @Column({ type: "timestamp with time zone", default: () => "CURRENT_TIMESTAMP" })
    created_at!: Date;

    @Column({ type: "timestamp with time zone", default: () => "CURRENT_TIMESTAMP" })
    updated_at!: Date;

    @ManyToOne(() => User, user => user.staff)
    user!: User;

    // Add relationships here if any
}