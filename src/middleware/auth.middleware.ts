import { inject, injectable } from 'inversify';
import { NextFunction, Request, Response } from 'express';
import { Unauthorize } from '../util/exceptions';
export interface AuthMiddleware {
    isAuthenticated(req: Request, res: Response, next: NextFunction): Promise<void>;
}

@injectable()
export class AuthMiddlewareImpl implements AuthMiddleware {

    public async isAuthenticated(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const token = req.get('Authorization').split(' ')[1];
            if (!token) return next(new Unauthorize('No token provided'));
            const decodedToken = 'token';
            res.req.body.user = decodedToken;
            return next();
        } catch (error) {
            console.log(error);
            return next(new Unauthorize('Unable to authorize'));
        }
    }

}