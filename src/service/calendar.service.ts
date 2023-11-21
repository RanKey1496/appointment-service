import { google, Auth, calendar_v3 } from 'googleapis';
import { injectable } from 'inversify';
import { Event } from '../entity/dto/event.dto';

export interface CalendarService {
    getEvents(startDatetime: string, endDatetime: string): Promise<any>;
    insertEvent(event: Event): Promise<any>;
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

}