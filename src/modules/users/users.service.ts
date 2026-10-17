import { Prisma } from "@prisma/client";
import type { CreateUser, Query, QueryForDb, UpdateUser } from "./users.types.js";
import * as usersRepository from './users.repository.js';
import { BadRequestError, ConflictError, UserNotFoundError } from "../../shared/errors/http.errors.js";

export const getUsers = async (query: Query) => {
    const { page, limit, username, sortBy, orderBy } = query;

    const skip = (page - 1) * limit;

    const where = username ? { 
        username: { 
            contains: username, 
            mode: "insensitive",
        } 
    } : undefined ;

    const prismaOrderBy = sortBy ? { [sortBy]: orderBy ?? "asc"} : undefined;

    const queryForDb: QueryForDb = {
        skip,
        take: limit,
        orderBy: prismaOrderBy,
        where
    }

    const [users, total] = await usersRepository.getUsers(queryForDb);

    return { users, total };
}

export const getUserById = async (id: number) => {
    const user = await usersRepository.getUserById(id);

    if (!user) throw new UserNotFoundError();

    return user;
}

export const getUserByUsername = async (username: string) => {
    const user = await usersRepository.getUserByUsername(username);

    if (!user) throw new UserNotFoundError();

    return user;
}

export const createUser = async (user: CreateUser) => {
    try {
        return await usersRepository.createUser(user);
    } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
            throw new ConflictError('Пользователь с таким username или email уже существует');
        }
        throw error;
    }
}

export const updateUser = async (id: number, user: UpdateUser) => {

    const { username, email } = user;

    if (!username && !email) throw new BadRequestError();

    try {
        return await usersRepository.updateUser(id, user);
    } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
            throw new UserNotFoundError();
        }
        else if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
            throw new ConflictError('Пользователь с таким username или email уже существует');
        }
        throw error;
    }
}

export const deleteUser = async (id: number) => {
    try {
        await usersRepository.deleteUser(id);

        return;
    } catch(error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
            throw new UserNotFoundError();
        }
        throw error;
    }
}
