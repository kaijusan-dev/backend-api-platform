import { type Request, type Response } from 'express';
import * as usersService from './users.service.js';
import { CreateUserSchema, PaginationQuerySchema, UpdateUserSchema, UserParamsSchema } from './users.types.js';
import { BadRequestError } from '../../shared/errors/http.errors.js';
import { exclude } from '../../shared/utils/exclude.js';

export const getUsers = async (req: Request, res: Response) => {
    const query = PaginationQuerySchema.safeParse(req.query);

    if (!query.success) throw new BadRequestError();

    const { users, total } = await usersService.getUsers(query.data);

    const totalPages = Math.ceil(total / query.data.limit); 

    const publicUsers = exclude(users, ['passwordHash']);

    res.status(200).json({
        data: publicUsers,
        meta: {
            page: query.data.page,
            limit: query.data.limit,
            total,
            totalPages,
        },
    });
}

export const getMe = async (req: Request, res: Response) => {
    const user = await usersService.getUserById(req.user!.userId);
    const publicUser = exclude(user, ['passwordHash']);
    res.status(200).json(publicUser);
}

export const getUserById = async (req: Request, res: Response) => {
    const parsedParams = UserParamsSchema.safeParse(req.params);

    if (!parsedParams.success) throw new BadRequestError();

    const user = await usersService.getUserById(parsedParams.data.id);

    const publicUser = exclude(user, ['passwordHash']);

    res.status(200).json(publicUser);
}

export const createUser = async (req: Request, res: Response) => {
    const parsedBody = CreateUserSchema.safeParse(req.body);

    if (!parsedBody.success) throw new BadRequestError();

    const user = await usersService.createUser(parsedBody.data);

    const publicUser = exclude(user, ['passwordHash']);

    res.status(201).json(publicUser); 
}

export const updateUser = async (req: Request, res: Response) => {
    const parsedParams = UserParamsSchema.safeParse(req.params);
    const parsedBody = UpdateUserSchema.safeParse(req.body);

    if (!parsedParams.success || !parsedBody.success) throw new BadRequestError();

    const user = await usersService.updateUser(parsedParams.data.id, parsedBody.data);
    
    const publicUser = exclude(user, ['passwordHash']);

    res.status(200).json(publicUser);
}

export const deleteUser = async (req: Request, res: Response) => {
    const parsedParams = UserParamsSchema.safeParse(req.params);

    if (!parsedParams.success) throw new BadRequestError();

    await usersService.deleteUser(parsedParams.data.id);

    res.sendStatus(204);
}