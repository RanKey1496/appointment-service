import { Container } from 'inversify';
import Types from './types';
import { RegistrableController } from '../controller/RegistrableController';
import { AuthController } from '../controller/auth.controller';
import { AuthMiddleware, AuthMiddlewareImpl } from '../middleware/auth.middleware';
import { UserService, UserServiceImpl } from '../service/user.service';
import { UserRepository } from '../repository/user.repository';
import { FirebaseService, FirebaseServiceImpl } from '../service/firebase.service';
import { JWTService, JWTServiceImpl } from '../service/jwt.service';

const container: Container = new Container();

// Controllers
container.bind<RegistrableController>(Types.Controller).to(AuthController);

// Middlewares
container.bind<AuthMiddleware>(Types.AuthMiddleware).to(AuthMiddlewareImpl);

// Services
container.bind<UserService>(Types.UserService).to(UserServiceImpl);
container.bind<FirebaseService>(Types.FirebaseService).to(FirebaseServiceImpl);
container.bind<JWTService>(Types.JWTService).to(JWTServiceImpl);

// Repositories
container.bind<UserRepository>(Types.UserRepository).to(UserRepository);

export { container };