import express, { type Request, type Response } from 'express';
import {env} from './config/env.js';
import { errorMiddleware } from './middleware/error.middleware.js';
import { usersRouter } from './modules/users/users.routes.js';
import { PathNotFoundError } from './errors/http.errors.js';

const app = express();

app.use(express.json())

app.get('/', (req: Request, res: Response) => {
	res.send('Hello World!');
});

app.use('/users', usersRouter);

// для несуществующих путей
app.use((req, res) => {
	throw new PathNotFoundError(req.originalUrl);
});

app.use(errorMiddleware);	

app.listen(env.PORT, () => {
	console.log(`Server started on port ${env.PORT}`);
});