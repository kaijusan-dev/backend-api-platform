import { Prisma } from "@prisma/client";
import type { CreateUser, UpdateUser } from "./users.types.js";
import * as usersRepository from './users.repository.js';
import { exclude } from "../../shared/utils/exclude.js";
import { BadRequestError, ConflictError, UserNotFoundError } from "../../shared/errors/http.errors.js";

export const getUsers = async (page: number, limit: number) => {
    const skip = (page - 1) * limit;

    const [users, total] = await usersRepository.getUsers(skip, limit);

    const publicUsers = exclude(users, ['passwordHash']);

    return { publicUsers, total };
}

export const getUserById = async (id: number) => {
    const user = await usersRepository.getUserById(id);

    if (!user) throw new UserNotFoundError();

    const publicUser = exclude(user, ['passwordHash']);

    return publicUser;
}

export const getUserByUsername = async (username: string) => {
    const user = await usersRepository.getUserByUsername(username);

    if (!user) throw new UserNotFoundError();

    const publicUser = exclude(user, ['passwordHash']);

    return publicUser;
}

export const createUser = async (user: CreateUser) => {
    try {
        const createdUser = await usersRepository.createUser(user);

        const publicUser = exclude(createdUser, ['passwordHash']);

        return publicUser;
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
        const updatedUser = await usersRepository.updateUser(id, user);

        const publicUser = exclude(updatedUser, ['passwordHash']);

        return publicUser;
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
