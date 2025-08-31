import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import mongoose from 'mongoose';
import { sendError, getLanguageFromRequest } from '../utils/apiResponse';
import logger from '../utils/logger';

export class ApiError extends Error {
  statusCode: number;
  details?: Record<string, string[]>;

  constructor(statusCode: number, message: string, details?: Record<string, string[]>) {
    super(message);
    this.statusCode = statusCode;
    this.details = details;
    this.name = 'ApiError';
  }
}

export const errorConverter = (err: Error, req: Request, res: Response, next: NextFunction): void => {
  let error = err;

  if (!(error instanceof ApiError)) {
    const statusCode = error instanceof ZodError ? 400 :
                      error instanceof mongoose.Error.ValidationError ? 400 :
                      error instanceof mongoose.Error.CastError ? 400 :
                      error.name === 'MongoError' && (error as any).code === 11000 ? 409 :
                      500;

    const messageKey = error instanceof ZodError ? 'validation.error' :
                      error instanceof mongoose.Error.ValidationError ? 'validation.error' :
                      error instanceof mongoose.Error.CastError ? 'validation.error' :
                      error.name === 'MongoError' && (error as any).code === 11000 ? 'validation.error' :
                      'server.error';

    const details = error instanceof ZodError ? 
      error.errors.reduce((acc, curr) => {
        const field = curr.path.join('.');
        if (!acc[field]) acc[field] = [];
        acc[field].push(curr.message);
        return acc;
      }, {} as Record<string, string[]>) : undefined;

    error = new ApiError(statusCode, messageKey, details);
  }

  next(error);
};

export const errorHandler = (err: ApiError, req: Request, res: Response, next: NextFunction): void => {
  const { statusCode, message, details } = err;
  const language = getLanguageFromRequest(req);

  // Log error
  logger.error({
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
  sendError(res, message, statusCode, details, language);
};
