import 'reflect-metadata';
import express, { Application, Request, Response, NextFunction } from 'express';
import compression from 'compression';
import helmet from 'helmet';
import morgan from 'morgan';
import cors from 'cors';
import { container } from './config/inversify';
import { RegistrableController } from './controller/RegistrableController';
import { NotFound, BadRequest, Unauthorize, Conflict } from './util/exceptions';
import { notFoundResponse, badRequestResponse, unauthorizeResponse, conflictResponse, internalResponse } from './util/response';
import { DataSource } from 'typeorm';
import { dataSource } from './config/db';
import Types from './config/types';

export default class App {

    private async init() {

        const app: Application = express();
        app.set('port', process.env.PORT || 3000);

        app.use(compression());
        app.use(helmet());
        app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));
        app.use(cors());
        app.use(express.json());

        const controllers: RegistrableController[] = container.getAll<RegistrableController>(Types.Controller);
        controllers.forEach(controller => controller.register(app));

        app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
            if (err instanceof NotFound) {
                return notFoundResponse(res, err.message);
            }
            if (err instanceof BadRequest) {
                return badRequestResponse(res, err.message);
            }
            if (err instanceof Unauthorize) {
                return unauthorizeResponse(res, err.message);
            }
            if (err instanceof Conflict) {
                return conflictResponse(res, err.message);
            }
            return internalResponse(res);
        });

        return Promise.resolve(app);
    }

    public async start(): Promise<{ App: Application, Database: DataSource }> {
        const db = await dataSource.initialize();
        const app = await this.init();
        app.listen(app.get('port'), async () => {
            console.log(`Service running at port ${app.get('port')} in ${app.get('env')} mode`);
            console.log('Date: ', new Date());
        });
        return Promise.resolve({ App: app, Database: db });
    }

}