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

export const UserResponseSchema = z.object({
    id: z.number(),
    username: z.string().min(2),
    email: z.string().email(),
    createdAt: z.string().datetime(),
    updatedAt: z.string().datetime(),
});

export const PaginationMetaSchema = z.object({
  page: z.number(),
  limit: z.number(),
  total: z.number(),
  totalPages: z.number(),
});

export const PaginationQuerySchema = z.object({
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(10),
    username: z.string().min(2).optional(),
    sortBy: UserResponseSchema.keyof().optional(),
    orderBy: z.enum(["asc", "desc"]).optional(),
});

export const QueryForDbSchema = z.object({
    skip: z.number().int(),
    take: z.number().int(),
    where: z.any().optional(),
    orderBy: z.any().optional(),
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

export type Query = z.infer<typeof PaginationQuerySchema>;

export type QueryForDb = z.infer<typeof QueryForDbSchema>