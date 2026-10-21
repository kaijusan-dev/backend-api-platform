import express, { type Request, type Response } from 'express';
import { usersRouter } from './modules/users/users.routes.js';
import { PathNotFoundError } from './shared/errors/http.errors.js';
import { authRouter } from './modules/auth/auth.routes.js';
import { setupDocs } from './shared/docs/openapi.js';
import { httpLogger } from './shared/middleware/http-logger.middleware.js';
import { apiContract } from './api.contract.js';
import { errorMiddleware } from './shared/middleware/error.middleware.js';

/* eslint-disable @typescript-eslint/no-explicit-any */
(BigInt.prototype as any).toJSON = function () {
  return this.toString();
};


export const app = express();

app.use(express.json())

app.use(httpLogger);

setupDocs(app, apiContract);

app.get('/', (req: Request, res: Response) => {
	res.send('Hello World!');
});

app.use('/auth', authRouter);

app.use('/users', usersRouter);

// для несуществующих путей
app.use((req) => {
	throw new PathNotFoundError(req.originalUrl);
});

app.use(errorMiddleware);	