const Types = {
    Controller: Symbol('Controller'),

    AuthMiddleware: Symbol('AuthMiddleware'),

    UserService: Symbol('UserService'),
    FirebaseService: Symbol('FirebaseService'),
    JWTService: Symbol('JWTService'),
    CalendarService: Symbol('CalendarService'),
    ScheduleService: Symbol('ScheduleService'),

    UserRepository: Symbol('UserRepository'),
    ScheduleRepository: Symbol('ScheduleRepository')
};

export default Types;