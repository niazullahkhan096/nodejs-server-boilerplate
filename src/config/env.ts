import { z } from 'zod';
import { config } from 'dotenv';
import fs from 'fs';
import path from 'path';

// Load environment variables
config();

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.string().transform(Number).pipe(z.number().min(1).max(65535)).default('4000'),
  
  // Database
  MONGO_URI: z.string().url(),
  
  // Logging
  LOG_LEVEL: z.enum(['fatal', 'error', 'warn', 'info', 'debug', 'trace']).default('info'),
  LOG_TO_FILE: z.string().transform(val => val === 'true').default('false'),
  LOG_DIR: z.string().default('./logs'),
  LOG_MAX_SIZE: z.string().transform(Number).pipe(z.number().positive()).default('10485760'), // 10MB
  LOG_MAX_FILES: z.string().transform(Number).pipe(z.number().positive()).default('5'),
  LOG_ROTATE_INTERVAL: z.string().default('1d'),
  
  // CORS
  CORS_ORIGIN: z.string().url().default('http://localhost:5173'),
  
  // JWT
  JWT_ACCESS_SECRET: z.string().min(32),
  JWT_REFRESH_SECRET: z.string().min(32),
  JWT_ACCESS_EXP: z.string().default('15m'),
  JWT_REFRESH_EXP: z.string().default('7d'),
  
  // Cookies
  USE_COOKIES: z.string().transform(val => val === 'true').default('false'),
  COOKIE_SECURE: z.string().transform(val => val === 'true').default('false'),
  COOKIE_SAME_SITE: z.enum(['strict', 'lax', 'none']).default('lax'),
  
  // Rate Limiting
  RATE_LIMIT_WINDOW_MS: z.string().transform(Number).pipe(z.number().positive()).default('900000'),
  RATE_LIMIT_MAX: z.string().transform(Number).pipe(z.number().positive()).default('100'),
  
  // File Storage
  UPLOAD_DIR: z.string().default('./uploads'),
  MAX_FILE_SIZE: z.string().transform(Number).pipe(z.number().positive()).default('10485760'),
  
  // Database Seeding
  ALLOW_DB_SEED: z.string().transform(val => val === 'true').default('false'),
  ADMIN_EMAIL: z.string().email().optional(),
  ADMIN_PASSWORD: z.string().min(8).optional(),
  
  // Internationalization
  DEFAULT_LANGUAGE: z.enum(['en', 'es', 'fr', 'de', 'ar']).default('en'),
});

const parseEnv = () => {
  try {
    return envSchema.parse(process.env);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const missingVars = error.errors.map(err => err.path.join('.')).join(', ');
      throw new Error(`Invalid environment variables: ${missingVars}`);
    }
    throw error;
  }
};

const env = parseEnv();

// Create upload directory if it doesn't exist (development only)
if (env.NODE_ENV === 'development') {
  const uploadDir = path.resolve(env.UPLOAD_DIR);
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }
}

// Create logs directory if it doesn't exist
const logDir = path.resolve(env.LOG_DIR);
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true });
}

export default env;
