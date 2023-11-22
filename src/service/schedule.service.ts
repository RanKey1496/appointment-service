import { inject, injectable } from 'inversify';
import Types from '../config/types';
import { ScheduleRepository } from '../repository/schedule.repository';
import moment, { Moment } from 'moment';
import Holidays from 'date-holidays';
import { ScheduleDay } from '../entity/schedule.entity';

export interface ScheduleService {
    findByDate(date: string): Promise<ScheduleDay[]>;
    generateAvailableHours(date: string, schedules: ScheduleDay[], booked: any[]): any[];
}

@injectable()
export class ScheduleServiceImpl implements ScheduleService {

    @inject(Types.ScheduleRepository)
    private scheduleRepository: ScheduleRepository;

    private holidays: Holidays;

    constructor() {
        this.holidays = new Holidays('CO');
    }

    public async findByDate(date: string): Promise<ScheduleDay[]> {
        const dayId = moment(date).day();
        const isHoliday: boolean = this.holidays.isHoliday(moment(date).toDate()) ? true : false;
        return this.scheduleRepository.findByDayIdAndHoliday(dayId, isHoliday);
    }

    private generateRange(startDatetime: string, endDateTime: string): string[] {
        const result = [];
        const actual = moment.utc(startDatetime).utcOffset('-05:00');
        while (!actual.isSame(moment.utc(endDateTime).utcOffset('-05:00'))) {
            result.push(actual.format());
            actual.add('1', 'hours');
        }
        return result;
    }

    private generateAllHours(date: string, schedules: ScheduleDay[]): string[] {
        return schedules.map(x => {
            const start = moment.utc(`${date} ${x.startHour}`).utcOffset('-05:00').format();
            const end = moment.utc(`${date} ${x.endHour}`).utcOffset('-05:00').format();
            return this.generateRange(start, end);
        }).flat();
    }

    private generateBookedHours(booked: any[]): string[] {
        return booked.map(x => this.generateRange(x.start.dateTime, x.end.dateTime))
            .flat();
    }

    private removeBookedHours(all: string[], booked: string[]) {
        return all.filter(x => !booked.includes(x));
    }

    public generateAvailableHours(date: string, schedules: ScheduleDay[], booked: any[]): any[] {
        date = moment(date).format('YYYY-MM-DD');
        const allHours = this.generateAllHours(date, schedules);
        const bookedHours = this.generateBookedHours(booked);
        return this.removeBookedHours(allHours, bookedHours);
    }

}