import { type Request, type Response, type NextFunction  } from 'express';
import { env } from '../config/env.js';
import { HttpError, type ErrorCode } from '../errors/http.errors.js';

export const errorMiddleware = (
  err: Error,
  req: Request,
  res: Response,
  _next: NextFunction
) => {
  const statusCode = err instanceof HttpError ? err.statusCode : 500;
  const errorCode: ErrorCode = err instanceof HttpError ? err.code : 'INTERNAL_SERVER_ERROR';
  const message = err.message;
  
  res.status(statusCode).json({
    success: false,
    status: statusCode,
    code: errorCode,
    message: message,
    timestamp: new Date().toISOString(),
    // Стек вызовов показываем только в режиме разработки
    stack: env.NODE_ENV === 'development' ? err.stack : undefined,
  });
};