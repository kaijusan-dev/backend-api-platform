import { Prisma } from "@prisma/client";
import prisma from "../../database/prisma.js";
import { BadRequestError, ConflictError, UserNotFoundError } from "../../errors/http.errors.js";
import type { CreateUser, PartialUser } from "./users.types.js";
import { env } from "../../config/env.js";

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
        await prisma.user.delete({
            where: {
                id
            }
        })
        return;
    } catch(error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
            throw new UserNotFoundError();
        }
        throw error;
    }
}

// export const clearUsers = async () => {
//     if (env.NODE_ENV === 'development') {
//         const result = await prisma.user.deleteMany();
//         console.log(`Удалено ${result.count} пользователей`);
//         return;  
//     };
// }

export const clearUsers = async () => {
  // 1. Исправляем обращение к process.env
  if (env.NODE_ENV === 'development') {
    try {
      // 2. Оборачиваем в try/catch для перехвата ошибок БД
      const result = await prisma.user.deleteMany();
      console.log(`Удалено ${result.count} пользователей`);
      return result; 
    } catch (error) {
      console.error("Ошибка при очистке пользователей:", error);
      throw error;
    }
  } else {
    console.warn("Очистка базы данных доступна только в режиме разработки (development).");
  }
};