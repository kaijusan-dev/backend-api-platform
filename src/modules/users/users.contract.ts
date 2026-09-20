import { initContract } from '@ts-rest/core';
import { ErrorResponseSchema } from '../../errors/error.schema.js';
import { CreateUserSchema, PartialUserSchema, UserParamsSchema, UserSchema } from './users.types.js';
import { z } from 'zod';

const c = initContract();

export const usersContract = c.router({
    getUsers: {
        method: 'GET',
        path: '/users',
        responses: {
            200: z.array(UserSchema),
        },
    },
    getUser: {
        method: 'GET',
        path: '/users/:id',
        pathParams: UserParamsSchema,
        responses: {
            200: UserSchema,
            400: ErrorResponseSchema,
            404: ErrorResponseSchema,
        },
    },
    createUser: {
        method: 'POST',
        path: '/users',
        body: CreateUserSchema,
        responses: {
            201: UserSchema,
            409: ErrorResponseSchema,
            400: ErrorResponseSchema,
        },
    },
    updateUser: {
        method: 'PATCH',
        path: '/users/:id',
        pathParams: UserParamsSchema,
        body: PartialUserSchema,
        responses: {
            200: UserSchema,
            409: ErrorResponseSchema,
            400: ErrorResponseSchema,
            404: ErrorResponseSchema,
        },
    },
    deleteUser: {
        method: 'DELETE',
        path: '/users/:id',
        pathParams: UserParamsSchema,
        responses: {
            204: z.void(),
            400: ErrorResponseSchema,
            404: ErrorResponseSchema,
        },
    },
});