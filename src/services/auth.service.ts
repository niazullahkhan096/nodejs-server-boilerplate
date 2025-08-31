import User from '../models/User';
import Role from '../models/Role';
import { TokenService } from './token.service';
import { ApiError } from '../middleware/error';
import { httpStatus } from '../utils/httpStatus';

interface RegisterData {
  email: string;
  password: string;
  name: string;
}

interface LoginData {
  email: string;
  password: string;
}

interface AuthResponse {
  user: any;
  accessToken: string;
  refreshToken: string;
}

export class AuthService {
  static async register(data: RegisterData): Promise<AuthResponse> {
    // Check if user already exists
    const existingUser = await User.findOne({ email: data.email });
    if (existingUser) {
      throw new ApiError(httpStatus.CONFLICT, 'Email already registered');
    }

    // Get default user role
    const userRole = await Role.findOne({ name: 'user' });
    if (!userRole) {
      throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Default user role not found');
    }

    // Create user
    const user = await User.create({
      ...data,
      roles: [userRole._id],
    });

    // Populate roles and permissions
    await user.populate({
      path: 'roles',
      populate: {
        path: 'permissions',
        select: 'name',
      },
    });

    const permissions = user.roles.flatMap((role: any) => 
      role.permissions.map((perm: any) => perm.name)
    );

    // Generate tokens
    const tokenPayload = {
      userId: (user as any)._id.toString(),
      email: user.email,
      roles: user.roles.map((role: any) => role.name),
      permissions,
    };

    const accessToken = TokenService.generateAccessToken(tokenPayload);
    const refreshToken = TokenService.generateRefreshToken(tokenPayload);

    // Save refresh token
    await TokenService.saveRefreshToken((user as any)._id.toString(), refreshToken);

    return {
      user: user.toJSON(),
      accessToken,
      refreshToken,
    };
  }

  static async login(data: LoginData): Promise<AuthResponse> {
    // Find user and populate roles and permissions
    const user = await User.findOne({ email: data.email }).populate({
      path: 'roles',
      populate: {
        path: 'permissions',
        select: 'name',
      },
    });

    if (!user || !user.isActive) {
      throw new ApiError(httpStatus.UNAUTHORIZED, 'Invalid email or password');
    }

    // Verify password
    const isPasswordValid = await user.comparePassword(data.password);
    if (!isPasswordValid) {
      throw new ApiError(httpStatus.UNAUTHORIZED, 'Invalid email or password');
    }

    const permissions = user.roles.flatMap((role: any) => 
      role.permissions.map((perm: any) => perm.name)
    );

    // Generate tokens
    const tokenPayload = {
      userId: (user as any)._id.toString(),
      email: user.email,
      roles: user.roles.map((role: any) => role.name),
      permissions,
    };

    const accessToken = TokenService.generateAccessToken(tokenPayload);
    const refreshToken = TokenService.generateRefreshToken(tokenPayload);

    // Save refresh token
    await TokenService.saveRefreshToken((user as any)._id.toString(), refreshToken);

    return {
      user: user.toJSON(),
      accessToken,
      refreshToken,
    };
  }

  static async refreshToken(token: string): Promise<AuthResponse> {
    // Verify refresh token
    const { payload, jti } = await TokenService.verifyRefreshToken(token);

    // Get user with roles and permissions
    const user = await User.findById(payload.userId).populate({
      path: 'roles',
      populate: {
        path: 'permissions',
        select: 'name',
      },
    });

    if (!user || !user.isActive) {
      throw new ApiError(httpStatus.UNAUTHORIZED, 'User not found or inactive');
    }

    // Revoke old refresh token
    await TokenService.revokeRefreshToken(jti);

    const permissions = user.roles.flatMap((role: any) => 
      role.permissions.map((perm: any) => perm.name)
    );

    // Generate new tokens
    const tokenPayload = {
      userId: (user as any)._id.toString(),
      email: user.email,
      roles: user.roles.map((role: any) => role.name),
      permissions,
    };

    const accessToken = TokenService.generateAccessToken(tokenPayload);
    const refreshToken = TokenService.generateRefreshToken(tokenPayload);

    // Save new refresh token
    await TokenService.saveRefreshToken((user as any)._id.toString(), refreshToken);

    return {
      user: user.toJSON(),
      accessToken,
      refreshToken,
    };
  }

  static async logout(refreshToken: string): Promise<void> {
    try {
      const { jti } = await TokenService.verifyRefreshToken(refreshToken);
      await TokenService.revokeRefreshToken(jti);
    } catch (error) {
      // Don't throw error for logout, just log it
      console.warn('Logout with invalid refresh token:', error);
    }
  }

  static async getCurrentUser(userId: string): Promise<any> {
    const user = await User.findById(userId).populate({
      path: 'roles',
      populate: {
        path: 'permissions',
        select: 'name',
      },
    });

    if (!user || !user.isActive) {
      throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
    }

    return user.toJSON();
  }
}
