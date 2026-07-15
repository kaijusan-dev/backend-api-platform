import prisma from "../../database/prisma.js";
import { UserNotFoundError } from "../../errors/http.errors.js";

export const getUsers = async () => {
    return await prisma.user.findMany();
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

// export const addUser = (user: CreateUser) => {
//     const nextId = (activeUsers.size > 0 
//         ? Math.max(...Array.from(activeUsers.keys()).map(Number)) + 1 
//         : 1
//     ).toString();

//     const newUser = {...user, id: nextId};

//     activeUsers.set(nextId, newUser);

//     return newUser;
// }

// export const updateUser = (id: string, newUser: PartialUser) => {
//     const currentUser = getUserById(id);

//     const updatedUser = {
//         id: currentUser.id,
//         name: newUser.name ?? currentUser.name,
//         email: newUser.email ?? currentUser.email,
//     };

//     activeUsers.set(id, updatedUser);

//     return updatedUser;
// }

// export const deleteUser = (id: string) => {
//     if (!activeUsers.has(id)) throw new UserNotFoundError();
//     activeUsers.delete(id);
//     return;
// }