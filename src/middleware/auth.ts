import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../config';
import { ApiError } from './error';
import { httpStatus } from '../utils/httpStatus';
import User from '../models/User';
import Role from '../models/Role';

interface JwtPayload {
  userId: string;
  email: string;
  roles: string[];
  permissions: string[];
  iat: number;
  exp: number;
}

export const authenticate = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new ApiError(httpStatus.UNAUTHORIZED, 'Access token required');
    }

    const token = authHeader.substring(7);
    
    const decoded = jwt.verify(token, env.JWT_ACCESS_SECRET) as JwtPayload;
    
    // Check if user still exists and is active
    const user = await User.findById(decoded.userId).select('+isActive');
    
    if (!user || !user.isActive) {
      throw new ApiError(httpStatus.UNAUTHORIZED, 'User not found or inactive');
    }

    // Attach user info to request
    req.user = {
      id: decoded.userId,
      email: decoded.email,
      roles: decoded.roles,
      permissions: decoded.permissions,
    };

    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      next(new ApiError(httpStatus.UNAUTHORIZED, 'Invalid access token'));
    } else if (error instanceof jwt.TokenExpiredError) {
      next(new ApiError(httpStatus.UNAUTHORIZED, 'Access token expired'));
    } else {
      next(error);
    }
  }
};
