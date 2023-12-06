import { Container } from 'inversify';
import Types from './types';
import { RegistrableController } from '../controller/RegistrableController';
import { AuthController } from '../controller/auth.controller';
import { AuthMiddleware, AuthMiddlewareImpl } from '../middleware/auth.middleware';
import { UserService, UserServiceImpl } from '../service/user.service';
import { UserRepository } from '../repository/user.repository';
import { JWTService, JWTServiceImpl } from '../service/jwt.service';
import { CalendarService, CalendarServiceImpl } from '../service/calendar.service';
import { BookController } from '../controller/book.controller';
import { ScheduleRepository } from '../repository/schedule.repository';
import { ScheduleService, ScheduleServiceImpl } from '../service/schedule.service';
import { ServiceService, ServiceServiceImpl } from '../service/service.service';
import { ServiceRepository } from '../repository/service.repository';
import { ServiceController } from '../controller/service.controller';
import { OTPRepository } from '../repository/otp.repository';
import { MessageBirdService, MessageBirdServiceImpl } from '../service/messageBird.service';
import { OrderRepository } from '../repository/order.repository';
import { OrderService, OrderServiceImpl } from '../service/order.service';
import { OrderServiceRepository } from '../repository/orderService.repository';

const container: Container = new Container();

// Controllers
container.bind<RegistrableController>(Types.Controller).to(AuthController);
container.bind<RegistrableController>(Types.Controller).to(BookController);
container.bind<RegistrableController>(Types.Controller).to(ServiceController);

// Middlewares
container.bind<AuthMiddleware>(Types.AuthMiddleware).to(AuthMiddlewareImpl);

// Services
container.bind<UserService>(Types.UserService).to(UserServiceImpl);
container.bind<JWTService>(Types.JWTService).to(JWTServiceImpl);
container.bind<CalendarService>(Types.CalendarService).to(CalendarServiceImpl);
container.bind<ScheduleService>(Types.ScheduleService).to(ScheduleServiceImpl);
container.bind<ServiceService>(Types.ServiceService).to(ServiceServiceImpl);
container.bind<MessageBirdService>(Types.MessageBirdService).to(MessageBirdServiceImpl);
container.bind<OrderService>(Types.OrderService).to(OrderServiceImpl);

// Repositories
container.bind<UserRepository>(Types.UserRepository).to(UserRepository);
container.bind<ScheduleRepository>(Types.ScheduleRepository).to(ScheduleRepository);
container.bind<ServiceRepository>(Types.ServiceRepository).to(ServiceRepository);
container.bind<OTPRepository>(Types.OTPRepository).to(OTPRepository);
container.bind<OrderRepository>(Types.OrderRepository).to(OrderRepository);
container.bind<OrderServiceRepository>(Types.OrderServiceRepository).to(OrderServiceRepository);

export { container };