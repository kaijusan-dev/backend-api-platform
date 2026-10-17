import { PrismaClient } from "@prisma/client";
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import { env } from "../config/env.js";
import { logger } from "../config/logger.js";

const isTest = process.env.VITEST === 'true';

const connectionString = isTest 
    ? env.DATABASE_URL_TEST
    : env.DATABASE_URL;

const pool = new Pool({
  connectionString
});

const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

export const checkPrismaStatus = async () => {
  try {

    // простой запрос к базе для проверки работоспособности
    await prisma.$queryRaw`SELECT 1`;

    logger.info('Prisma and database are working');

    return true;

  } catch (error) {

    const errorMessage = error instanceof Error ? error.stack : String(error);

    logger.error(`Ошибка подключения к базе данных через Prisma\n${errorMessage}`);

    return false;
  }
}

export default prisma;
