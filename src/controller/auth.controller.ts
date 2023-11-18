import { inject, injectable } from 'inversify';
import { RegistrableController } from './RegistrableController';
import { Application, NextFunction, Request, Response } from 'express';
import { dataResponse } from '../util/response';
import { UserService } from '../service/user.service';
import Types from '../config/types';
import { FirebaseService } from '../service/firebase.service';
import { JWTService } from '../service/jwt.service';
import { AuthMiddleware } from '../middleware/auth.middleware';

@injectable()
export class AuthController implements RegistrableController {

    @inject(Types.AuthMiddleware)
    private authMiddleware: AuthMiddleware;

    @inject(Types.UserService)
    private userService: UserService;

    @inject(Types.FirebaseService)
    private firebaseService: FirebaseService;

    @inject(Types.JWTService)
    private jwtService: JWTService;

    public register(app: Application): void {

        app.post('/login', async (req: Request, res: Response, next: NextFunction) => {
            try {
                const { token } = req.body;
                const firebaseUser = await this.firebaseService.verifyToken(token);
                const user = await this.userService.findByPhoneAndFirebaseUid(firebaseUser.phone_number, firebaseUser.uid);
                const result = await this.jwtService.generateAccessToken(user);
                return dataResponse(res, { accessToken: result });
            } catch (error) {
                console.log(error)
                return next(error);
            }
        });

        app.post('/signup', async (req: Request, res: Response, next: NextFunction) => {
            try {
                const { name, phone, instagram, firebaseUid } = req.body;
                await this.userService.validateUserDoesntExists(phone, firebaseUid);
                await this.userService.signUp(name, phone, instagram, firebaseUid);
                return dataResponse(res, 'User created successfully');
            } catch (error) {
                return next(error);
            }
        });

        app.post('/authenticate', this.authMiddleware.isAuthenticated.bind(this.authMiddleware),
            async (req: Request, res: Response, next: NextFunction) => {
            try {
                return dataResponse(res, res.req.body.user);
            } catch (error) {
                return next(error);
            }
        })

        app.get('/list', async (req: Request, res: Response, next: NextFunction) => {
            try {
                const result = await this.userService.getAll();
                return dataResponse(res, result);
            } catch (error) {
                return next(error);
            }
        });

    }

}