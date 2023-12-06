import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { User } from './user.entity';
import { OrderService } from './orderService.entity';

export enum OrderStatusEnum {
    PENDIENTE = 'PENDIENTE',
    CONFIRMADA = 'CONFIRMADA',
    CANCELADA = 'CANCELADA'
}

@Entity('Orders')
export class Order {

    @PrimaryGeneratedColumn()
    public id: number;

    @ManyToOne(() => User, (user) => user.orders)
    public user: User;

    @OneToMany(() => OrderService, (orderServices) => orderServices.order)
    public orderServices: OrderService[];

    @Column({
        type: 'enum',
        enum: OrderStatusEnum,
        default: OrderStatusEnum.PENDIENTE
    })
    public status: OrderStatusEnum;

    @Column({
        nullable: false
    })
    public priceTotal: number;

    @Column({
        nullable: false
    })
    public advancePayment: number;

    @Column({
        nullable: false
    })
    public startDatetime: Date;

    @Column({
        nullable: false
    })
    public endDatetime: Date;

    @CreateDateColumn()
    public createdAt: Date;

    @UpdateDateColumn()
    public updatedAt: Date;


}