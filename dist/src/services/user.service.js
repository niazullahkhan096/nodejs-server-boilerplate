"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const User_1 = __importDefault(require("../models/User"));
const Role_1 = __importDefault(require("../models/Role"));
const error_1 = require("../middleware/error");
const httpStatus_1 = require("../utils/httpStatus");
class UserService {
    static async createUser(data) {
        // Check if user already exists
        const existingUser = await User_1.default.findOne({ email: data.email });
        if (existingUser) {
            throw new error_1.ApiError(httpStatus_1.httpStatus.CONFLICT, 'Email already registered');
        }
        // Validate roles if provided
        let roleIds = [];
        if (data.roles && data.roles.length > 0) {
            const roles = await Role_1.default.find({ name: { $in: data.roles } });
            if (roles.length !== data.roles.length) {
                throw new error_1.ApiError(httpStatus_1.httpStatus.BAD_REQUEST, 'One or more roles not found');
            }
            roleIds = roles.map(role => role._id.toString());
        }
        else {
            // Assign default user role
            const userRole = await Role_1.default.findOne({ name: 'user' });
            if (!userRole) {
                throw new error_1.ApiError(httpStatus_1.httpStatus.INTERNAL_SERVER_ERROR, 'Default user role not found');
            }
            roleIds = [userRole._id.toString()];
        }
        const user = await User_1.default.create({
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
    static async getUsers(page = 1, limit = 10, search) {
        const skip = (page - 1) * limit;
        const query = {};
        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } },
            ];
        }
        const [users, total] = await Promise.all([
            User_1.default.find(query)
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
            User_1.default.countDocuments(query),
        ]);
        return {
            users: users.map(user => user.toJSON()),
            total,
            page,
            totalPages: Math.ceil(total / limit),
        };
    }
    static async getUserById(userId) {
        const user = await User_1.default.findById(userId).populate({
            path: 'roles',
            populate: {
                path: 'permissions',
                select: 'name',
            },
        });
        if (!user) {
            throw new error_1.ApiError(httpStatus_1.httpStatus.NOT_FOUND, 'User not found');
        }
        return user.toJSON();
    }
    static async updateUser(userId, data) {
        const user = await User_1.default.findById(userId);
        if (!user) {
            throw new error_1.ApiError(httpStatus_1.httpStatus.NOT_FOUND, 'User not found');
        }
        // Check if email is being changed and if it's already taken
        if (data.email && data.email !== user.email) {
            const existingUser = await User_1.default.findOne({ email: data.email });
            if (existingUser) {
                throw new error_1.ApiError(httpStatus_1.httpStatus.CONFLICT, 'Email already registered');
            }
        }
        // Validate roles if provided
        if (data.roles) {
            const roles = await Role_1.default.find({ name: { $in: data.roles } });
            if (roles.length !== data.roles.length) {
                throw new error_1.ApiError(httpStatus_1.httpStatus.BAD_REQUEST, 'One or more roles not found');
            }
            data.roles = roles.map(role => role._id.toString());
        }
        const updatedUser = await User_1.default.findByIdAndUpdate(userId, data, { new: true, runValidators: true }).populate({
            path: 'roles',
            populate: {
                path: 'permissions',
                select: 'name',
            },
        });
        return updatedUser.toJSON();
    }
    static async deleteUser(userId) {
        const user = await User_1.default.findById(userId);
        if (!user) {
            throw new error_1.ApiError(httpStatus_1.httpStatus.NOT_FOUND, 'User not found');
        }
        await User_1.default.findByIdAndDelete(userId);
    }
    static async getUserPermissions(userId) {
        const user = await User_1.default.findById(userId).populate({
            path: 'roles',
            populate: {
                path: 'permissions',
                select: 'name',
            },
        });
        if (!user) {
            throw new error_1.ApiError(httpStatus_1.httpStatus.NOT_FOUND, 'User not found');
        }
        return user.roles.flatMap((role) => role.permissions.map((perm) => perm.name));
    }
}
exports.UserService = UserService;
//# sourceMappingURL=user.service.js.map