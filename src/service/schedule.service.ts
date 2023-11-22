import { inject, injectable } from 'inversify';
import Types from '../config/types';
import { ScheduleRepository } from '../repository/schedule.repository';
import moment, { Moment } from 'moment-timezone';
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
        const actual = moment.tz(startDatetime, 'America/Bogota');
        while (!actual.isSame(moment.tz(endDateTime, 'America/Bogota'))) {
            console.log('actual', actual.format(), 'moment', actual);
            result.push(actual.format());
            actual.add('1', 'hours');
        }
        return result;
    }

    private generateAllHours(date: string, schedules: ScheduleDay[]): string[] {
        return schedules.map(x => {
            const start = moment(`${date} ${x.startHour}`).tz('America/Bogota', true).format();
            const end = moment(`${date} ${x.endHour}`).tz('America/Bogota', true).format();
            console.log('start', start, 'end', end);
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