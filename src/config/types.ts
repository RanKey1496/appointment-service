const Types = {
    Controller: Symbol('Controller'),

    AuthMiddleware: Symbol('AuthMiddleware'),

    UserService: Symbol('UserService'),
    JWTService: Symbol('JWTService'),
    CalendarService: Symbol('CalendarService'),
    ScheduleService: Symbol('ScheduleService'),
    ServiceService: Symbol('ServiceService'),
    MessageBirdService: Symbol('MessageBirdService'),
    OrderService: Symbol('OrderService'),

    UserRepository: Symbol('UserRepository'),
    ScheduleRepository: Symbol('ScheduleRepository'),
    ServiceRepository: Symbol('ServiceRepository'),
    OTPRepository: Symbol('OTPRepository'),
    OrderRepository: Symbol('OrderRepository'),
    OrderServiceRepository: Symbol('OrderRepository')
};

export default Types;