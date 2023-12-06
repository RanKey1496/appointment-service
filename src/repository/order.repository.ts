import { injectable } from 'inversify';
import { GenericRepositoryImp } from './repository';
import { dataSource } from '../config/db';
import { Repository } from 'typeorm';
import { Order } from '../entity/order.entity';

@injectable()
export class OrderRepository extends GenericRepositoryImp<Order> {

    private orderRepository: Repository<Order>;

    constructor() {
        const repository = dataSource.getRepository(Order);
        super(repository);
        this.orderRepository = repository;
    }

}