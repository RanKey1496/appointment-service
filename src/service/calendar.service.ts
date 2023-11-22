import { google, Auth, calendar_v3 } from 'googleapis';
import { injectable } from 'inversify';
import { Event } from '../entity/dto/event.dto';
import moment from 'moment';

export interface CalendarService {
    getEvents(startDatetime: string | Date, endDatetime: string | Date): Promise<any>;
    insertEvent(event: Event): Promise<any>;
    findByDate(date: string): Promise<any>;
}

@injectable()
export class CalendarServiceImpl implements CalendarService {

    private calendar: calendar_v3.Calendar;

    constructor() {
        const CREDETIALS = JSON.parse(process.env.CALENDAR_CREDETIALS);
        const SCOPES = 'https://www.googleapis.com/auth/calendar';

        const auth = new Auth.JWT(
            CREDETIALS.client_email,
            undefined,
            CREDETIALS.private_key,
            SCOPES
        );

        this.calendar = google.calendar({ version: 'v3', auth });
    }

    public async getEvents(startDatetime: string, endDatetime: string) {
        try {
            console.log('StartDateTime: ', startDatetime, ' EndDateTime: ', endDatetime);
            const response = await this.calendar.events.list({
                calendarId: process.env.CALENDAR_ID,
                timeMin: startDatetime,
                timeMax: endDatetime
            });

            return response.data.items;
        } catch (error) {
            console.log('Error in getEvents', error);
        }
    }

    public async insertEvent(event: Event) {
        const response = await this.calendar.events.insert({
            calendarId: process.env.CALENDAR_ID,
            requestBody: event
        });

        return response.data;
    }

    public async findByDate(date: string): Promise<any> {
        const startDate = moment(date).startOf('day').format();
        const endDate = moment(date).endOf('day').format();
        return this.getEvents(startDate, endDate);
    }

}