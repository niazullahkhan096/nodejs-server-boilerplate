import { Request, Response, NextFunction } from 'express';
import { ApiError } from './error';
import { httpStatus } from '../utils/httpStatus';

export const authorize = (requiredPermissions: string[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      throw new ApiError(httpStatus.UNAUTHORIZED, 'Authentication required');
    }

    const userPermissions = req.user.permissions || [];
    
    // Check if user has all required permissions
    const hasAllPermissions = requiredPermissions.every(permission => 
      userPermissions.includes(permission)
    );

    if (!hasAllPermissions) {
      throw new ApiError(
        httpStatus.FORBIDDEN, 
        `Insufficient permissions. Required: ${requiredPermissions.join(', ')}`
      );
    }

    next();
  };
};
