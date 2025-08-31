import User from '../models/User';
import Role from '../models/Role';
import { ApiError } from '../middleware/error';
import { httpStatus } from '../utils/httpStatus';

interface CreateUserData {
  email: string;
  password: string;
  name: string;
  roles?: string[];
}

interface UpdateUserData {
  email?: string;
  name?: string;
  roles?: string[];
  isActive?: boolean;
}

export class UserService {
  static async createUser(data: CreateUserData): Promise<any> {
    // Check if user already exists
    const existingUser = await User.findOne({ email: data.email });
    if (existingUser) {
      throw new ApiError(httpStatus.CONFLICT, 'Email already registered');
    }

    // Validate roles if provided
    let roleIds: string[] = [];
    if (data.roles && data.roles.length > 0) {
      const roles = await Role.find({ name: { $in: data.roles } });
      if (roles.length !== data.roles.length) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'One or more roles not found');
      }
      roleIds = roles.map(role => (role as any)._id.toString());
    } else {
      // Assign default user role
      const userRole = await Role.findOne({ name: 'user' });
      if (!userRole) {
        throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Default user role not found');
      }
      roleIds = [(userRole as any)._id.toString()];
    }

    const user = await User.create({
      ...data,
      roles: roleIds,
    });

    await user.populate({
      path: 'roles',
      populate: {
        path: 'permissions',
        select: 'name',
      },
    });

    return user.toJSON();
  }

  static async getUsers(page = 1, limit = 10, search?: string): Promise<{ users: any[]; total: number; page: number; totalPages: number }> {
    const skip = (page - 1) * limit;
    
    const query: any = {};
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }

    const [users, total] = await Promise.all([
      User.find(query)
        .populate({
          path: 'roles',
          populate: {
            path: 'permissions',
            select: 'name',
          },
        })
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 }),
      User.countDocuments(query),
    ]);

    return {
      users: users.map(user => user.toJSON()),
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }

  static async getUserById(userId: string): Promise<any> {
    const user = await User.findById(userId).populate({
      path: 'roles',
      populate: {
        path: 'permissions',
        select: 'name',
      },
    });

    if (!user) {
      throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
    }

    return user.toJSON();
  }

  static async updateUser(userId: string, data: UpdateUserData): Promise<any> {
    const user = await User.findById(userId);
    if (!user) {
      throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
    }

    // Check if email is being changed and if it's already taken
    if (data.email && data.email !== user.email) {
      const existingUser = await User.findOne({ email: data.email });
      if (existingUser) {
        throw new ApiError(httpStatus.CONFLICT, 'Email already registered');
      }
    }

    // Validate roles if provided
    if (data.roles) {
      const roles = await Role.find({ name: { $in: data.roles } });
      if (roles.length !== data.roles.length) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'One or more roles not found');
      }
      data.roles = roles.map(role => (role as any)._id.toString());
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      data,
      { new: true, runValidators: true }
    ).populate({
      path: 'roles',
      populate: {
        path: 'permissions',
        select: 'name',
      },
    });

    return updatedUser!.toJSON();
  }

  static async deleteUser(userId: string): Promise<void> {
    const user = await User.findById(userId);
    if (!user) {
      throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
    }

    await User.findByIdAndDelete(userId);
  }

  static async getUserPermissions(userId: string): Promise<string[]> {
    const user = await User.findById(userId).populate({
      path: 'roles',
      populate: {
        path: 'permissions',
        select: 'name',
      },
    });

    if (!user) {
      throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
    }

    return user.roles.flatMap((role: any) => 
      role.permissions.map((perm: any) => perm.name)
    );
  }
}
