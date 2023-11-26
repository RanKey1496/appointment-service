import { inject, injectable } from 'inversify';
import { RegistrableController } from './RegistrableController';
import { Application, NextFunction, Request, Response } from 'express';
import { dataResponse } from '../util/response';
import Types from '../config/types';
import { ServiceService } from '../service/service.service';

@injectable()
export class ServiceController implements RegistrableController {

    @inject(Types.ServiceService)
    private serviceService: ServiceService;

    public register(app: Application): void {

        app.get('/service', async (req: Request, res: Response, next: NextFunction) => {
            try {
                const result = await this.serviceService.findAll();
                return dataResponse(res, result);
            } catch (error) {
                return next(error);
            }
        });

    }

}