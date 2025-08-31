"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const zod_1 = require("zod");
const dotenv_1 = require("dotenv");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
// Load environment variables
(0, dotenv_1.config)();
const envSchema = zod_1.z.object({
    NODE_ENV: zod_1.z.enum(['development', 'production', 'test']).default('development'),
    PORT: zod_1.z.string().transform(Number).pipe(zod_1.z.number().min(1).max(65535)).default('4000'),
    // Database
    MONGO_URI: zod_1.z.string().url(),
    // Logging
    LOG_LEVEL: zod_1.z.enum(['fatal', 'error', 'warn', 'info', 'debug', 'trace']).default('info'),
    // CORS
    CORS_ORIGIN: zod_1.z.string().url().default('http://localhost:5173'),
    // JWT
    JWT_ACCESS_SECRET: zod_1.z.string().min(32),
    JWT_REFRESH_SECRET: zod_1.z.string().min(32),
    JWT_ACCESS_EXP: zod_1.z.string().default('15m'),
    JWT_REFRESH_EXP: zod_1.z.string().default('7d'),
    // Cookies
    USE_COOKIES: zod_1.z.string().transform(val => val === 'true').default('false'),
    COOKIE_SECURE: zod_1.z.string().transform(val => val === 'true').default('false'),
    COOKIE_SAME_SITE: zod_1.z.enum(['strict', 'lax', 'none']).default('lax'),
    // Rate Limiting
    RATE_LIMIT_WINDOW_MS: zod_1.z.string().transform(Number).pipe(zod_1.z.number().positive()).default('900000'),
    RATE_LIMIT_MAX: zod_1.z.string().transform(Number).pipe(zod_1.z.number().positive()).default('100'),
    // File Storage
    UPLOAD_DIR: zod_1.z.string().default('./uploads'),
    MAX_FILE_SIZE: zod_1.z.string().transform(Number).pipe(zod_1.z.number().positive()).default('10485760'),
    // Database Seeding
    ALLOW_DB_SEED: zod_1.z.string().transform(val => val === 'true').default('false'),
    ADMIN_EMAIL: zod_1.z.string().email().optional(),
    ADMIN_PASSWORD: zod_1.z.string().min(8).optional(),
    // Internationalization
    DEFAULT_LANGUAGE: zod_1.z.enum(['en', 'es', 'fr', 'de', 'ar']).default('en'),
});
const parseEnv = () => {
    try {
        return envSchema.parse(process.env);
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
            const missingVars = error.errors.map(err => err.path.join('.')).join(', ');
            throw new Error(`Invalid environment variables: ${missingVars}`);
        }
        throw error;
    }
};
const env = parseEnv();
// Create upload directory if it doesn't exist (development only)
if (env.NODE_ENV === 'development') {
    const uploadDir = path_1.default.resolve(env.UPLOAD_DIR);
    if (!fs_1.default.existsSync(uploadDir)) {
        fs_1.default.mkdirSync(uploadDir, { recursive: true });
    }
}
exports.default = env;
//# sourceMappingURL=env.js.map