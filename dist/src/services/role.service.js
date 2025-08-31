"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoleService = void 0;
const Role_1 = __importDefault(require("../models/Role"));
const Permission_1 = __importDefault(require("../models/Permission"));
const error_1 = require("../middleware/error");
const httpStatus_1 = require("../utils/httpStatus");
class RoleService {
    static async createRole(data) {
        // Check if role already exists
        const existingRole = await Role_1.default.findOne({ name: data.name });
        if (existingRole) {
            throw new error_1.ApiError(httpStatus_1.httpStatus.CONFLICT, 'Role with this name already exists');
        }
        // Validate permissions
        const permissions = await Permission_1.default.find({ name: { $in: data.permissions } });
        if (permissions.length !== data.permissions.length) {
            throw new error_1.ApiError(httpStatus_1.httpStatus.BAD_REQUEST, 'One or more permissions not found');
        }
        const role = await Role_1.default.create({
            ...data,
            permissions: permissions.map(perm => perm._id),
        });
        await role.populate({
            path: 'permissions',
            select: 'name description',
        });
        return role.toJSON();
    }
    static async getRoles() {
        const roles = await Role_1.default.find().populate({
            path: 'permissions',
            select: 'name description',
        });
        return roles.map(role => role.toJSON());
    }
    static async getRoleById(roleId) {
        const role = await Role_1.default.findById(roleId).populate({
            path: 'permissions',
            select: 'name description',
        });
        if (!role) {
            throw new error_1.ApiError(httpStatus_1.httpStatus.NOT_FOUND, 'Role not found');
        }
        return role.toJSON();
    }
    static async updateRole(roleId, data) {
        const role = await Role_1.default.findById(roleId);
        if (!role) {
            throw new error_1.ApiError(httpStatus_1.httpStatus.NOT_FOUND, 'Role not found');
        }
        // Check if name is being changed and if it's already taken
        if (data.name && data.name !== role.name) {
            const existingRole = await Role_1.default.findOne({ name: data.name });
            if (existingRole) {
                throw new error_1.ApiError(httpStatus_1.httpStatus.CONFLICT, 'Role with this name already exists');
            }
        }
        // Validate permissions if provided
        if (data.permissions) {
            const permissions = await Permission_1.default.find({ name: { $in: data.permissions } });
            if (permissions.length !== data.permissions.length) {
                throw new error_1.ApiError(httpStatus_1.httpStatus.BAD_REQUEST, 'One or more permissions not found');
            }
            data.permissions = permissions.map(perm => perm._id.toString());
        }
        const updatedRole = await Role_1.default.findByIdAndUpdate(roleId, data, { new: true, runValidators: true }).populate({
            path: 'permissions',
            select: 'name description',
        });
        return updatedRole.toJSON();
    }
    static async deleteRole(roleId) {
        const role = await Role_1.default.findById(roleId);
        if (!role) {
            throw new error_1.ApiError(httpStatus_1.httpStatus.NOT_FOUND, 'Role not found');
        }
        // Check if role is assigned to any users
        const { default: User } = await Promise.resolve().then(() => __importStar(require('../models/User')));
        const usersWithRole = await User.find({ roles: roleId });
        if (usersWithRole.length > 0) {
            throw new error_1.ApiError(httpStatus_1.httpStatus.CONFLICT, 'Cannot delete role that is assigned to users');
        }
        await Role_1.default.findByIdAndDelete(roleId);
    }
    static async getRolePermissions(roleId) {
        const role = await Role_1.default.findById(roleId).populate({
            path: 'permissions',
            select: 'name',
        });
        if (!role) {
            throw new error_1.ApiError(httpStatus_1.httpStatus.NOT_FOUND, 'Role not found');
        }
        return role.permissions.map((perm) => perm.name);
    }
}
exports.RoleService = RoleService;
//# sourceMappingURL=role.service.js.map