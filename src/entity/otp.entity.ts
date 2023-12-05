import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity('OTP')
export class OTP {

    @PrimaryGeneratedColumn()
    public id: number;

    @Column({
        type: 'varchar',
        length: 6,
        nullable: false
    })
    public code: string;

    @Column({
        type: 'varchar',
        nullable: false
    })
    public details: string;

    @Column({
        nullable: false
    })
    public expirationTime: Date;

    @Column({
        default: false,
        nullable: true
    })
    public verified: boolean;

    @CreateDateColumn()
    public createdAt: Date;

    @UpdateDateColumn()
    public updatedAt: Date;

}