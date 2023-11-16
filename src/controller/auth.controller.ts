import { inject, injectable } from 'inversify';
import { RegistrableController } from './RegistrableController';
import { Application, NextFunction, Request, Response } from 'express';
import { dataResponse } from '../util/response';
import { Types } from '../config/inversify';
import { AuthMiddleware } from '../middleware/auth.middleware';

@injectable()
export class AuthController implements RegistrableController {

    public register(app: Application): void {

        app.post('/login', async (req: Request, res: Response, next: NextFunction) => {
            try {
                const { email, password } = req.body;
                return dataResponse(res, email);
            } catch (error) {
                return next(error);
            }
        });

    }

}