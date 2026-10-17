import { type Request, type Response, type NextFunction  } from 'express';
import { env } from '../config/env.js';
import { HttpError } from '../errors/http.errors.js';

export const errorMiddleware = (
  err: Error,
  req: Request,
  res: Response,
  _next: NextFunction
) => {
  const statusCode = err instanceof HttpError ? err.statusCode : 500;
  const message = err.message;
  
  res.status(statusCode).json({
    success: false,
    status: statusCode,
    message: message,
    timestamp: new Date().toISOString(),
    // Стек вызовов показываем только в режиме разработки
    stack: env.NODE_ENV === 'development' ? err.stack : undefined,
  });
};