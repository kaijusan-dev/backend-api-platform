import { createClient } from 'redis';
import { logger } from '../config/logger.js';
import { env } from '../config/env.js';

export const redisClient = createClient({
  url: env.REDIS_URL
});

redisClient.on('error', (err) => logger.error('Ошибка подключения Redis:', err));
redisClient.on('connect', () => logger.info('Успешное подключение к Redis'));

export const invalidateCacheByPattern = async (pattern: string) => {
  if (!redisClient.isOpen) {
    logger.warn(`Redis недоступен. Пропущена очистка кэша для: ${pattern}`);
    return;
  }

  let cursor = '0';

  try {
    do {
      // Проверяем каждые 100 ключей
      const reply = await redisClient.scan(cursor, {
        MATCH: pattern,
        COUNT: 100,
      });

      cursor = reply.cursor;
      const keysToDelete = reply.keys;

      // Если нашли ключи, удаляем их пачкой
      if (keysToDelete.length > 0) {
        await redisClient.del(keysToDelete);
        logger.info(`Удалено ключей: ${keysToDelete.length} по маске "${pattern}"`);
      }
    } while (cursor !== '0');

  } catch (error) {
    logger.error({ err: error }, `Ошибка при выполнении SCAN для маски ${pattern}:`);
  }
};

export const connectRedis = async () => {
  if (!redisClient.isOpen) {
    await redisClient.connect();
  }
};