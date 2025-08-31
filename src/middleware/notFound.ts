import { Request, Response, NextFunction } from 'express';
import { ApiError } from './error';

export const notFound = (req: Request, res: Response, next: NextFunction): void => {
  next(new ApiError(404, 'not_found'));
};
