import { inject, injectable } from 'inversify';
import { Service } from '../entity/service.entity';
import { ServiceRepository } from '../repository/service.repository';
import Types from '../config/types';
import { BadRequest, NotFound } from '../util/exceptions';

export interface ServiceService {
    findAll(): Promise<Service[]>;
    findByIds(ids: number[]): Promise<Service[]>;
    findDurationByIds(ids: number[]): Promise<number>;
}

@injectable()
export class ServiceServiceImpl implements ServiceService {

    @inject(Types.ServiceRepository)
    private serviceRepository: ServiceRepository;

    public async findAll(): Promise<Service[]> {
        return await this.serviceRepository.findAll();
    }

    public async findByIds(ids: number[]): Promise<Service[]> {
        const result = [];
        for (const id of ids) {
            const service = await this.serviceRepository.findById(id);
            if (!service) throw new NotFound('Unable to find service by id');
            result.push(service);
        }
        return result;
    }

    public async findDurationByIds(ids: number[]): Promise<number> {
        const idsSet = [...new Set(ids)];
        const services = await this.serviceRepository.findByIds(idsSet);
        if (services.length !== idsSet.length) {
            throw new BadRequest('Unable to find all services');
        }
        return ids.reduce((acc, curr) => {
            return acc + services.find(s => s.id === curr).duration;
        }, 0);
    }

}