import * as usersService from '../users/users.service.js';
import * as authRepository from './auth.repository.js';
import * as bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { env } from "../../shared/config/env.js";
import type { JwtPayload, LoginUser, RefreshToken, RegisterUser } from "./auth.types.js";
import { UnauthorizedError } from '../../shared/errors/http.errors.js';

export const registerUser = async (user: RegisterUser) => {

    const { password, ...userWithoutPassword } = user;

    const userDataForDb = {
        ...userWithoutPassword,
        passwordHash: await bcrypt.hash(user.password, 10)
    }

    const createdUser = await usersService.createUser(userDataForDb);

    const accessToken = jwt.sign({userId: createdUser.id}, env.JWT_SECRET, {expiresIn: '15m'});

    const refreshToken = await generateRefreshToken(createdUser.id);

    const { passwordHash, ...publicUser } = createdUser;

    return {
        user: publicUser,
        accessToken,
        refreshToken: refreshToken.token
    };
}

export const loginUser = async (data: LoginUser) => {

    const user = await usersService.getUserByUsername(data.username);

    const isValidPassword = await bcrypt.compare(
        data.password, 
        user.passwordHash
    );

    if (!isValidPassword) throw new UnauthorizedError('wrong_password');

    const accessToken = jwt.sign({ userId: user.id }, env.JWT_SECRET, {expiresIn: '15m'});

    const refreshToken = await generateRefreshToken(user.id);

    const { passwordHash, ...publicUser } = user;

    return {
        user: publicUser,
        accessToken,
        refreshToken: refreshToken.token
    };
}

export const generateRefreshToken = async (userId: number) => {

    const token = jwt.sign({ userId }, env.JWT_SECRET, { expiresIn: '7d' });

    const refreshToken = {
        token,
        userId,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    };

    return authRepository.createRefreshToken(refreshToken);
}

export const refreshToken = async (token: string) => {

    let isValidToken: JwtPayload, userId: number;

    try {
        isValidToken = jwt.verify(token, env.JWT_SECRET) as JwtPayload;
        userId = isValidToken.userId;
    } catch(e) {
        throw new UnauthorizedError('invalid_token');
    }

    const isTokenExist = await authRepository.checkRefreshToken(token);

    if (!isTokenExist || isTokenExist.expiresAt < new Date()) throw new UnauthorizedError('token_expired');

    const accessToken = jwt.sign({ userId }, env.JWT_SECRET, { expiresIn: '15m' });

    await authRepository.deleteRefreshToken(token);

    const refreshToken = await generateRefreshToken(userId);

    return {
        accessToken,
        refreshToken: refreshToken.token
    };
}