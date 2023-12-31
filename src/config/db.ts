import { Service } from '../entity/service.entity';
import { ScheduleDay } from '../entity/schedule.entity';
import { User } from '../entity/user.entity';
import { OTP } from '../entity/otp.entity';
import { DataSource, DataSourceOptions } from 'typeorm';
import { Order } from '../entity/order.entity';
import { OrderService } from '../entity/orderService.entity';

const dbOptions: DataSourceOptions = {
    type: 'postgres',
    host: process.env.DB_HOST,
    port: +Number(process.env.DB_PORT || 5432),
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    entities: [
        User,
        OTP,
        ScheduleDay,
        Service,
        Order,
        OrderService
    ],
    logging: Boolean(process.env.DB_LOGGING || false),
    synchronize: Boolean(process.env.DB_SYNC || false),
    ssl: true,
    extra: {
        ssl: {
            rejectUnauthorzed: false
        }
    }
};

export const dataSource = new DataSource(dbOptions);