import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken'
import { env } from '../config/env.js';
import { UnauthorizedError } from '../errors/http.errors.js';
import type { JwtPayload } from '../modules/auth/auth.types.js';

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {

    const authHeader = req.headers['authorization'];

    if (!authHeader || !authHeader.startsWith('Bearer ')) throw new UnauthorizedError("credentials_required");

    const token = authHeader.split(' ')[1];

    if (!token) throw new UnauthorizedError('not_authorized');

    try {
        const decoded = jwt.verify(token, env.JWT_SECRET);

        if (
            typeof decoded !== 'object' ||
            decoded === null ||
            !('userId' in decoded) ||
            typeof decoded.userId !== 'number'
        ) {
            throw new Error();
        }

        req.user = decoded as JwtPayload;
        next();
    } catch (err) {
        if (err instanceof jwt.TokenExpiredError) {
            throw new UnauthorizedError('token_expired');
        }

        throw new UnauthorizedError('invalid_token');
    }
}