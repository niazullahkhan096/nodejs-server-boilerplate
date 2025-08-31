import pino from 'pino';
import { env } from '../config';
import path from 'path';
import fs from 'fs';

// Ensure logs directory exists
const logDir = path.resolve(env.LOG_DIR);
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true });
}

// Define log file paths
const logFiles = {
  combined: path.join(logDir, 'combined.log'),
  error: path.join(logDir, 'error.log'),
  access: path.join(logDir, 'access.log'),
  application: path.join(logDir, 'application.log'),
};

// Create development transport with pretty printing
const createDevTransport = () => {
  return pino.transport({
    target: 'pino-pretty',
    options: {
      colorize: true,
      ignore: 'pid,hostname',
      translateTime: 'yyyy-mm-dd HH:MM:ss',
      messageFormat: '{msg} [id={reqId}]',
    },
  });
};

// Create production transport with file rotation
const createProdTransport = () => {
  return pino.transport({
    targets: [
      // Console output for PM2
      {
        target: 'pino/file',
        level: 'info',
        options: {},
      },
      // Combined log file
      {
        target: 'pino/file',
        level: 'info',
        options: {
          destination: logFiles.combined,
        },
      },
      // Error log file
      {
        target: 'pino/file',
        level: 'error',
        options: {
          destination: logFiles.error,
        },
      },
      // Application log file
      {
        target: 'pino/file',
        level: 'info',
        options: {
          destination: logFiles.application,
        },
      },
    ],
  });
};

// Create transport based on environment and configuration
const createTransport = () => {
  if (env.NODE_ENV === 'development' && !env.LOG_TO_FILE) {
    return createDevTransport();
  }
  
  if (env.LOG_TO_FILE || env.NODE_ENV === 'production') {
    return createProdTransport();
  }
  
  return createDevTransport();
};

// Base logger configuration
const baseConfig = {
  level: env.LOG_LEVEL,
  base: {
    env: env.NODE_ENV,
    pid: process.pid,
  },
  timestamp: pino.stdTimeFunctions.isoTime,
  formatters: {
    level: (label: string) => {
      return { level: label };
    },
  },
  serializers: {
    req: pino.stdSerializers.req,
    res: pino.stdSerializers.res,
    err: pino.stdSerializers.err,
  },
};

// Create logger instance
const logger = pino(
  baseConfig,
  (env.LOG_TO_FILE || env.NODE_ENV === 'production') ? createTransport() : createDevTransport()
);

// Create specialized loggers
export const accessLogger = pino(
  {
    ...baseConfig,
    name: 'access',
  },
  (env.LOG_TO_FILE || env.NODE_ENV === 'production') ? createTransport() : createDevTransport()
);

export const errorLogger = pino(
  {
    ...baseConfig,
    name: 'error',
  },
  (env.LOG_TO_FILE || env.NODE_ENV === 'production') ? createTransport() : createDevTransport()
);

// Helper functions for structured logging
export const logRequest = (req: any, res: any, responseTime: number) => {
  accessLogger.info({
    method: req.method,
    url: req.url,
    status: res.statusCode,
    responseTime,
    userAgent: req.get('User-Agent'),
    ip: req.ip,
    reqId: req.id,
  }, 'HTTP Request');
};

export const logError = (error: Error, req?: any, additionalData?: any) => {
  errorLogger.error({
    error: {
      message: error.message,
      stack: error.stack,
      name: error.name,
    },
    reqId: req?.id,
    ...additionalData,
  }, 'Application Error');
};

export const logDatabase = (operation: string, collection: string, duration: number, success: boolean) => {
  logger.info({
    type: 'database',
    operation,
    collection,
    duration,
    success,
  }, 'Database Operation');
};

export const logSecurity = (event: string, userId?: string, ip?: string, details?: any) => {
  logger.warn({
    type: 'security',
    event,
    userId,
    ip,
    ...details,
  }, 'Security Event');
};

export const logPerformance = (operation: string, duration: number, metadata?: any) => {
  logger.info({
    type: 'performance',
    operation,
    duration,
    ...metadata,
  }, 'Performance Metric');
};

export default logger;
