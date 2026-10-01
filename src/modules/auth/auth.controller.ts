import { type Request, type Response } from 'express';
import * as authService from './auth.service.js';
import { BadRequestError } from '../../errors/http.errors.js';
import { RegisterUserSchema } from '../users/users.types.js';
import { LoginUserSchema } from './auth.types.js';

export const registerUser = async (req: Request, res: Response) => {
    const parsedBody = RegisterUserSchema.safeParse(req.body);

    if (!parsedBody.success) throw new BadRequestError();

    const result = await authService.registerUser(parsedBody.data);

    res.status(201).json(result); 
}

export const loginUser = async (req: Request, res: Response) => {
    const parsedBody = LoginUserSchema.safeParse(req.body);

    if (!parsedBody.success) throw new BadRequestError();

    const result = await authService.loginUser(parsedBody.data);

    res.status(200).json(result); 
}