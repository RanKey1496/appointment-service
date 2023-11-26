import { inject, injectable } from 'inversify';
import Types from '../config/types';
import { ScheduleRepository } from '../repository/schedule.repository';
import moment from 'moment-timezone';
import Holidays from 'date-holidays';
import { ScheduleDay } from '../entity/schedule.entity';

export interface ScheduleService {
    findByDate(date: string): Promise<ScheduleDay[]>;
    generateAvailableHours(date: string, schedules: ScheduleDay[], booked: any[]): any[];
    generateAvailableHoursByType(date: string, schedules: ScheduleDay[], booked: any[],
        duration: number, type: string): any[];
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

    private generateRange(startDatetime: string, endDateTime: string, reverse: boolean = false): string[] {
        const result = [];
        const actual = moment(startDatetime);
        const end = moment(endDateTime);
        while (!actual.isSame(end)) {
            result.push(actual.format());
            actual.add(30, 'minutes');
        }
        if (reverse) {
            result.push(actual.format());
            result.shift();
        }
        return result;
    }

    private generateRangeForBooked(startDatetime: string, endDateTime: string, reverse: boolean = false): string[] {
        const result = [];
        const actual = moment(startDatetime);
        const end = moment(endDateTime);
        while (!actual.isSame(end)) {
            result.push(actual.format());
            actual.add(30, 'minutes');
        }
        if (reverse) {
            result.push(actual.format());
            result.shift();
        }
        return result;
    }

    private generateRangeForType(startDatetime: string, endDateTime: string, reverse: boolean = false): string[] {
        const result = [];
        const actual = moment(startDatetime);
        const end = moment(endDateTime);
        result.push(actual.format());
        while (!actual.isSame(end)) {
            if (!reverse) {
                actual.add(30, 'minutes');
            } else {
                actual.subtract(30, 'minutes');
            }
            result.push(actual.format());
        }
        if (!reverse) {
            result.pop();
            result.shift();
        } else {
            result.pop();
        }
        return result;
    }

    private generateAllHours(date: string, schedules: ScheduleDay[], reverse: boolean = false): string[] {
        return schedules.map(x => {
            const start = moment(`${date} ${x.startHour}`).tz('America/Bogota', true).format();
            const end = moment(`${date} ${x.endHour}`).tz('America/Bogota', true).format();
            return this.generateRange(start, end, reverse);
        }).flat().sort();
    }

    private generateBookedHours(booked: any[], reverse: boolean = false): string[] {
        return booked.map(x => this.generateRangeForBooked(x.start.dateTime, x.end.dateTime, reverse))
            .flat();
    }

    private removeBookedHours(all: string[], booked: string[], reverse: boolean = false) {
        return all.filter((x) => !booked.includes(x));
    }

    private calculateAllAvailableHours(type: string, bookedHours: string[], duration: number) {
        return bookedHours.filter(hour => {
            let ranges;
            const endTime = moment(hour).tz('America/Bogota');
            if (type === 'starts') {
                endTime.add(duration, 'minutes');
                ranges = this.generateRangeForType(hour, endTime.format(), false);
            } else {
                endTime.subtract(duration, 'minutes');
                ranges = this.generateRangeForType(hour, endTime.format(), true);
            }
            return ranges.every(r => bookedHours.includes(r));
        });
    }

    public generateAvailableHours(date: string, schedules: ScheduleDay[], booked: any[]): any[] {
        date = moment(date).format('YYYY-MM-DD');
        const allHours = this.generateAllHours(date, schedules);
        const bookedHours = this.generateBookedHours(booked);
        return this.removeBookedHours(allHours, bookedHours);
    }

    public generateAvailableHoursByType(date: string, schedules: ScheduleDay[], booked: any[],
        duration: number, type: string): any[] {
            date = moment(date).format('YYYY-MM-DD');
            const allHours = this.generateAllHours(date, schedules, type === 'ends');
            const bookedHours = this.generateBookedHours(booked, type === 'ends');
            const removedBookedHours = this.removeBookedHours(allHours, bookedHours);
            return this.calculateAllAvailableHours(type, removedBookedHours, duration);
    }

}