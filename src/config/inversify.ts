import { Container } from 'inversify';
import { RegistrableController } from '../controller/RegistrableController';
import { AuthController } from '../controller/auth.controller';
import { AuthMiddleware, AuthMiddlewareImpl } from '../middleware/auth.middleware';

const Types = {
    Controller: Symbol('Controller'),

    AuthMiddleware: Symbol('AuthMiddleware')
};

const container: Container = new Container();

// Controllers
container.bind<RegistrableController>(Types.Controller).to(AuthController);

// Middlewares
container.bind<AuthMiddleware>(Types.AuthMiddleware).to(AuthMiddlewareImpl);

export { container, Types };