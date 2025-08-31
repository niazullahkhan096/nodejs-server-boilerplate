declare const env: {
    NODE_ENV: "development" | "production" | "test";
    PORT: number;
    MONGO_URI: string;
    LOG_LEVEL: "fatal" | "error" | "warn" | "info" | "debug" | "trace";
    CORS_ORIGIN: string;
    JWT_ACCESS_SECRET: string;
    JWT_REFRESH_SECRET: string;
    JWT_ACCESS_EXP: string;
    JWT_REFRESH_EXP: string;
    USE_COOKIES: boolean;
    COOKIE_SECURE: boolean;
    COOKIE_SAME_SITE: "strict" | "lax" | "none";
    RATE_LIMIT_WINDOW_MS: number;
    RATE_LIMIT_MAX: number;
    UPLOAD_DIR: string;
    MAX_FILE_SIZE: number;
    ALLOW_DB_SEED: boolean;
    DEFAULT_LANGUAGE: "en" | "es" | "fr" | "de" | "ar";
    ADMIN_EMAIL?: string | undefined;
    ADMIN_PASSWORD?: string | undefined;
};
export default env;
//# sourceMappingURL=env.d.ts.map