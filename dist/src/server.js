"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
const connect_1 = __importDefault(require("./db/connect"));
const config_1 = require("./config");
const logger_1 = __importDefault(require("./utils/logger"));
const startServer = async () => {
    try {
        // Connect to database
        await (0, connect_1.default)();
        // Start server
        const server = app_1.default.listen(config_1.env.PORT, () => {
            logger_1.default.info(`Server running on port ${config_1.env.PORT} in ${config_1.env.NODE_ENV} mode`);
            logger_1.default.info(`API Documentation available at http://localhost:${config_1.env.PORT}/docs`);
            logger_1.default.info(`Health check available at http://localhost:${config_1.env.PORT}/healthz`);
        });
        // Graceful shutdown
        const gracefulShutdown = (signal) => {
            logger_1.default.info(`Received ${signal}. Starting graceful shutdown...`);
            server.close((err) => {
                if (err) {
                    logger_1.default.error('Error during server shutdown:', err);
                    process.exit(1);
                }
                logger_1.default.info('Server closed. Exiting process...');
                process.exit(0);
            });
            // Force shutdown after 30 seconds
            setTimeout(() => {
                logger_1.default.error('Forced shutdown after timeout');
                process.exit(1);
            }, 30000);
        };
        // Handle shutdown signals
        process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
        process.on('SIGINT', () => gracefulShutdown('SIGINT'));
        // Handle uncaught exceptions
        process.on('uncaughtException', (error) => {
            logger_1.default.error('Uncaught Exception:', error);
            process.exit(1);
        });
        // Handle unhandled promise rejections
        process.on('unhandledRejection', (reason, promise) => {
            logger_1.default.error('Unhandled Rejection at:', promise, 'reason:', reason);
            process.exit(1);
        });
    }
    catch (error) {
        logger_1.default.error('Failed to start server:', error);
        process.exit(1);
    }
};
// Start the server
startServer();
//# sourceMappingURL=server.js.map