import { initContract } from '@ts-rest/core';
import { ErrorResponseSchema } from '../../shared/errors/error.schema.js';
import { CreateUserSchema, PaginationQuerySchema, UpdateUserSchema, UserParamsSchema, UserResponseSchema, UsersResponseSchema } from './users.types.js';
import { z } from 'zod';

const c = initContract();

export const usersContract = c.router({
    getUsers: {
        method: 'GET',
        path: '/users',
        query: PaginationQuerySchema,
        responses: {
            200: UsersResponseSchema,
            400: ErrorResponseSchema
        },
    },
    getUser: {
        method: 'GET',
        path: '/users/:id',
        pathParams: UserParamsSchema,
        responses: {
            200: UserResponseSchema,
            400: ErrorResponseSchema,
            404: ErrorResponseSchema,
        },
    },
    createUser: {
        method: 'POST',
        path: '/users',
        body: CreateUserSchema,
        responses: {
            201: UserResponseSchema,
            409: ErrorResponseSchema,
            400: ErrorResponseSchema,
        },
    },
    updateUser: {
        method: 'PATCH',
        path: '/users/:id',
        pathParams: UserParamsSchema,
        body: UpdateUserSchema,
        responses: {
            200: UserResponseSchema,
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