import { z } from 'zod';

export const UserParamsSchema = z.object({
    id: z.string().min(1),
});

export const UserSchema = z.object({
    id: z.string(),
    name: z.string().min(2),
    email: z.email(),
});

export const CreateUserSchema = z.object({
    name: z.string().min(2),
    email: z.email(),
});

export const PartialUserSchema = CreateUserSchema.partial();

export type User = z.infer<typeof UserSchema>;

export type CreateUser = z.infer<typeof CreateUserSchema>;

export type PartialUser = z.infer<typeof PartialUserSchema>;