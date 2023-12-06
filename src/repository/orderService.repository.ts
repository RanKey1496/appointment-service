import { injectable } from 'inversify';
import { GenericRepositoryImp } from './repository';
import { dataSource } from '../config/db';
import { Repository } from 'typeorm';
import { OrderService } from '../entity/orderService.entity';

@injectable()
export class OrderServiceRepository extends GenericRepositoryImp<OrderService> {

    private orderServiceRepository: Repository<OrderService>;

    constructor() {
        const repository = dataSource.getRepository(OrderService);
        super(repository);
        this.orderServiceRepository = repository;
    }

}