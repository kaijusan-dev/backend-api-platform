import { PrismaClient } from "@prisma/client";
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import { env } from "../config/env.js";
import { logger } from "../config/logger.js";

const connectionString = process.env.DATABASE_URL || (
  process.env.VITEST === 'true' 
    ? env.DATABASE_URL_TEST 
    : env.DATABASE_URL
);

const pool = new Pool({
  connectionString
});

const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

export const checkPrismaStatus = async () => {
  try {
    // простой запрос к базе для проверки работоспособности
    await prisma.$queryRaw`SELECT 1`;

    logger.info('Успешное подключение к базе данных через Prisma');

    return true;

  } catch (error) {
    logger.error({ err: error }, 'Ошибка подключения к базе данных через Prisma');

    return false;
  }
}

export default prisma;
