const Types = {
    Controller: Symbol('Controller'),

    AuthMiddleware: Symbol('AuthMiddleware'),

    UserService: Symbol('UserService'),
    FirebaseService: Symbol('FirebaseService'),
    JWTService: Symbol('JWTService'),
    CalendarService: Symbol('CalendarService'),
    ScheduleService: Symbol('ScheduleService'),
    ServiceService: Symbol('ServiceService'),

    UserRepository: Symbol('UserRepository'),
    ScheduleRepository: Symbol('ScheduleRepository'),
    ServiceRepository: Symbol('ServiceRepository')
};

export default Types;