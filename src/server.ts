import { app } from "./app.js";
import { checkPrismaStatus } from "./shared/database/prisma.js";
import { seedDatabase } from "./shared/database/seed.js";
import { env } from './shared/config/env.js';
import { logger } from "./shared/config/logger.js";

const startApp = async () => {

  try {
    const isDbConnected = await checkPrismaStatus();

    if (!isDbConnected) {
      throw new Error('База данных недоступна');
    }

    await seedDatabase();

    app.listen(env.PORT, () => {
      logger.info(`Server started on port ${env.PORT}`);
    });

  } catch (error) {

    const errorMessage = error instanceof Error ? error.stack : String(error);

    logger.fatal(`Критическая ошибка при запуске приложения\n${errorMessage}`);
  
    process.exit(1);
  }
};

startApp().catch((error: unknown) => {
  const errorMessage = error instanceof Error ? error.stack : String(error);
  logger.fatal(`Необработанная ошибка запуска\n${errorMessage}`);
  process.exit(1);
});