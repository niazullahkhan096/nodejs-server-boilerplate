import { Response } from 'express';
import { TranslationService } from '../services/translation.service';
import { env } from '../config';

export interface ApiResponse {
  code: number;
  message: string;
  data: any;
}

/**
 * Send a success response with the generic format
 * @param res - Express response object
 * @param data - Response data
 * @param messageKey - Translation key for the message
 * @param statusCode - HTTP status code (default: 200)
 * @param language - Language code for translation (default: 'en')
 */
export const sendSuccess = (
  res: Response,
  data: any,
  messageKey: string = 'success',
  statusCode: number = 200,
  language: string = 'en'
): void => {
  const response: ApiResponse = {
    code: statusCode,
    message: TranslationService.getMessage(messageKey, language),
    data
  };

  res.status(statusCode).json(response);
};

/**
 * Send an error response with the generic format
 * @param res - Express response object
 * @param messageKey - Translation key for the message
 * @param statusCode - HTTP status code (default: 500)
 * @param data - Additional error data (optional)
 * @param language - Language code for translation (default: 'en')
 */
export const sendError = (
  res: Response,
  messageKey: string = 'server.error',
  statusCode: number = 500,
  data: any = null,
  language: string = 'en'
): void => {
  const response: ApiResponse = {
    code: statusCode,
    message: TranslationService.getMessage(messageKey, language),
    data
  };

  res.status(statusCode).json(response);
};

/**
 * Send a validation error response
 * @param res - Express response object
 * @param errors - Validation errors
 * @param language - Language code for translation (default: 'en')
 */
export const sendValidationError = (
  res: Response,
  errors: any,
  language: string = 'en'
): void => {
  sendError(res, 'validation.error', 400, errors, language);
};

/**
 * Send a not found error response
 * @param res - Express response object
 * @param language - Language code for translation (default: 'en')
 */
export const sendNotFound = (
  res: Response,
  language: string = 'en'
): void => {
  sendError(res, 'not_found', 404, null, language);
};

/**
 * Send an unauthorized error response
 * @param res - Express response object
 * @param language - Language code for translation (default: 'en')
 */
export const sendUnauthorized = (
  res: Response,
  language: string = 'en'
): void => {
  sendError(res, 'unauthorized', 401, null, language);
};

/**
 * Send a forbidden error response
 * @param res - Express response object
 * @param language - Language code for translation (default: 'en')
 */
export const sendForbidden = (
  res: Response,
  language: string = 'en'
): void => {
  sendError(res, 'forbidden', 403, null, language);
};

/**
 * Get the language from request headers or query parameters
 * @param req - Express request object
 * @returns Language code (default: 'en')
 */
export const getLanguageFromRequest = (req: any): string => {
  // Check Accept-Language header first
  const acceptLanguage = req.headers['accept-language'];
  if (acceptLanguage) {
    const lang = acceptLanguage.split(',')[0].trim().toLowerCase();
    if (lang.startsWith('en')) return 'en';
    if (lang.startsWith('es')) return 'es';
    if (lang.startsWith('fr')) return 'fr';
    if (lang.startsWith('de')) return 'de';
    if (lang.startsWith('ar')) return 'ar';
  }

  // Check query parameter
  const queryLang = req.query.lang || req.query.language;
  if (queryLang && typeof queryLang === 'string') {
    return queryLang.toLowerCase();
  }

  // Default to environment language
  return env.DEFAULT_LANGUAGE;
};
