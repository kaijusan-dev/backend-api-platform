import type { ErrorCode } from "./error.schema.js";

export class HttpError extends Error {
    statusCode: number;
    code: ErrorCode;

    constructor(
        name: string,
        message: string,
        statusCode: number,
        code: ErrorCode
    ) {
        super(message);
        this.name = name;
        this.statusCode = statusCode;
        this.code = code;
    };
};

export class UserNotFoundError extends HttpError {
    constructor() {
        super('UserNotFoundError', 'Пользователь не найден!', 404, 'USER_NOT_FOUND');
    };
};

export class PathNotFoundError extends HttpError {
    constructor( path: string ) {
        super('PathNotFoundError', `Маршрут ${path} не найден`, 404, 'PATH_NOT_FOUND');
    };
};

export class BadRequestError extends HttpError {
    constructor( message: string = 'Неверный запрос!' ) {
        super('BadRequestError', message, 400, 'VALIDATION_ERROR');
    };
};

export class ConflictError extends HttpError {
    constructor( message: string ) {
        super('ConflictError', message, 409, 'CONFLICT');
    };
};

export class UnauthorizedError extends HttpError {
    constructor( message: string ) {
        super('UnauthorizedError', message, 401, 'UNAUTHORIZED');
    };
};