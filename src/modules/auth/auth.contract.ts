import { initContract } from '@ts-rest/core';
import { ErrorResponseSchema } from '../../shared/errors/error.schema.js';
import { AuthResponseSchema, LoginUserSchema, RefreshTokenResponseSchema, RefreshTokenSchema, RegisterUserSchema } from './auth.types.js';

const c = initContract();

export const authContract = c.router({
    registerUser: {
        method: 'POST',
        path: '/auth/register',
        body: RegisterUserSchema,
        responses: {
            201: AuthResponseSchema,
            409: ErrorResponseSchema,
            400: ErrorResponseSchema,
        },
    },
    loginUser: {
        method: 'POST',
        path: '/auth/login',
        body: LoginUserSchema,
        responses: {
            200: AuthResponseSchema,
            400: ErrorResponseSchema,
            401: ErrorResponseSchema,
        },
    },
    refreshToken: {
        method: 'POST',
        path: '/auth/refresh',
        body: RefreshTokenSchema,
        responses: {
            200: RefreshTokenResponseSchema,
            400: ErrorResponseSchema,
            401: ErrorResponseSchema,
        },
    },
});