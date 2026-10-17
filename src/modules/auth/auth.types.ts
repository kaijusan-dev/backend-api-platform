import z from "zod";
import { UserSchema } from "../users/users.types.js";

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

export const AccessTokenSchema = z.object({
    accessToken: z.string().min(2),
});

export const RefreshTokenSchema = z.object({
    refreshToken: z.string().min(2),
});

export const AuthResponseSchema = z.object({ user: UserSchema })
  .merge(AccessTokenSchema)
  .merge(RefreshTokenSchema);

export const RefreshTokenResponseSchema = AccessTokenSchema
  .merge(RefreshTokenSchema);

export type RegisterUser = z.infer<typeof RegisterUserSchema>;

export type LoginUser = z.infer<typeof LoginUserSchema>;
