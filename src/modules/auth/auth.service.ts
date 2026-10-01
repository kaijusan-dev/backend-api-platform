import * as usersService from '../users/users.service.js';
import * as bcrypt from 'bcrypt';
import type { RegisterUser } from "../users/users.types.js";
import jwt from 'jsonwebtoken';
import { env } from "../../config/env.js";
import type { LoginUser } from "./auth.types.js";
import { UnauthorizedError } from '../../errors/http.errors.js';

export const registerUser = async (user: RegisterUser) => {

    const { password, ...userWithoutPassword } = user;

    const userDataForDb = {
        ...userWithoutPassword,
        passwordHash: await bcrypt.hash(user.password, 10)
    }

    const createdUser = await usersService.createUser(userDataForDb);

    const accessToken = jwt.sign({userId: createdUser.id}, env.JWT_SECRET, {expiresIn: '15m'});

    const { passwordHash, ...publicUser } = createdUser;

    return {
        user: publicUser,
        accessToken,
    };
}

export const loginUser = async (data: LoginUser) => {

    const user = await usersService.getUserByUsername(data.username);

    const isValidPassword = await bcrypt.compare(
        data.password, 
        user.passwordHash
    );

    if (!isValidPassword) throw new UnauthorizedError('wrong_password');

    const accessToken = jwt.sign({userId: user.id}, env.JWT_SECRET, {expiresIn: '15m'});

    const { passwordHash, ...publicUser } = user;

    return {
        user: publicUser,
        accessToken,
    };
}
