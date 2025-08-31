"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PermissionController = void 0;
const permission_service_1 = require("../services/permission.service");
const apiResponse_1 = require("../utils/apiResponse");
const httpStatus_1 = require("../utils/httpStatus");
class PermissionController {
    static async createPermission(req, res, next) {
        try {
            const { name, description } = req.body;
            const permission = await permission_service_1.PermissionService.createPermission({ name, description });
            (0, apiResponse_1.sendSuccess)(res, permission, 'Permission created successfully', httpStatus_1.httpStatus.CREATED);
        }
        catch (error) {
            next(error);
        }
    }
    static async getPermissions(req, res, next) {
        try {
            const permissions = await permission_service_1.PermissionService.getPermissions();
            (0, apiResponse_1.sendSuccess)(res, permissions, 'Permissions retrieved successfully');
        }
        catch (error) {
            next(error);
        }
    }
    static async getPermissionById(req, res, next) {
        try {
            const { id } = req.params;
            const permission = await permission_service_1.PermissionService.getPermissionById(id);
            (0, apiResponse_1.sendSuccess)(res, permission, 'Permission retrieved successfully');
        }
        catch (error) {
            next(error);
        }
    }
    static async updatePermission(req, res, next) {
        try {
            const { id } = req.params;
            const updateData = req.body;
            const permission = await permission_service_1.PermissionService.updatePermission(id, updateData);
            (0, apiResponse_1.sendSuccess)(res, permission, 'Permission updated successfully');
        }
        catch (error) {
            next(error);
        }
    }
    static async deletePermission(req, res, next) {
        try {
            const { id } = req.params;
            await permission_service_1.PermissionService.deletePermission(id);
            (0, apiResponse_1.sendSuccess)(res, null, 'Permission deleted successfully', httpStatus_1.httpStatus.NO_CONTENT);
        }
        catch (error) {
            next(error);
        }
    }
}
exports.PermissionController = PermissionController;
//# sourceMappingURL=permission.controller.js.map