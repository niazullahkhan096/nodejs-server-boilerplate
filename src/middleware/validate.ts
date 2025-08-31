import { Request, Response, NextFunction } from 'express';
import { AnyZodObject, ZodError } from 'zod';
import { ApiError } from './error';
import { httpStatus } from '../utils/httpStatus';

export const validate = (schema: AnyZodObject) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const details = error.errors.reduce((acc, curr) => {
          const field = curr.path.join('.');
          if (!acc[field]) acc[field] = [];
          acc[field].push(curr.message);
          return acc;
        }, {} as Record<string, string[]>);

        next(new ApiError(httpStatus.BAD_REQUEST, 'Validation Error', details));
      } else {
        next(error);
      }
    }
  };
};
