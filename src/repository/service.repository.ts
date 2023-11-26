import { injectable } from 'inversify';
import { GenericRepositoryImp } from './repository';
import { dataSource } from '../config/db';
import { Repository } from 'typeorm';
import { Service } from '../entity/service.entity';

@injectable()
export class ServiceRepository extends GenericRepositoryImp<Service> {

    private serviceRepository: Repository<Service>;

    constructor() {
        const repository = dataSource.getRepository(Service);
        super(repository);
        this.serviceRepository = repository;
    }

    public async findAll(): Promise<Service[]> {
        return await this.serviceRepository.createQueryBuilder('service')
            .orderBy('id')
            .getMany();
    }

    public async findByIds(ids: number[]): Promise<Service[]> {
        return await this.serviceRepository.createQueryBuilder('service')
            .whereInIds(ids)
            .getMany();
    }

}