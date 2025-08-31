import { Response } from 'express';
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
export declare const sendSuccess: (res: Response, data: any, messageKey?: string, statusCode?: number, language?: string) => void;
/**
 * Send an error response with the generic format
 * @param res - Express response object
 * @param messageKey - Translation key for the message
 * @param statusCode - HTTP status code (default: 500)
 * @param data - Additional error data (optional)
 * @param language - Language code for translation (default: 'en')
 */
export declare const sendError: (res: Response, messageKey?: string, statusCode?: number, data?: any, language?: string) => void;
/**
 * Send a validation error response
 * @param res - Express response object
 * @param errors - Validation errors
 * @param language - Language code for translation (default: 'en')
 */
export declare const sendValidationError: (res: Response, errors: any, language?: string) => void;
/**
 * Send a not found error response
 * @param res - Express response object
 * @param language - Language code for translation (default: 'en')
 */
export declare const sendNotFound: (res: Response, language?: string) => void;
/**
 * Send an unauthorized error response
 * @param res - Express response object
 * @param language - Language code for translation (default: 'en')
 */
export declare const sendUnauthorized: (res: Response, language?: string) => void;
/**
 * Send a forbidden error response
 * @param res - Express response object
 * @param language - Language code for translation (default: 'en')
 */
export declare const sendForbidden: (res: Response, language?: string) => void;
/**
 * Get the language from request headers or query parameters
 * @param req - Express request object
 * @returns Language code (default: 'en')
 */
export declare const getLanguageFromRequest: (req: any) => string;
//# sourceMappingURL=apiResponse.d.ts.map