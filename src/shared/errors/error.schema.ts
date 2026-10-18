import { z } from "zod";

export const ERROR_CODES = [
    'USER_NOT_FOUND',
    'PATH_NOT_FOUND',
    'VALIDATION_ERROR',
    'CONFLICT',
    'UNAUTHORIZED',
    'INTERNAL_SERVER_ERROR',
] as const;

export type ErrorCode = typeof ERROR_CODES[number];

export const ErrorResponseSchema = z.object({
    success: z.literal(false),
    status: z.coerce.number(),
    code: z.enum(ERROR_CODES),
    message: z.string(),
    timestamp: z.string().datetime(),
    stack: z.string().optional(), 
});

export type ErrorResponse = z.infer<typeof ErrorResponseSchema>;