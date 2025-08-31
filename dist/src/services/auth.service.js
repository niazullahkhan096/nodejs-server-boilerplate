"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const User_1 = __importDefault(require("../models/User"));
const Role_1 = __importDefault(require("../models/Role"));
const token_service_1 = require("./token.service");
const error_1 = require("../middleware/error");
const httpStatus_1 = require("../utils/httpStatus");
class AuthService {
    static async register(data) {
        // Check if user already exists
        const existingUser = await User_1.default.findOne({ email: data.email });
        if (existingUser) {
            throw new error_1.ApiError(httpStatus_1.httpStatus.CONFLICT, 'Email already registered');
        }
        // Get default user role
        const userRole = await Role_1.default.findOne({ name: 'user' });
        if (!userRole) {
            throw new error_1.ApiError(httpStatus_1.httpStatus.INTERNAL_SERVER_ERROR, 'Default user role not found');
        }
        // Create user
        const user = await User_1.default.create({
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
        const permissions = user.roles.flatMap((role) => role.permissions.map((perm) => perm.name));
        // Generate tokens
        const tokenPayload = {
            userId: user._id.toString(),
            email: user.email,
            roles: user.roles.map((role) => role.name),
            permissions,
        };
        const accessToken = token_service_1.TokenService.generateAccessToken(tokenPayload);
        const refreshToken = token_service_1.TokenService.generateRefreshToken(tokenPayload);
        // Save refresh token
        await token_service_1.TokenService.saveRefreshToken(user._id.toString(), refreshToken);
        return {
            user: user.toJSON(),
            accessToken,
            refreshToken,
        };
    }
    static async login(data) {
        // Find user and populate roles and permissions
        const user = await User_1.default.findOne({ email: data.email }).populate({
            path: 'roles',
            populate: {
                path: 'permissions',
                select: 'name',
            },
        });
        if (!user || !user.isActive) {
            throw new error_1.ApiError(httpStatus_1.httpStatus.UNAUTHORIZED, 'Invalid email or password');
        }
        // Verify password
        const isPasswordValid = await user.comparePassword(data.password);
        if (!isPasswordValid) {
            throw new error_1.ApiError(httpStatus_1.httpStatus.UNAUTHORIZED, 'Invalid email or password');
        }
        const permissions = user.roles.flatMap((role) => role.permissions.map((perm) => perm.name));
        // Generate tokens
        const tokenPayload = {
            userId: user._id.toString(),
            email: user.email,
            roles: user.roles.map((role) => role.name),
            permissions,
        };
        const accessToken = token_service_1.TokenService.generateAccessToken(tokenPayload);
        const refreshToken = token_service_1.TokenService.generateRefreshToken(tokenPayload);
        // Save refresh token
        await token_service_1.TokenService.saveRefreshToken(user._id.toString(), refreshToken);
        return {
            user: user.toJSON(),
            accessToken,
            refreshToken,
        };
    }
    static async refreshToken(token) {
        // Verify refresh token
        const { payload, jti } = await token_service_1.TokenService.verifyRefreshToken(token);
        // Get user with roles and permissions
        const user = await User_1.default.findById(payload.userId).populate({
            path: 'roles',
            populate: {
                path: 'permissions',
                select: 'name',
            },
        });
        if (!user || !user.isActive) {
            throw new error_1.ApiError(httpStatus_1.httpStatus.UNAUTHORIZED, 'User not found or inactive');
        }
        // Revoke old refresh token
        await token_service_1.TokenService.revokeRefreshToken(jti);
        const permissions = user.roles.flatMap((role) => role.permissions.map((perm) => perm.name));
        // Generate new tokens
        const tokenPayload = {
            userId: user._id.toString(),
            email: user.email,
            roles: user.roles.map((role) => role.name),
            permissions,
        };
        const accessToken = token_service_1.TokenService.generateAccessToken(tokenPayload);
        const refreshToken = token_service_1.TokenService.generateRefreshToken(tokenPayload);
        // Save new refresh token
        await token_service_1.TokenService.saveRefreshToken(user._id.toString(), refreshToken);
        return {
            user: user.toJSON(),
            accessToken,
            refreshToken,
        };
    }
    static async logout(refreshToken) {
        try {
            const { jti } = await token_service_1.TokenService.verifyRefreshToken(refreshToken);
            await token_service_1.TokenService.revokeRefreshToken(jti);
        }
        catch (error) {
            // Don't throw error for logout, just log it
            console.warn('Logout with invalid refresh token:', error);
        }
    }
    static async getCurrentUser(userId) {
        const user = await User_1.default.findById(userId).populate({
            path: 'roles',
            populate: {
                path: 'permissions',
                select: 'name',
            },
        });
        if (!user || !user.isActive) {
            throw new error_1.ApiError(httpStatus_1.httpStatus.NOT_FOUND, 'User not found');
        }
        return user.toJSON();
    }
}
exports.AuthService = AuthService;
//# sourceMappingURL=auth.service.js.map