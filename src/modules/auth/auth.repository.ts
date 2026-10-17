import prisma from '../../shared/database/prisma.js';
import type { RefreshToken } from './auth.types.js';

export const createRefreshToken = async (refreshToken: RefreshToken) => {
    return prisma.refreshToken.create({ data: refreshToken })
}

export const checkRefreshToken = async (token: string) => {
    return prisma.refreshToken.findUnique({ 
        where: {
            token
        }
     })
}

export const deleteRefreshToken = async (token: string) => {
    return prisma.refreshToken.delete({ 
        where: {
            token
        }
     })
}

