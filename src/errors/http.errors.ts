export class HttpError extends Error {
    statusCode: number;
    constructor(
        name: string,
        message: string,
        statusCode: number
    ) {
        super(message);
        this.name = name;
        this.statusCode = statusCode;
    };
};

export class UserNotFoundError extends HttpError {
    constructor() {
        super('UserNotFoundError', 'Пользователь не найден!', 404);
    };
};

export class PathNotFoundError extends HttpError {
    constructor(
        path: string
    ) {
        super('PathNotFoundError', `Маршрут ${path} не найден`, 404);
    };
};


export class BadRequestError extends HttpError {
    constructor() {
        super('BadRequestError', 'Неверный запрос!', 400);
    };
};
