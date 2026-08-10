import { Prisma } from "@prisma/client";
import prisma from "../../database/prisma.js";
import { BadRequestError, ConflictError, UserNotFoundError } from "../../errors/http.errors.js";
import type { CreateUser, PartialUser } from "./users.types.js";

export const getUsers = async () => {
    return await prisma.user.findMany({
        orderBy: {
            id: 'asc'
        }
    });
}

export const getUserById = async (id: number) => {
    const user = await prisma.user.findUnique({
        where: {
            id,
        }
    });
    if (!user) throw new UserNotFoundError();
    return user;
}

export const addUser = async (user: CreateUser) => {
    try {
        return await prisma.user.create({ data: user });
    } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
            throw new ConflictError('Пользователь с таким username или email уже существует');
        }
        throw error;
    }
}

export const updateUser = async (id: number, changedUser: PartialUser) => {

    await getUserById(id);

    const { username, email } = changedUser;

    if (!username && !email) throw new BadRequestError();

    try {
        return await prisma.user.update({
            where: {
                id
            },
            data: {
                ...(username !== undefined && { username }),
                ...(email !== undefined && { email }),
            },
        });
    } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
            throw new ConflictError('Пользователь с таким username или email уже существует');
        }
        throw error;
    }
}

// export const deleteUser = (id: string) => {
//     if (!activeUsers.has(id)) throw new UserNotFoundError();
//     activeUsers.delete(id);
//     return;
// }