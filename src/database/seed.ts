import { logger } from '../config/logger.js';
import prisma from './prisma.js';

const testUsers = [
  { email: 'alice@example.com', username: 'alice', passwordHash: 'hash' },
  { email: 'bob@example.com', username: 'bob', passwordHash: 'hash' },
  { email: 'carol@example.com', username: 'carol', passwordHash: 'hash' },
];

export const seedDatabase = async () => {
  const usersCount = await prisma.user.count();

  if (usersCount > 0) return;

  logger.info('Users table is empty, making test data...');
  await prisma.user.createMany({ data: testUsers });
  logger.info(`Added ${testUsers.length} test users`);
};
