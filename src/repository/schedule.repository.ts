import { injectable } from 'inversify';
import { GenericRepositoryImp } from './repository';
import { dataSource } from '../config/db';
import { Repository } from 'typeorm';
import { ScheduleDay } from '../entity/schedule.entity';

@injectable()
export class ScheduleRepository extends GenericRepositoryImp<ScheduleDay> {

    private scheduleRepository: Repository<ScheduleDay>;

    constructor() {
        const repository = dataSource.getRepository(ScheduleDay);
        super(repository);
        this.scheduleRepository = repository;
    }

    public async findByDayIdAndHoliday(dayId: number, isHoliday: boolean): Promise<ScheduleDay[]> {
        return await this.scheduleRepository.createQueryBuilder('scheduleDay')
            .where('scheduleDay.dayId = :dayId', { dayId })
            .andWhere('scheduleDay.isHoliday = :isHoliday', { isHoliday })
            .getMany();
    }

}