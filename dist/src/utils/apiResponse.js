"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLanguageFromRequest = exports.sendForbidden = exports.sendUnauthorized = exports.sendNotFound = exports.sendValidationError = exports.sendError = exports.sendSuccess = void 0;
const translation_service_1 = require("../services/translation.service");
const config_1 = require("../config");
/**
 * Send a success response with the generic format
 * @param res - Express response object
 * @param data - Response data
 * @param messageKey - Translation key for the message
 * @param statusCode - HTTP status code (default: 200)
 * @param language - Language code for translation (default: 'en')
 */
const sendSuccess = (res, data, messageKey = 'success', statusCode = 200, language = 'en') => {
    const response = {
        code: statusCode,
        message: translation_service_1.TranslationService.getMessage(messageKey, language),
        data
    };
    res.status(statusCode).json(response);
};
exports.sendSuccess = sendSuccess;
/**
 * Send an error response with the generic format
 * @param res - Express response object
 * @param messageKey - Translation key for the message
 * @param statusCode - HTTP status code (default: 500)
 * @param data - Additional error data (optional)
 * @param language - Language code for translation (default: 'en')
 */
const sendError = (res, messageKey = 'server.error', statusCode = 500, data = null, language = 'en') => {
    const response = {
        code: statusCode,
        message: translation_service_1.TranslationService.getMessage(messageKey, language),
        data
    };
    res.status(statusCode).json(response);
};
exports.sendError = sendError;
/**
 * Send a validation error response
 * @param res - Express response object
 * @param errors - Validation errors
 * @param language - Language code for translation (default: 'en')
 */
const sendValidationError = (res, errors, language = 'en') => {
    (0, exports.sendError)(res, 'validation.error', 400, errors, language);
};
exports.sendValidationError = sendValidationError;
/**
 * Send a not found error response
 * @param res - Express response object
 * @param language - Language code for translation (default: 'en')
 */
const sendNotFound = (res, language = 'en') => {
    (0, exports.sendError)(res, 'not_found', 404, null, language);
};
exports.sendNotFound = sendNotFound;
/**
 * Send an unauthorized error response
 * @param res - Express response object
 * @param language - Language code for translation (default: 'en')
 */
const sendUnauthorized = (res, language = 'en') => {
    (0, exports.sendError)(res, 'unauthorized', 401, null, language);
};
exports.sendUnauthorized = sendUnauthorized;
/**
 * Send a forbidden error response
 * @param res - Express response object
 * @param language - Language code for translation (default: 'en')
 */
const sendForbidden = (res, language = 'en') => {
    (0, exports.sendError)(res, 'forbidden', 403, null, language);
};
exports.sendForbidden = sendForbidden;
/**
 * Get the language from request headers or query parameters
 * @param req - Express request object
 * @returns Language code (default: 'en')
 */
const getLanguageFromRequest = (req) => {
    // Check Accept-Language header first
    const acceptLanguage = req.headers['accept-language'];
    if (acceptLanguage) {
        const lang = acceptLanguage.split(',')[0].trim().toLowerCase();
        if (lang.startsWith('en'))
            return 'en';
        if (lang.startsWith('es'))
            return 'es';
        if (lang.startsWith('fr'))
            return 'fr';
        if (lang.startsWith('de'))
            return 'de';
        if (lang.startsWith('ar'))
            return 'ar';
    }
    // Check query parameter
    const queryLang = req.query.lang || req.query.language;
    if (queryLang && typeof queryLang === 'string') {
        return queryLang.toLowerCase();
    }
    // Default to environment language
    return config_1.env.DEFAULT_LANGUAGE;
};
exports.getLanguageFromRequest = getLanguageFromRequest;
//# sourceMappingURL=apiResponse.js.map