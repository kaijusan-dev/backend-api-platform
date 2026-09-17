import prisma from "../../database/prisma.js";
import type { CreateUser, PartialUser } from "./users.types.js";

export const getUsers = async () => {
    return prisma.user.findMany({
        orderBy: {
            id: 'asc'
        }
    });
}

export const getUserById = async (id: number) => {
    return prisma.user.findUnique({
        where: {
            id,
        }
    });
}

export const createUser = async (user: CreateUser) => {
    return prisma.user.create({ data: user });
}

export const updateUser = async (id: number, changedUser: PartialUser) => {

    const { username, email } = changedUser;

    return prisma.user.update({
        where: {
            id
        },
        data: {
            ...(username !== undefined && { username }),
            ...(email !== undefined && { email }),
        },
    });
}

export const deleteUser = async (id: number) => {
    return prisma.user.delete({
        where: {
            id
        }
    });
}

