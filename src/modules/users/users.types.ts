import { z } from 'zod';

export const UserParamsSchema = z.object({
    id: z.coerce.number().min(1),
});

export const UserSchema = z.object({
    id: z.number(),
    username: z.string().min(2),
    email: z.string().email(),
    created_at: z.date(),
    updated_at: z.date(),
});

export const CreateUserSchema = z.object({
    username: z.string().min(2),
    email: z.string().email(),
});

export const PartialUserSchema = CreateUserSchema.partial();

export type User = z.infer<typeof UserSchema>;

export type CreateUser = z.infer<typeof CreateUserSchema>;

export type PartialUser = z.infer<typeof PartialUserSchema>;
