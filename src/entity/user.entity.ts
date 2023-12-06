import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { Order } from './order.entity';

@Entity('Users')
export class User {

    @PrimaryGeneratedColumn()
    public id: number;

    @Column({
        type: 'varchar',
        length: 50,
        nullable: false
    })
    public name: string;

    @Column({
        type: 'varchar',
        length: 13,
        nullable: false
    })
    public phone: string;

    @Column({
        type: 'varchar',
        name: 'instagram',
        length: 30,
        nullable: true
    })
    public instagram: string;

    @CreateDateColumn()
    public createdAt: Date;

    @UpdateDateColumn()
    public updatedAt: Date;

    @OneToMany(() => Order, (orders) => orders.user)
    public orders: Order[];

}