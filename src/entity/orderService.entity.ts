import { Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Service } from './service.entity';
import { Order } from './order.entity';

export enum OrderStatusEnum {
    PENDIENTE = 'PENDIENTE',
    CONFIRMADA = 'CONFIRMADA',
    CANCELADA = 'CANCELADA'
}

@Entity('OrderServices')
export class OrderService {

    @PrimaryGeneratedColumn('uuid')
    public id: number;

    @ManyToOne(() => Service, (service) => service.orderServices)
    public service: Service;

    @ManyToOne(() => Order, (order) => order.orderServices)
    public order: Order;

}