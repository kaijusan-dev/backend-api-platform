import pino from 'pino';
import { env } from './env.js';

const isDevelopment = env.NODE_ENV === 'development';
const isTest = env.NODE_ENV === 'test';

export const logger = pino({
  level: isTest ? 'silent' : isDevelopment ? 'debug' : 'info',
  ...(isDevelopment && !isTest && {
    transport: {
      target: 'pino-pretty',
      options: {
        colorize: true,
        ignore: 'pid,hostname',
        translateTime: 'HH:MM:ss Z',
      },
    },
  }),
});