import { z } from 'zod';

export const UserParamsSchema = z.object({
    id: z.coerce.number().int().min(1),
});

export const UserSchema = z.object({
    id: z.number(),
    username: z.string().min(2),
    email: z.string().email(),
    passwordHash: z.string().min(6),
    created_at: z.string().datetime(),
    updated_at: z.string().datetime(),
});

export const CreateUserSchema = z.object({
    username: z.string().min(2),
    email: z.string().email(),
    passwordHash: z.string(),
});

export const PaginationQuerySchema = z.object({
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(10),
});

export const PaginationMetaSchema = z.object({
  page: z.number(),
  limit: z.number(),
  total: z.number(),
  totalPages: z.number(),
});

export const UserResponseSchema = z.object({
    id: z.number(),
    username: z.string().min(2),
    email: z.string().email(),
    created_at: z.string().datetime(),
    updated_at: z.string().datetime(),
});

export const UsersResponseSchema = z.object({
  data: z.array(UserResponseSchema),
  meta: PaginationMetaSchema,
});

export const UpdateUserSchema = z.object({
    username: z.string().min(2).optional(),
    email: z.string().email().optional(),
});

export type User = z.infer<typeof UserSchema>;

export type PublicUser = Omit<User, 'passwordHash'>;

export type CreateUser = z.infer<typeof CreateUserSchema>;

export type UpdateUser = z.infer<typeof UpdateUserSchema>;
