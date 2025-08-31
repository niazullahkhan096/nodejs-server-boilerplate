import { Request, Response, NextFunction } from 'express';
import { logRequest, logError } from '../utils/logger';
import { v4 as uuidv4 } from 'uuid';

// Extend Request interface to include id
declare global {
  namespace Express {
    interface Request {
      id: string;
      startTime: number;
    }
  }
}

export const requestLogger = (req: Request, res: Response, next: NextFunction) => {
  // Generate unique request ID
  req.id = uuidv4();
  req.startTime = Date.now();

  // Log request start
  const originalSend = res.send;
  res.send = function (body: any) {
    const responseTime = Date.now() - req.startTime;
    logRequest(req, res, responseTime);
    return originalSend.call(this, body);
  };

  next();
};

export const errorLogger = (error: Error, req: Request, res: Response, next: NextFunction) => {
  logError(error, req, {
    url: req.url,
    method: req.method,
    ip: req.ip,
    userAgent: req.get('User-Agent'),
  });
  next(error);
};
