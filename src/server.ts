import { app } from "./app.js";
import { checkPrismaStatus } from "./database/prisma.js";
import { seedDatabase } from "./database/seed.js";
import { env } from './config/env.js';

const startApp = async () => {

  const isDbConnected = await checkPrismaStatus();

  if (!isDbConnected) {
    console.error('База данных недоступна. Принудительное отключение приложения.');
    process.exit(1);
  }

  await seedDatabase();

  app.listen(env.PORT, () => {
    console.log(`Server started on port ${env.PORT}`);
  });
};

startApp();
