import { type Request, type Response, type NextFunction  } from 'express';
import { env } from '../config/env.js';
import { HttpError, type ErrorCode } from '../errors/http.errors.js';
import type { ErrorResponse } from '../errors/error.schema.js';

export const errorMiddleware = (
  err: Error,
  req: Request,
  res: Response,
  _next: NextFunction
) => {
  const status = err instanceof HttpError ? err.statusCode : 500;
  const code: ErrorCode = err instanceof HttpError ? err.code : 'INTERNAL_SERVER_ERROR';
  // Стек вызовов показываем только в режиме разработки
  const stack = env.NODE_ENV === 'development' ? err.stack : undefined;

  const response: ErrorResponse = {
    success: false,
    status,
    code,
    message: err.message,
    timestamp: new Date().toISOString(),
    stack
  }

  res.status(status).json(response);
};