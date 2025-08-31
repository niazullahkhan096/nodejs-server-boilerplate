import Permission from '../models/Permission';
import { ApiError } from '../middleware/error';
import { httpStatus } from '../utils/httpStatus';

interface CreatePermissionData {
  name: string;
  description: string;
}

interface UpdatePermissionData {
  name?: string;
  description?: string;
}

export class PermissionService {
  static async createPermission(data: CreatePermissionData): Promise<any> {
    // Check if permission already exists
    const existingPermission = await Permission.findOne({ name: data.name });
    if (existingPermission) {
      throw new ApiError(httpStatus.CONFLICT, 'Permission with this name already exists');
    }

    const permission = await Permission.create(data);
    return permission.toJSON();
  }

  static async getPermissions(): Promise<any[]> {
    const permissions = await Permission.find().sort({ name: 1 });
    return permissions.map(permission => permission.toJSON());
  }

  static async getPermissionById(permissionId: string): Promise<any> {
    const permission = await Permission.findById(permissionId);
    
    if (!permission) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Permission not found');
    }

    return permission.toJSON();
  }

  static async updatePermission(permissionId: string, data: UpdatePermissionData): Promise<any> {
    const permission = await Permission.findById(permissionId);
    if (!permission) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Permission not found');
    }

    // Check if name is being changed and if it's already taken
    if (data.name && data.name !== permission.name) {
      const existingPermission = await Permission.findOne({ name: data.name });
      if (existingPermission) {
        throw new ApiError(httpStatus.CONFLICT, 'Permission with this name already exists');
      }
    }

    const updatedPermission = await Permission.findByIdAndUpdate(
      permissionId,
      data,
      { new: true, runValidators: true }
    );

    return updatedPermission!.toJSON();
  }

  static async deletePermission(permissionId: string): Promise<void> {
    const permission = await Permission.findById(permissionId);
    if (!permission) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Permission not found');
    }

    // Check if permission is assigned to any roles
    const { default: Role } = await import('../models/Role');
    const rolesWithPermission = await Role.find({ permissions: permissionId });
    
    if (rolesWithPermission.length > 0) {
      throw new ApiError(httpStatus.CONFLICT, 'Cannot delete permission that is assigned to roles');
    }

    await Permission.findByIdAndDelete(permissionId);
  }

  static async getPermissionsByNames(names: string[]): Promise<any[]> {
    const permissions = await Permission.find({ name: { $in: names } });
    return permissions.map(permission => permission.toJSON());
  }
}
