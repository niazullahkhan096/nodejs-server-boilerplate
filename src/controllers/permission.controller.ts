import { Request, Response, NextFunction } from 'express';
import { PermissionService } from '../services/permission.service';
import { sendSuccess } from '../utils/apiResponse';
import { httpStatus } from '../utils/httpStatus';

export class PermissionController {
  static async createPermission(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { name, description } = req.body;

      const permission = await PermissionService.createPermission({ name, description });
      sendSuccess(res, permission, 'Permission created successfully', httpStatus.CREATED);
    } catch (error) {
      next(error);
    }
  }

  static async getPermissions(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const permissions = await PermissionService.getPermissions();
      sendSuccess(res, permissions, 'Permissions retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  static async getPermissionById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const permission = await PermissionService.getPermissionById(id);
      sendSuccess(res, permission, 'Permission retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  static async updatePermission(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const updateData = req.body;

      const permission = await PermissionService.updatePermission(id, updateData);
      sendSuccess(res, permission, 'Permission updated successfully');
    } catch (error) {
      next(error);
    }
  }

  static async deletePermission(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      await PermissionService.deletePermission(id);
      sendSuccess(res, null, 'Permission deleted successfully', httpStatus.NO_CONTENT);
    } catch (error) {
      next(error);
    }
  }
}
