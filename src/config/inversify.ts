import { Container } from 'inversify';
import Types from './types';
import { RegistrableController } from '../controller/RegistrableController';
import { AuthController } from '../controller/auth.controller';
import { AuthMiddleware, AuthMiddlewareImpl } from '../middleware/auth.middleware';
import { UserService, UserServiceImpl } from '../service/user.service';
import { UserRepository } from '../repository/user.repository';
import { FirebaseService, FirebaseServiceImpl } from '../service/firebase.service';
import { JWTService, JWTServiceImpl } from '../service/jwt.service';
import { CalendarService, CalendarServiceImpl } from '../service/calendar.service';
import { BookController } from '../controller/book.controller';
import { ScheduleRepository } from '../repository/schedule.repository';
import { ScheduleService, ScheduleServiceImpl } from '../service/schedule.service';

const container: Container = new Container();

// Controllers
container.bind<RegistrableController>(Types.Controller).to(AuthController);
container.bind<RegistrableController>(Types.Controller).to(BookController);

// Middlewares
container.bind<AuthMiddleware>(Types.AuthMiddleware).to(AuthMiddlewareImpl);

// Services
container.bind<UserService>(Types.UserService).to(UserServiceImpl);
container.bind<FirebaseService>(Types.FirebaseService).to(FirebaseServiceImpl);
container.bind<JWTService>(Types.JWTService).to(JWTServiceImpl);
container.bind<CalendarService>(Types.CalendarService).to(CalendarServiceImpl);
container.bind<ScheduleService>(Types.ScheduleService).to(ScheduleServiceImpl);

// Repositories
container.bind<UserRepository>(Types.UserRepository).to(UserRepository);
container.bind<ScheduleRepository>(Types.ScheduleRepository).to(ScheduleRepository);

export { container };