"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = exports.errorConverter = exports.ApiError = void 0;
const zod_1 = require("zod");
const mongoose_1 = __importDefault(require("mongoose"));
const apiResponse_1 = require("../utils/apiResponse");
const logger_1 = __importDefault(require("../utils/logger"));
class ApiError extends Error {
    statusCode;
    details;
    constructor(statusCode, message, details) {
        super(message);
        this.statusCode = statusCode;
        this.details = details;
        this.name = 'ApiError';
    }
}
exports.ApiError = ApiError;
const errorConverter = (err, req, res, next) => {
    let error = err;
    if (!(error instanceof ApiError)) {
        const statusCode = error instanceof zod_1.ZodError ? 400 :
            error instanceof mongoose_1.default.Error.ValidationError ? 400 :
                error instanceof mongoose_1.default.Error.CastError ? 400 :
                    error.name === 'MongoError' && error.code === 11000 ? 409 :
                        500;
        const messageKey = error instanceof zod_1.ZodError ? 'validation.error' :
            error instanceof mongoose_1.default.Error.ValidationError ? 'validation.error' :
                error instanceof mongoose_1.default.Error.CastError ? 'validation.error' :
                    error.name === 'MongoError' && error.code === 11000 ? 'validation.error' :
                        'server.error';
        const details = error instanceof zod_1.ZodError ?
            error.errors.reduce((acc, curr) => {
                const field = curr.path.join('.');
                if (!acc[field])
                    acc[field] = [];
                acc[field].push(curr.message);
                return acc;
            }, {}) : undefined;
        error = new ApiError(statusCode, messageKey, details);
    }
    next(error);
};
exports.errorConverter = errorConverter;
const errorHandler = (err, req, res, next) => {
    const { statusCode, message, details } = err;
    const language = (0, apiResponse_1.getLanguageFromRequest)(req);
    // Log error
    logger_1.default.error({
        err: {
            message: err.message,
            stack: err.stack,
            statusCode,
            details,
        },
        req: {
            method: req.method,
            url: req.url,
            ip: req.ip,
            userAgent: req.get('User-Agent'),
        },
    });
    // Send error response
    (0, apiResponse_1.sendError)(res, message, statusCode, details, language);
};
exports.errorHandler = errorHandler;
//# sourceMappingURL=error.js.map