import { inject, injectable } from 'inversify';
import { RegistrableController } from './RegistrableController';
import { Application, NextFunction, Request, Response } from 'express';
import { dataResponse } from '../util/response';
import Types from '../config/types';
import { CalendarService } from '../service/calendar.service';
import { Event } from '../entity/dto/event.dto';

@injectable()
export class BookController implements RegistrableController {

    @inject(Types.CalendarService)
    private calendarService: CalendarService;

    public register(app: Application): void {

        app.get('/events', async (req: Request, res: Response, next: NextFunction) => {
            try {
                const result = await this.calendarService.getEvents('2023-11-15T00:00:00.000Z', '2023-11-30T00:00:00.000Z');
                return dataResponse(res, result);
            } catch (error) {
                return next(error);
            }
        });

        app.get('/eventInsert', async (req: Request, res: Response, next: NextFunction) => {
            try {
                const event = new Event();
                event.summary = 'Cita mela';
                event.description = 'Mela la descripcion';
                event.start = {
                    dateTime: '2023-11-20T11:00:00-05:00',
                    timeZone: 'America/Bogota'
                };
                event.end = {
                    dateTime: '2023-11-20T13:00:00-05:00',
                    timeZone: 'America/Bogota'
                };
                event.reminders = {
                    useDefault: false,
                    overrides: [
                        { method: 'email', minutes: 12 * 60 },
                        { method: 'popup', minutes: 10 }
                    ]
                };
                const result = await this.calendarService.insertEvent(event);
                return dataResponse(res, result);
            } catch (error) {
                return next(error);
            }
        });

    }

}