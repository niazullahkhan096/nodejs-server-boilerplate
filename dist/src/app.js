"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const helmet_1 = __importDefault(require("helmet"));
const cors_1 = __importDefault(require("cors"));
const compression_1 = __importDefault(require("compression"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const pino_http_1 = __importDefault(require("pino-http"));
const config_1 = require("./config");
const logger_1 = __importDefault(require("./utils/logger"));
const routes_1 = __importDefault(require("./routes"));
const error_1 = require("./middleware/error");
const notFound_1 = require("./middleware/notFound");
const rateLimit_1 = require("./middleware/rateLimit");
const app = (0, express_1.default)();
// Trust proxy for rate limiting
app.set('trust proxy', 1);
// Request logging middleware
app.use((0, pino_http_1.default)({
    logger: logger_1.default,
    genReqId: (req) => req.id,
    customLogLevel: (req, res, err) => {
        if (res.statusCode >= 400 && res.statusCode < 500) {
            return 'warn';
        }
        if (res.statusCode >= 500 || err) {
            return 'error';
        }
        return 'info';
    },
}));
// Security middleware
app.use((0, helmet_1.default)({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'"],
            scriptSrc: ["'self'"],
            imgSrc: ["'self'", "data:", "https:"],
        },
    },
}));
// CORS configuration
app.use((0, cors_1.default)({
    origin: config_1.env.CORS_ORIGIN,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
}));
// Compression middleware
app.use((0, compression_1.default)());
// Body parsing middleware
app.use(express_1.default.json({ limit: '10mb' }));
app.use(express_1.default.urlencoded({ extended: true, limit: '10mb' }));
// Cookie parser middleware
app.use((0, cookie_parser_1.default)());
// Rate limiting
app.use(rateLimit_1.rateLimiter);
// Health check endpoints (before rate limiting)
app.get('/healthz', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Service is healthy',
        timestamp: new Date().toISOString(),
    });
});
app.get('/readyz', (req, res) => {
    // Add any readiness checks here (database connection, etc.)
    res.status(200).json({
        success: true,
        message: 'Service is ready',
        timestamp: new Date().toISOString(),
    });
});
// API routes
app.use('/', routes_1.default);
// 404 handler
app.use(notFound_1.notFound);
// Error handling middleware
app.use(error_1.errorConverter);
app.use(error_1.errorHandler);
exports.default = app;
//# sourceMappingURL=app.js.map