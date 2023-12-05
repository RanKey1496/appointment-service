import { injectable } from 'inversify';
import { GenericRepositoryImp } from './repository';
import { dataSource } from '../config/db';
import { Repository } from 'typeorm';
import { OTP } from '../entity/otp.entity';

@injectable()
export class OTPRepository extends GenericRepositoryImp<OTP> {

    private otpRepository: Repository<OTP>;

    constructor() {
        const repository = dataSource.getRepository(OTP);
        super(repository);
        this.otpRepository = repository;
    }

    public async findByDetails(details: string): Promise<OTP> {
        return await this.otpRepository.createQueryBuilder('otp')
            .where('otp.details = :details', { details })
            .getOne();
    }

}