import z from "zod";

export type JwtPayload = {
    userId: number
}

export type RefreshToken = {
    token: string,
    userId: number,
    expiresAt: Date
}

export const RegisterUserSchema = z.object({
    username: z.string().min(2),
    email: z.string().email(),
    password: z.string().min(6).max(18)
});

export const LoginUserSchema = z.object({
    username: z.string().min(2),
    password: z.string().min(6),
});

export const RefreshTokenSchema = z.object({
    refreshToken: z.string().min(2),
});

export type RegisterUser = z.infer<typeof RegisterUserSchema>;

export type LoginUser = z.infer<typeof LoginUserSchema>;
