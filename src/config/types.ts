const Types = {
    Controller: Symbol('Controller'),

    AuthMiddleware: Symbol('AuthMiddleware'),

    UserService: Symbol('UserService'),
    JWTService: Symbol('JWTService'),
    CalendarService: Symbol('CalendarService'),
    ScheduleService: Symbol('ScheduleService'),
    ServiceService: Symbol('ServiceService'),
    MessageBirdService: Symbol('MessageBirdService'),

    UserRepository: Symbol('UserRepository'),
    ScheduleRepository: Symbol('ScheduleRepository'),
    ServiceRepository: Symbol('ServiceRepository'),
    OTPRepository: Symbol('OTPRepository')
};

export default Types;