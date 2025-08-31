import Role from '../models/Role';
import Permission from '../models/Permission';
import { ApiError } from '../middleware/error';
import { httpStatus } from '../utils/httpStatus';

interface CreateRoleData {
  name: string;
  description: string;
  permissions: string[];
}

interface UpdateRoleData {
  name?: string;
  description?: string;
  permissions?: string[];
}

export class RoleService {
  static async createRole(data: CreateRoleData): Promise<any> {
    // Check if role already exists
    const existingRole = await Role.findOne({ name: data.name });
    if (existingRole) {
      throw new ApiError(httpStatus.CONFLICT, 'Role with this name already exists');
    }

    // Validate permissions
    const permissions = await Permission.find({ name: { $in: data.permissions } });
    if (permissions.length !== data.permissions.length) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'One or more permissions not found');
    }

    const role = await Role.create({
      ...data,
      permissions: permissions.map(perm => perm._id),
    });

    await role.populate({
      path: 'permissions',
      select: 'name description',
    });

    return role.toJSON();
  }

  static async getRoles(): Promise<any[]> {
    const roles = await Role.find().populate({
      path: 'permissions',
      select: 'name description',
    });

    return roles.map(role => role.toJSON());
  }

  static async getRoleById(roleId: string): Promise<any> {
    const role = await Role.findById(roleId).populate({
      path: 'permissions',
      select: 'name description',
    });

    if (!role) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Role not found');
    }

    return role.toJSON();
  }

  static async updateRole(roleId: string, data: UpdateRoleData): Promise<any> {
    const role = await Role.findById(roleId);
    if (!role) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Role not found');
    }

    // Check if name is being changed and if it's already taken
    if (data.name && data.name !== role.name) {
      const existingRole = await Role.findOne({ name: data.name });
      if (existingRole) {
        throw new ApiError(httpStatus.CONFLICT, 'Role with this name already exists');
      }
    }

    // Validate permissions if provided
    if (data.permissions) {
      const permissions = await Permission.find({ name: { $in: data.permissions } });
      if (permissions.length !== data.permissions.length) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'One or more permissions not found');
      }
      data.permissions = permissions.map(perm => (perm as any)._id.toString());
    }

    const updatedRole = await Role.findByIdAndUpdate(
      roleId,
      data,
      { new: true, runValidators: true }
    ).populate({
      path: 'permissions',
      select: 'name description',
    });

    return updatedRole!.toJSON();
  }

  static async deleteRole(roleId: string): Promise<void> {
    const role = await Role.findById(roleId);
    if (!role) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Role not found');
    }

    // Check if role is assigned to any users
    const { default: User } = await import('../models/User');
    const usersWithRole = await User.find({ roles: roleId });
    
    if (usersWithRole.length > 0) {
      throw new ApiError(httpStatus.CONFLICT, 'Cannot delete role that is assigned to users');
    }

    await Role.findByIdAndDelete(roleId);
  }

  static async getRolePermissions(roleId: string): Promise<string[]> {
    const role = await Role.findById(roleId).populate({
      path: 'permissions',
      select: 'name',
    });

    if (!role) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Role not found');
    }

    return role.permissions.map((perm: any) => perm.name);
  }
}
