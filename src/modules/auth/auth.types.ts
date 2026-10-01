import z from "zod";

export type JwtPayload = {
    userId: number
}

export const LoginUserSchema = z.object({
    username: z.string().min(2),
    password: z.string().min(6),
});

export type LoginUser = z.infer<typeof LoginUserSchema>;