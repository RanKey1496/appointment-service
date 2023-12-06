import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { OrderService } from './orderService.entity';

@Entity('Services')
export class Service {

    @PrimaryGeneratedColumn()
    public id: number;

    @Column({
        type: 'varchar',
        length: 100,
        nullable: false
    })
    public name: string;

    @Column({
        nullable: false
    })
    public duration: number;

    @Column({
        nullable: true
    })
    public price: number;

    @CreateDateColumn()
    public createdAt: Date;

    @UpdateDateColumn()
    public updatedAt: Date;

    @OneToMany(() => OrderService, (orderServices) => orderServices.service)
    public orderServices: OrderService[];

}