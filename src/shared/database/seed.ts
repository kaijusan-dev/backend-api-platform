import { logger } from '../config/logger.js';
import prisma from './prisma.js';

const testUsers = [
  { email: 'alice@example.com', username: 'alice', passwordHash: 'hash' },
  { email: 'bob@example.com', username: 'bob', passwordHash: 'hash' },
  { email: 'carol@example.com', username: 'carol', passwordHash: 'hash' },
];

export const seedDatabase = async () => {
  try {
    const usersCount = await prisma.user.count();

    if (usersCount > 0) {
      logger.info('Таблица пользователей уже содержит тестовые данные');
      return;
    }

    logger.info('Таблица пользователей пуста. Начинаем наполнение тестовыми данными...');
    
    const result = await prisma.user.createMany({ data: testUsers });

    logger.info({ count: result.count }, 'Тестовые пользователи успешно добавлены');
  } catch (error) {
    logger.error({ err: error }, 'Ошибка при наполнении базы данных тестовыми данными');

    throw error;
  }
};
