import express from 'express';
import * as usersController from './users.controller.js';
import { authMiddleware } from '../../middleware/auth.middleware.js';

export const usersRouter = express.Router();

usersRouter.get('/', usersController.getUsers);
usersRouter.get('/me', authMiddleware, usersController.getMe);
usersRouter.get('/:id', usersController.getUserById);
usersRouter.post('/', usersController.createUser);
usersRouter.patch('/:id', usersController.updateUser);
usersRouter.delete('/:id', usersController.deleteUser);
