import { Request, Response, NextFunction } from 'express';
import { UserService } from '../services/user.service';
import { sendSuccess, sendError, getLanguageFromRequest } from '../utils/apiResponse';
import { httpStatus } from '../utils/httpStatus';

export class UserController {
  static async createUser(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { email, password, name, roles } = req.body;

      const user = await UserService.createUser({ email, password, name, roles });
      sendSuccess(res, user, 'User created successfully', httpStatus.CREATED);
    } catch (error) {
      next(error);
    }
  }

  static async getUsers(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const search = req.query.search as string;

      const result = await UserService.getUsers(page, limit, search);
      sendSuccess(res, result, 'Users retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  static async getUserById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const user = await UserService.getUserById(id);
      sendSuccess(res, user, 'User retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  static async updateUser(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const updateData = req.body;

      const user = await UserService.updateUser(id, updateData);
      sendSuccess(res, user, 'User updated successfully');
    } catch (error) {
      next(error);
    }
  }

  static async deleteUser(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      await UserService.deleteUser(id);
      sendSuccess(res, null, 'User deleted successfully', httpStatus.NO_CONTENT);
    } catch (error) {
      next(error);
    }
  }

  static async getUserPermissions(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const permissions = await UserService.getUserPermissions(id);
      sendSuccess(res, { permissions }, 'User permissions retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  // Profile Image Methods
  static async uploadProfileImage(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.file) {
        const language = getLanguageFromRequest(req);
        sendError(res, 'profile.image.upload.no_file', 400, null, language);
        return;
      }

      if (!req.user) {
        const language = getLanguageFromRequest(req);
        sendError(res, 'unauthorized', 401, null, language);
        return;
      }

      const result = await UserService.uploadProfileImage(req.file, req.user.id);
      const language = getLanguageFromRequest(req);
      sendSuccess(res, result, 'profile.image.upload.success', 201, language);
    } catch (error) {
      next(error);
    }
  }

  static async deleteProfileImage(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        const language = getLanguageFromRequest(req);
        sendError(res, 'unauthorized', 401, null, language);
        return;
      }

      const result = await UserService.deleteProfileImage(req.user.id);
      const language = getLanguageFromRequest(req);
      sendSuccess(res, result, 'profile.image.delete.success', 200, language);
    } catch (error) {
      next(error);
    }
  }

  static async getProfileImage(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        const language = getLanguageFromRequest(req);
        sendError(res, 'unauthorized', 401, null, language);
        return;
      }

      const result = await UserService.getProfileImage(req.user.id);
      const language = getLanguageFromRequest(req);
      sendSuccess(res, result, 'profile.image.get.success', 200, language);
    } catch (error) {
      next(error);
    }
  }

  static async getProfileImageByUserId(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { userId } = req.params;

      if (!userId) {
        const language = getLanguageFromRequest(req);
        sendError(res, 'profile.image.get.invalid_user_id', 400, null, language);
        return;
      }

      const result = await UserService.getProfileImage(userId);
      const language = getLanguageFromRequest(req);
      sendSuccess(res, result, 'profile.image.get.success', 200, language);
    } catch (error) {
      next(error);
    }
  }
}
