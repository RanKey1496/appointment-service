import { inject, injectable } from 'inversify';
import { RegistrableController } from './RegistrableController';
import { Application, NextFunction, Request, Response } from 'express';
import { dataResponse } from '../util/response';
import Types from '../config/types';
import { CalendarService } from '../service/calendar.service';
import { Event } from '../entity/dto/event.dto';
import { ScheduleService } from '../service/schedule.service';
import { ServiceService } from '../service/service.service';
import { AuthMiddleware } from '../middleware/auth.middleware';
import { MessageBirdService } from '../service/messageBird.service';
import { UserService } from '../service/user.service';
import { OrderService } from '../service/order.service';

@injectable()
export class BookController implements RegistrableController {

    @inject(Types.AuthMiddleware)
    private authMiddleware: AuthMiddleware;

    @inject(Types.CalendarService)
    private calendarService: CalendarService;

    @inject(Types.ScheduleService)
    private scheduleService: ScheduleService;

    @inject(Types.ServiceService)
    private serviceService: ServiceService;

    @inject(Types.MessageBirdService)
    private messageBirdService: MessageBirdService;

    @inject(Types.UserService)
    private userService: UserService;

    @inject(Types.OrderService)
    private orderService: OrderService;

    public register(app: Application): void {

        app.post('/book/available', async (req: Request, res: Response, next: NextFunction) => {
            try {
                const { date } = req.body;
                // Validar que está en el rango de fechas
                const schedules = await this.scheduleService.findByDate(date);
                const booked = await this.calendarService.findByDate(date);
                const availableHours = await this.scheduleService.generateAvailableHours(date, schedules, booked);
                return dataResponse(res, { availableHours, schedules, booked });
            } catch (error) {
                return next(error);
            }
        });

        app.post('/book/available/type', async (req: Request, res: Response, next: NextFunction) => {
            try {
                const { type, date, ids } = req.body;
                // Validar que está en el rango de fechas
                const schedules = await this.scheduleService.findByDate(date);
                const booked = await this.calendarService.findByDate(date);
                const duration = await this.serviceService.findDurationByIds(ids);
                const availableHours = await this.scheduleService.generateAvailableHoursByType(date, schedules, booked, duration, type);
                return dataResponse(res, { availableHours, schedules, booked });
            } catch (error) {
                return next(error);
            }
        });

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

        app.post('/book/order', this.authMiddleware.isAuthenticated.bind(this.authMiddleware),
            async (req: Request, res: Response, next: NextFunction) => {
                try {
                    console.log(res.req.body.user);
                    const { serviceIds, hour } = req.body;
                    const user = await this.userService.findByPhone(res.req.body.user.phone);
                    const services = await this.serviceService.findByIds(serviceIds);
                    const dates = this.orderService.calculateHours(hour, services);
                    const values = this.orderService.calculateValues(services);
                    const order = await this.orderService.saveNewOrder(services, user, dates, values);
                    // Mirar si se envia un mensaje a Maria
                    // Activar cron para monitorear las ordenes con estado en pendiente
                    return dataResponse(res, order);
                } catch (error) {
                    console.log(error);
                    return next(error);
                }
        });

        app.post('/book/confirm', this.authMiddleware.isAuthenticated.bind(this.authMiddleware),
            async (req: Request, res: Response, next: NextFunction) => {
                try {
                    const { id } = req.body;
                    // Actualizar en la base de datos el estado por id
                    // Enviar Mensaje de whatsapp
                    this.messageBirdService.sendOrderConfirmation(res.req.body.user.phone, undefined);
                    return dataResponse(res, 'Book saved successfully');
                } catch (error) {
                    return next(error);
                }
        });

    }

}