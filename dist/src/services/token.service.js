"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TokenService = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = require("../config");
const crypto_1 = require("../utils/crypto");
const RefreshToken_1 = __importDefault(require("../models/RefreshToken"));
const error_1 = require("../middleware/error");
const httpStatus_1 = require("../utils/httpStatus");
class TokenService {
    static generateAccessToken(payload) {
        return jsonwebtoken_1.default.sign(payload, config_1.env.JWT_ACCESS_SECRET, {
            expiresIn: config_1.env.JWT_ACCESS_EXP,
        });
    }
    static generateRefreshToken(payload) {
        return jsonwebtoken_1.default.sign(payload, config_1.env.JWT_REFRESH_SECRET, {
            expiresIn: config_1.env.JWT_REFRESH_EXP,
            jwtid: (0, crypto_1.generateJti)(),
        });
    }
    static async saveRefreshToken(userId, token, userAgent, ip) {
        const decoded = jsonwebtoken_1.default.decode(token);
        const tokenHash = await (0, crypto_1.hashToken)(token);
        await RefreshToken_1.default.create({
            userId,
            tokenHash,
            jti: decoded.jti,
            expiresAt: new Date(decoded.exp * 1000),
            userAgent,
            ip,
        });
    }
    static async verifyRefreshToken(token) {
        try {
            const decoded = jsonwebtoken_1.default.verify(token, config_1.env.JWT_REFRESH_SECRET);
            // Check if token exists and is not revoked
            const refreshToken = await RefreshToken_1.default.findOne({
                jti: decoded.jti,
                revokedAt: null,
            });
            if (!refreshToken) {
                throw new error_1.ApiError(httpStatus_1.httpStatus.UNAUTHORIZED, 'Refresh token not found or revoked');
            }
            // Verify token hash
            const isValid = await (0, crypto_1.compareToken)(token, refreshToken.tokenHash);
            if (!isValid) {
                throw new error_1.ApiError(httpStatus_1.httpStatus.UNAUTHORIZED, 'Invalid refresh token');
            }
            // Check if token is expired
            if (new Date() > refreshToken.expiresAt) {
                throw new error_1.ApiError(httpStatus_1.httpStatus.UNAUTHORIZED, 'Refresh token expired');
            }
            return {
                payload: {
                    userId: decoded.userId,
                    email: decoded.email,
                    roles: decoded.roles,
                    permissions: decoded.permissions,
                },
                jti: decoded.jti || '',
            };
        }
        catch (error) {
            if (error instanceof jsonwebtoken_1.default.JsonWebTokenError) {
                throw new error_1.ApiError(httpStatus_1.httpStatus.UNAUTHORIZED, 'Invalid refresh token');
            }
            throw error;
        }
    }
    static async revokeRefreshToken(jti) {
        await RefreshToken_1.default.findOneAndUpdate({ jti, revokedAt: null }, { revokedAt: new Date() });
    }
    static async revokeAllUserTokens(userId) {
        await RefreshToken_1.default.updateMany({ userId, revokedAt: null }, { revokedAt: new Date() });
    }
}
exports.TokenService = TokenService;
//# sourceMappingURL=token.service.js.map