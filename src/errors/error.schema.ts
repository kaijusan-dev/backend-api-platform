import { z } from "zod";

export const ErrorResponseSchema = z.object({
    success: z.literal(false),
    status: z.number(),
    message: z.string(),
    timestamp: z.string().datetime(),
});