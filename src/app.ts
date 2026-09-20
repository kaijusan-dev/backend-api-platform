import express, { type Request, type Response } from 'express';
import { errorMiddleware } from './middleware/error.middleware.js';
import { usersRouter } from './modules/users/users.routes.js';
import { PathNotFoundError } from './errors/http.errors.js';
import { openApiDocument } from './docs/openapi.js';
import { apiReference } from '@scalar/express-api-reference';

export const app = express();

app.use(express.json())

app.get('/docs/openapi.json', (req, res) => {
    res.json(openApiDocument);
});

app.use('/docs', apiReference({url: '/docs/openapi.json'}));

app.get('/', (req: Request, res: Response) => {
	res.send('Hello World!');
});

app.use('/users', usersRouter);

// для несуществующих путей
app.use((req, res) => {
	throw new PathNotFoundError(req.originalUrl);
});

app.use(errorMiddleware);	