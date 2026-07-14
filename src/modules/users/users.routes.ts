import express from 'express';
import * as usersController from './users.controller.js';

export const usersRouter = express.Router();

usersRouter.get('/', usersController.getUsers);
usersRouter.get('/:id', usersController.getUserById);
// usersRouter.post('/', usersController.addUser);
// usersRouter.patch('/:id', usersController.updateUser);
// usersRouter.delete('/:id', usersController.deleteUser);