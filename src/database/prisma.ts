import { PrismaClient } from "@prisma/client";
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import { env } from "../config/env.js";

const pool = new Pool({
  connectionString: env.DATABASE_URL,
});

const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

export const checkPrismaStatus = async () => {
  try {
    // простой запрос к базе для проверки работоспособности
    await prisma.$queryRaw`SELECT 1`;
    console.log('Prisma и база данных работают нормально!');
    return true;
  } catch (error) {
    console.error('Ошибка подключения к базе данных через Prisma');
    return false;
  } finally {
    await prisma.$disconnect();
  }
}

export default prisma;
