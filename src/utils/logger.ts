import pino from 'pino';
import { env } from '../config';

const transport = pino.transport({
  target: 'pino-pretty',
  options: {
    colorize: true,
    ignore: 'pid,hostname',
    translateTime: 'yyyy-mm-dd HH:MM:ss',
  },
});

const logger = pino(
  {
    level: env.LOG_LEVEL,
    base: {
      env: env.NODE_ENV,
    },
  },
  env.NODE_ENV === 'development' ? transport : undefined
);

export default logger;
