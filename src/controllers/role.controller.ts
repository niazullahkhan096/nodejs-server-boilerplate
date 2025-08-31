import { Request, Response, NextFunction } from 'express';
import { RoleService } from '../services/role.service';
import { sendSuccess } from '../utils/apiResponse';
import { httpStatus } from '../utils/httpStatus';

export class RoleController {
  static async createRole(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { name, description, permissions } = req.body;

      const role = await RoleService.createRole({ name, description, permissions });
      sendSuccess(res, role, 'Role created successfully', httpStatus.CREATED);
    } catch (error) {
      next(error);
    }
  }

  static async getRoles(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const roles = await RoleService.getRoles();
      sendSuccess(res, roles, 'Roles retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  static async getRoleById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const role = await RoleService.getRoleById(id);
      sendSuccess(res, role, 'Role retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  static async updateRole(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const updateData = req.body;

      const role = await RoleService.updateRole(id, updateData);
      sendSuccess(res, role, 'Role updated successfully');
    } catch (error) {
      next(error);
    }
  }

  static async deleteRole(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      await RoleService.deleteRole(id);
      sendSuccess(res, null, 'Role deleted successfully', httpStatus.NO_CONTENT);
    } catch (error) {
      next(error);
    }
  }

  static async getRolePermissions(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const permissions = await RoleService.getRolePermissions(id);
      sendSuccess(res, { permissions }, 'Role permissions retrieved successfully');
    } catch (error) {
      next(error);
    }
  }
}
