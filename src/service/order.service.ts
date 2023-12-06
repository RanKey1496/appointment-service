import { Service } from '../entity/service.entity';
import { Order } from '../entity/order.entity';
import { User } from '../entity/user.entity';
import { inject, injectable } from 'inversify';
import Types from '../config/types';
import { OrderRepository } from '../repository/order.repository';
import moment from 'moment';
import { OrderService as OrderServiceEntity } from '../entity/orderService.entity';
import { OrderServiceRepository } from '../repository/orderService.repository';

export interface OrderService {
    calculateHours(hour: string, services: Service[]): { start: Date, end: Date};
    calculateValues(services: Service[]): { priceTotal: number, advancePayment: number};
    saveNewOrder(services: Service[], user: User, dates: { start: Date, end: Date},
        values: { priceTotal: number, advancePayment: number}): Promise<Order>;
}

@injectable()
export class OrderServiceImpl implements OrderService {

    @inject(Types.OrderRepository)
    private orderRepository: OrderRepository;

    @inject(Types.OrderServiceRepository)
    private orderServiceRepository: OrderServiceRepository;

    public async saveNewOrder(services: Service[], user: User, dates: { start: Date, end: Date},
        values: { priceTotal: number, advancePayment: number}): Promise<Order> {
        const order = new Order();
        order.user = user;
        order.priceTotal = values.priceTotal;
        order.advancePayment = values.advancePayment;
        order.startDatetime = dates.start;
        order.endDatetime = dates.end;
        const orderSaved = await this.orderRepository.save(order);

        const orderServicesSaved = [];
        for (const service of services) {
            const orderService = new OrderServiceEntity();
            orderService.order = orderSaved;
            orderService.service = service;
            const orderServiceSaved = await this.orderServiceRepository.save(orderService);
            orderServicesSaved.push(orderServiceSaved);
        }

        return orderSaved;
    }

    public calculateHours(hour: string, services: Service[]): { start: Date, end: Date} {
        const startDate = moment(hour);
        const duration = services.reduce((acc, curr) => acc + curr.duration, 0);
        const endDate = moment(hour).add(duration, 'minutes');
        return { start: startDate.toDate(), end: endDate.toDate() };
    }

    public calculateValues(services: Service[]): { priceTotal: number; advancePayment: number; } {
        const priceTotal = services.reduce((acc, curr) => acc + curr.price, 0);
        const advancePayment = priceTotal * 0.2;
        return { priceTotal, advancePayment };
    }

}