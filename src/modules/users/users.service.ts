import { Prisma } from "@prisma/client";
import { BadRequestError, ConflictError, UserNotFoundError } from "../../errors/http.errors.js";
import type { CreateUser, PartialUser } from "./users.types.js";
import * as usersRepository from './users.repository.js';

export const getUsers = async () => {
    return await usersRepository.getUsers();
}

export const getUserById = async (id: number) => {
    const user = await usersRepository.getUserById(id);
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

export const updateUser = async (id: number, changedUser: PartialUser) => {

    const { username, email } = changedUser;

    if (!username && !email) throw new BadRequestError();

    try {
        return await usersRepository.updateUser(id, changedUser);
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
