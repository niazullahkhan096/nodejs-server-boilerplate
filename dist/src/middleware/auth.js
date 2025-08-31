"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticate = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = require("../config");
const error_1 = require("./error");
const httpStatus_1 = require("../utils/httpStatus");
const User_1 = __importDefault(require("../models/User"));
const authenticate = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            throw new error_1.ApiError(httpStatus_1.httpStatus.UNAUTHORIZED, 'Access token required');
        }
        const token = authHeader.substring(7);
        const decoded = jsonwebtoken_1.default.verify(token, config_1.env.JWT_ACCESS_SECRET);
        // Check if user still exists and is active
        const user = await User_1.default.findById(decoded.userId).select('+isActive');
        if (!user || !user.isActive) {
            throw new error_1.ApiError(httpStatus_1.httpStatus.UNAUTHORIZED, 'User not found or inactive');
        }
        // Attach user info to request
        req.user = {
            id: decoded.userId,
            email: decoded.email,
            roles: decoded.roles,
            permissions: decoded.permissions,
        };
        next();
    }
    catch (error) {
        if (error instanceof jsonwebtoken_1.default.JsonWebTokenError) {
            next(new error_1.ApiError(httpStatus_1.httpStatus.UNAUTHORIZED, 'Invalid access token'));
        }
        else if (error instanceof jsonwebtoken_1.default.TokenExpiredError) {
            next(new error_1.ApiError(httpStatus_1.httpStatus.UNAUTHORIZED, 'Access token expired'));
        }
        else {
            next(error);
        }
    }
};
exports.authenticate = authenticate;
//# sourceMappingURL=auth.js.map