import { type Request, type Response } from 'express';
import * as usersService from './users.service.js';
import { CreateUserSchema, PaginationQuerySchema, PartialUserSchema, UserParamsSchema } from './users.types.js';
import { BadRequestError } from '../../errors/http.errors.js';

export const getUsers = async (req: Request, res: Response) => {
    const query = PaginationQuerySchema.safeParse(req.query);

    if (!query.success) throw new BadRequestError();

    const [users, total] = await usersService.getUsers(query.data.page, query.data.limit);

    const totalPages = Math.ceil(total / query.data.limit); 

    res.status(200).json({
        data: users,
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

    const { passwordHash, ...publicUser } = user;

    res.status(200).json(publicUser);
}

export const getUserById = async (req: Request, res: Response) => {
    const parsedParams = UserParamsSchema.safeParse(req.params);

    if (!parsedParams.success) throw new BadRequestError();

    const result = await usersService.getUserById(parsedParams.data.id);
    
    res.status(200).json(result);
}

export const createUser = async (req: Request, res: Response) => {
    const parsedBody = CreateUserSchema.safeParse(req.body);

    if (!parsedBody.success) throw new BadRequestError();

    const result = await usersService.createUser(parsedBody.data);

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