import { type Request, type Response } from 'express';
import * as usersService from './users.service.js';
import { CreateUserSchema, PartialUserSchema, UserParamsSchema } from './users.types.js';
import { BadRequestError } from '../../errors/http.errors.js';

export const getUsers = async (req: Request, res: Response) => {
    const result = await usersService.getUsers();
    res.status(200).json(result);
}

export const getUserById = async (req: Request, res: Response) => {
    const parsedParams = UserParamsSchema.safeParse(req.params);

    if (!parsedParams.success) throw new BadRequestError();

    const result = await usersService.getUserById(parsedParams.data.id);
    
    res.status(200).json(result);
}

export const addUser = async (req: Request, res: Response) => {
    const parsedBody = CreateUserSchema.safeParse(req.body);

    if (!parsedBody.success) throw new BadRequestError();

    const result = await usersService.addUser(parsedBody.data);

    res.status(201).json(result); 
}

export const updateUser = async (req: Request, res: Response) => {
    const parsedParams = UserParamsSchema.safeParse(req.params);
    const parsedBody = PartialUserSchema.safeParse(req.body);

    if (!parsedParams.success || !parsedBody.success) throw new BadRequestError();

    const result = await usersService.updateUser(parsedParams.data.id, parsedBody.data);

    res.status(200).json(result);
}

export const deleteUser = async (req: Request, res: Response) => {
    const parsedParams = UserParamsSchema.safeParse(req.params);

    if (!parsedParams.success) throw new BadRequestError();

    await usersService.deleteUser(parsedParams.data.id);

    res.sendStatus(204);
}

export const clearUsers = async (req: Request, res: Response) => {

    await usersService.clearUsers();

    res.sendStatus(204);
}