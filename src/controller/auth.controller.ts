import { inject, injectable } from 'inversify';
import { RegistrableController } from './RegistrableController';
import { Application, NextFunction, Request, Response } from 'express';
import { dataResponse } from '../util/response';
import { UserService } from '../service/user.service';
import Types from '../config/types';
import { JWTService } from '../service/jwt.service';
import { AuthMiddleware } from '../middleware/auth.middleware';
import { MessageBirdService } from '../service/messageBird.service';

@injectable()
export class AuthController implements RegistrableController {

    @inject(Types.AuthMiddleware)
    private authMiddleware: AuthMiddleware;

    @inject(Types.UserService)
    private userService: UserService;

    @inject(Types.JWTService)
    private jwtService: JWTService;

    @inject(Types.MessageBirdService)
    private messageBirdService: MessageBirdService;

    public register(app: Application): void {

        app.post('/login', async (req: Request, res: Response, next: NextFunction) => {
            try {
                const { token } = req.body;
                // const firebaseUser = await this.firebaseService.verifyToken(token);
                // const user = await this.userService.findByPhone(firebaseUser.phone_number, firebaseUser.uid);
                // const result = await this.jwtService.generateAccessToken(user);
                // return dataResponse(res, { accessToken: result });
            } catch (error) {
                return next(error);
            }
        });

        app.post('/signup', async (req: Request, res: Response, next: NextFunction) => {
            try {
                const { name, phone, instagram, details } = req.body;
                await this.userService.validateUserDoesntExists(phone);
                const otp = await this.userService.findOTPByDetails(details);
                await this.userService.validateOTPForSignUp(otp, phone);
                const user = await this.userService.signUp(name, phone, instagram);
                const result = await this.jwtService.generateAccessTokenIfUserExists(user);
                return dataResponse(res, result);
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
        });

        app.post('/verify/OTP', async (req: Request, res: Response, next: NextFunction) => {
            try {
                const { details, code } = req.body;
                const otp = await this.userService.findOTPByDetails(details);
                await this.userService.validateOTP(otp, code);
                const phone = await this.userService.decodePhoneFromDetails(otp.details);
                await this.userService.updateOTPVerified(otp);
                const user = await this.userService.findIfUserExistsByPhone(phone);
                const result = await this.jwtService.generateAccessTokenIfUserExists(user);
                return dataResponse(res, result);
            } catch (error) {
                return next(error);
            }
        });

        app.post('/phone/OTP', async (req: Request, res: Response, next: NextFunction) => {
            try {
                const { phone } = req.body;
                const details = await this.userService.encodeOTPDetails(phone);
                const otp = await this.userService.saveOTP(details);
                await this.messageBirdService.sendOTPCode(phone, otp.code);
                return dataResponse(res, details);
            } catch (error) {
                return next(error);
            }
        });

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