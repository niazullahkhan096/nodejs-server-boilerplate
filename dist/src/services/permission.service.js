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
exports.PermissionService = void 0;
const Permission_1 = __importDefault(require("../models/Permission"));
const error_1 = require("../middleware/error");
const httpStatus_1 = require("../utils/httpStatus");
class PermissionService {
    static async createPermission(data) {
        // Check if permission already exists
        const existingPermission = await Permission_1.default.findOne({ name: data.name });
        if (existingPermission) {
            throw new error_1.ApiError(httpStatus_1.httpStatus.CONFLICT, 'Permission with this name already exists');
        }
        const permission = await Permission_1.default.create(data);
        return permission.toJSON();
    }
    static async getPermissions() {
        const permissions = await Permission_1.default.find().sort({ name: 1 });
        return permissions.map(permission => permission.toJSON());
    }
    static async getPermissionById(permissionId) {
        const permission = await Permission_1.default.findById(permissionId);
        if (!permission) {
            throw new error_1.ApiError(httpStatus_1.httpStatus.NOT_FOUND, 'Permission not found');
        }
        return permission.toJSON();
    }
    static async updatePermission(permissionId, data) {
        const permission = await Permission_1.default.findById(permissionId);
        if (!permission) {
            throw new error_1.ApiError(httpStatus_1.httpStatus.NOT_FOUND, 'Permission not found');
        }
        // Check if name is being changed and if it's already taken
        if (data.name && data.name !== permission.name) {
            const existingPermission = await Permission_1.default.findOne({ name: data.name });
            if (existingPermission) {
                throw new error_1.ApiError(httpStatus_1.httpStatus.CONFLICT, 'Permission with this name already exists');
            }
        }
        const updatedPermission = await Permission_1.default.findByIdAndUpdate(permissionId, data, { new: true, runValidators: true });
        return updatedPermission.toJSON();
    }
    static async deletePermission(permissionId) {
        const permission = await Permission_1.default.findById(permissionId);
        if (!permission) {
            throw new error_1.ApiError(httpStatus_1.httpStatus.NOT_FOUND, 'Permission not found');
        }
        // Check if permission is assigned to any roles
        const { default: Role } = await Promise.resolve().then(() => __importStar(require('../models/Role')));
        const rolesWithPermission = await Role.find({ permissions: permissionId });
        if (rolesWithPermission.length > 0) {
            throw new error_1.ApiError(httpStatus_1.httpStatus.CONFLICT, 'Cannot delete permission that is assigned to roles');
        }
        await Permission_1.default.findByIdAndDelete(permissionId);
    }
    static async getPermissionsByNames(names) {
        const permissions = await Permission_1.default.find({ name: { $in: names } });
        return permissions.map(permission => permission.toJSON());
    }
}
exports.PermissionService = PermissionService;
//# sourceMappingURL=permission.service.js.map