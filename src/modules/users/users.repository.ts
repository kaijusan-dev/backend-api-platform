import prisma from "../../shared/database/prisma.js";
import type { CreateUser, QueryForDb, UpdateUser } from "./users.types.js";

export const getUsers = async (queryForDb: QueryForDb) => {
    return prisma.$transaction([
        prisma.user.findMany({ ...queryForDb }),
        prisma.user.count({
            where: queryForDb.where
        }),
    ]);
}

export const getUserById = async (id: number) => {
    return prisma.user.findUnique({
        where: {
            id
        }
    });
}

export const getUserByUsername = async (username: string) => {
    return prisma.user.findUnique({
        where: { 
            username
        }
    });
};

export const createUser = async (user: CreateUser) => {
    return prisma.user.create({ data: user });
}

export const updateUser = async (id: number, user: UpdateUser) => {
    // Удаляем из объекта все поля, которые имеют значение undefined, 
    const updateData = Object.fromEntries(
        Object.entries(user).filter(([_key, value]) => value !== undefined)
    );

    return prisma.user.update({
        where: { id },
        data: updateData,
    });
};

export const deleteUser = async (id: number) => {
    return prisma.user.delete({
        where: {
            id
        }
    });
}

