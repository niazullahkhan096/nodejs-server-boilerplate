"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const user_service_1 = require("../services/user.service");
const apiResponse_1 = require("../utils/apiResponse");
const httpStatus_1 = require("../utils/httpStatus");
class UserController {
    static async createUser(req, res, next) {
        try {
            const { email, password, name, roles } = req.body;
            const user = await user_service_1.UserService.createUser({ email, password, name, roles });
            (0, apiResponse_1.sendSuccess)(res, user, 'User created successfully', httpStatus_1.httpStatus.CREATED);
        }
        catch (error) {
            next(error);
        }
    }
    static async getUsers(req, res, next) {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const search = req.query.search;
            const result = await user_service_1.UserService.getUsers(page, limit, search);
            (0, apiResponse_1.sendSuccess)(res, result, 'Users retrieved successfully');
        }
        catch (error) {
            next(error);
        }
    }
    static async getUserById(req, res, next) {
        try {
            const { id } = req.params;
            const user = await user_service_1.UserService.getUserById(id);
            (0, apiResponse_1.sendSuccess)(res, user, 'User retrieved successfully');
        }
        catch (error) {
            next(error);
        }
    }
    static async updateUser(req, res, next) {
        try {
            const { id } = req.params;
            const updateData = req.body;
            const user = await user_service_1.UserService.updateUser(id, updateData);
            (0, apiResponse_1.sendSuccess)(res, user, 'User updated successfully');
        }
        catch (error) {
            next(error);
        }
    }
    static async deleteUser(req, res, next) {
        try {
            const { id } = req.params;
            await user_service_1.UserService.deleteUser(id);
            (0, apiResponse_1.sendSuccess)(res, null, 'User deleted successfully', httpStatus_1.httpStatus.NO_CONTENT);
        }
        catch (error) {
            next(error);
        }
    }
    static async getUserPermissions(req, res, next) {
        try {
            const { id } = req.params;
            const permissions = await user_service_1.UserService.getUserPermissions(id);
            (0, apiResponse_1.sendSuccess)(res, { permissions }, 'User permissions retrieved successfully');
        }
        catch (error) {
            next(error);
        }
    }
}
exports.UserController = UserController;
//# sourceMappingURL=user.controller.js.map