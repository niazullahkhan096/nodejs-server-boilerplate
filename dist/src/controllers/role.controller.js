"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoleController = void 0;
const role_service_1 = require("../services/role.service");
const apiResponse_1 = require("../utils/apiResponse");
const httpStatus_1 = require("../utils/httpStatus");
class RoleController {
    static async createRole(req, res, next) {
        try {
            const { name, description, permissions } = req.body;
            const role = await role_service_1.RoleService.createRole({ name, description, permissions });
            (0, apiResponse_1.sendSuccess)(res, role, 'Role created successfully', httpStatus_1.httpStatus.CREATED);
        }
        catch (error) {
            next(error);
        }
    }
    static async getRoles(req, res, next) {
        try {
            const roles = await role_service_1.RoleService.getRoles();
            (0, apiResponse_1.sendSuccess)(res, roles, 'Roles retrieved successfully');
        }
        catch (error) {
            next(error);
        }
    }
    static async getRoleById(req, res, next) {
        try {
            const { id } = req.params;
            const role = await role_service_1.RoleService.getRoleById(id);
            (0, apiResponse_1.sendSuccess)(res, role, 'Role retrieved successfully');
        }
        catch (error) {
            next(error);
        }
    }
    static async updateRole(req, res, next) {
        try {
            const { id } = req.params;
            const updateData = req.body;
            const role = await role_service_1.RoleService.updateRole(id, updateData);
            (0, apiResponse_1.sendSuccess)(res, role, 'Role updated successfully');
        }
        catch (error) {
            next(error);
        }
    }
    static async deleteRole(req, res, next) {
        try {
            const { id } = req.params;
            await role_service_1.RoleService.deleteRole(id);
            (0, apiResponse_1.sendSuccess)(res, null, 'Role deleted successfully', httpStatus_1.httpStatus.NO_CONTENT);
        }
        catch (error) {
            next(error);
        }
    }
    static async getRolePermissions(req, res, next) {
        try {
            const { id } = req.params;
            const permissions = await role_service_1.RoleService.getRolePermissions(id);
            (0, apiResponse_1.sendSuccess)(res, { permissions }, 'Role permissions retrieved successfully');
        }
        catch (error) {
            next(error);
        }
    }
}
exports.RoleController = RoleController;
//# sourceMappingURL=role.controller.js.map