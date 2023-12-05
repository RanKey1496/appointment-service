import { injectable } from 'inversify';
import { GenericRepositoryImp } from './repository';
import { dataSource } from '../config/db';
import { Repository } from 'typeorm';
import { User } from '../entity/user.entity';

@injectable()
export class UserRepository extends GenericRepositoryImp<User> {

    private userRepository: Repository<User>;

    constructor() {
        const repository = dataSource.getRepository(User);
        super(repository);
        this.userRepository = repository;
    }

    public async findByPhone(phone: string): Promise<User> {
        return await this.userRepository.createQueryBuilder('user')
            .where('user.phone = :phone', { phone })
            .getOne();
    }
}