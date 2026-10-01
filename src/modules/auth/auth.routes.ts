import express from 'express';
import * as authController from './auth.controller.js';

export const authRouter = express.Router();

authRouter.post('/register', authController.registerUser);
authRouter.post('/login', authController.loginUser);