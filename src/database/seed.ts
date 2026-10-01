import prisma from './prisma.js';

const testUsers = [
  { email: 'alice@example.com', username: 'alice', passwordHash: 'hash' },
  { email: 'bob@example.com', username: 'bob', passwordHash: 'hash' },
  { email: 'carol@example.com', username: 'carol', passwordHash: 'hash' },
];

export const seedDatabase = async () => {
  const usersCount = await prisma.user.count();

  if (usersCount > 0) return;

  console.log('Таблица users пуста, добавляю тестовые данные...');
  await prisma.user.createMany({ data: testUsers });
  console.log(`Добавлено ${testUsers.length} тестовых пользователей.`);
};
