"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorize = void 0;
const error_1 = require("./error");
const httpStatus_1 = require("../utils/httpStatus");
const authorize = (requiredPermissions) => {
    return (req, res, next) => {
        if (!req.user) {
            throw new error_1.ApiError(httpStatus_1.httpStatus.UNAUTHORIZED, 'Authentication required');
        }
        const userPermissions = req.user.permissions || [];
        // Check if user has all required permissions
        const hasAllPermissions = requiredPermissions.every(permission => userPermissions.includes(permission));
        if (!hasAllPermissions) {
            throw new error_1.ApiError(httpStatus_1.httpStatus.FORBIDDEN, `Insufficient permissions. Required: ${requiredPermissions.join(', ')}`);
        }
        next();
    };
};
exports.authorize = authorize;
//# sourceMappingURL=authorize.js.map