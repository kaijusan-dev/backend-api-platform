import { app } from "./app.js";
import { checkPrismaStatus } from "./shared/database/prisma.js";
import { seedDatabase } from "./shared/database/seed.js";
import { env } from './shared/config/env.js';
import { logger } from "./shared/config/logger.js";
import { connectRedis } from './shared/database/redis.js';

const startApp = async () => {

  try {
    const isDbConnected = await checkPrismaStatus();

    if (!isDbConnected) {
      throw new Error('База данных недоступна');
    }

    await seedDatabase();

    await connectRedis();

    app.listen(env.PORT, () => {
      logger.info({ port: env.PORT }, "Сервер запущен");
    });

  } catch (error) {
    logger.fatal({ err: error }, "Критическая ошибка при запуске приложения");
  
    process.exit(1);
  }
};

startApp().catch((error: unknown) => {
  logger.fatal({ err: error }, "Необработанная ошибка запуска");

  process.exit(1);
});