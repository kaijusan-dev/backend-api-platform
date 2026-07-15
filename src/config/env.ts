import 'dotenv/config'
import { z } from 'zod';

const envSchema = z.object({
    PORT: z.coerce.number().int().positive(),
    NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
    DATABASE_URL: z.string(),
})

const _env = envSchema.safeParse(process.env);

if (!_env.success) {
  console.error('Invalid or missing environment variables:');
  const treeError = z.treeifyError(_env.error);
  console.log(JSON.stringify(treeError, null, 2));
  process.exit(1);
}

export const env = _env.data;