"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const auth_service_1 = require("../services/auth.service");
const apiResponse_1 = require("../utils/apiResponse");
const config_1 = require("../config");
class AuthController {
    static async register(req, res, next) {
        try {
            const { email, password, name } = req.body;
            const result = await auth_service_1.AuthService.register({ email, password, name });
            // Set refresh token in cookie if enabled
            if (config_1.env.USE_COOKIES) {
                res.cookie('refreshToken', result.refreshToken, {
                    httpOnly: true,
                    secure: config_1.env.COOKIE_SECURE,
                    sameSite: config_1.env.COOKIE_SAME_SITE,
                    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
                });
            }
            const language = (0, apiResponse_1.getLanguageFromRequest)(req);
            (0, apiResponse_1.sendSuccess)(res, {
                user: result.user,
                accessToken: result.accessToken,
                refreshToken: config_1.env.USE_COOKIES ? undefined : result.refreshToken,
            }, 'auth.register.success', 201, language);
        }
        catch (error) {
            next(error);
        }
    }
    static async login(req, res, next) {
        try {
            const { email, password } = req.body;
            const result = await auth_service_1.AuthService.login({ email, password });
            // Set refresh token in cookie if enabled
            if (config_1.env.USE_COOKIES) {
                res.cookie('refreshToken', result.refreshToken, {
                    httpOnly: true,
                    secure: config_1.env.COOKIE_SECURE,
                    sameSite: config_1.env.COOKIE_SAME_SITE,
                    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
                });
            }
            const language = (0, apiResponse_1.getLanguageFromRequest)(req);
            (0, apiResponse_1.sendSuccess)(res, {
                user: result.user,
                accessToken: result.accessToken,
                refreshToken: config_1.env.USE_COOKIES ? undefined : result.refreshToken,
            }, 'auth.login.success', 200, language);
        }
        catch (error) {
            next(error);
        }
    }
    static async refresh(req, res, next) {
        try {
            let refreshToken;
            if (config_1.env.USE_COOKIES) {
                refreshToken = req.cookies.refreshToken;
                if (!refreshToken) {
                    const language = (0, apiResponse_1.getLanguageFromRequest)(req);
                    (0, apiResponse_1.sendError)(res, 'auth.token.invalid', 401, null, language);
                    return;
                }
            }
            else {
                refreshToken = req.body.refreshToken;
                if (!refreshToken) {
                    const language = (0, apiResponse_1.getLanguageFromRequest)(req);
                    (0, apiResponse_1.sendError)(res, 'auth.token.invalid', 400, null, language);
                    return;
                }
            }
            const result = await auth_service_1.AuthService.refreshToken(refreshToken);
            // Set new refresh token in cookie if enabled
            if (config_1.env.USE_COOKIES) {
                res.cookie('refreshToken', result.refreshToken, {
                    httpOnly: true,
                    secure: config_1.env.COOKIE_SECURE,
                    sameSite: config_1.env.COOKIE_SAME_SITE,
                    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
                });
            }
            const language = (0, apiResponse_1.getLanguageFromRequest)(req);
            (0, apiResponse_1.sendSuccess)(res, {
                user: result.user,
                accessToken: result.accessToken,
                refreshToken: config_1.env.USE_COOKIES ? undefined : result.refreshToken,
            }, 'auth.token.refresh_success', 200, language);
        }
        catch (error) {
            next(error);
        }
    }
    static async logout(req, res, next) {
        try {
            let refreshToken;
            if (config_1.env.USE_COOKIES) {
                refreshToken = req.cookies.refreshToken;
            }
            else {
                refreshToken = req.body.refreshToken;
            }
            if (refreshToken) {
                await auth_service_1.AuthService.logout(refreshToken);
            }
            // Clear refresh token cookie if enabled
            if (config_1.env.USE_COOKIES) {
                res.clearCookie('refreshToken');
            }
            const language = (0, apiResponse_1.getLanguageFromRequest)(req);
            (0, apiResponse_1.sendSuccess)(res, null, 'auth.logout.success', 200, language);
        }
        catch (error) {
            next(error);
        }
    }
    static async getCurrentUser(req, res, next) {
        try {
            if (!req.user) {
                const language = (0, apiResponse_1.getLanguageFromRequest)(req);
                (0, apiResponse_1.sendError)(res, 'unauthorized', 401, null, language);
                return;
            }
            const user = await auth_service_1.AuthService.getCurrentUser(req.user.id);
            const language = (0, apiResponse_1.getLanguageFromRequest)(req);
            (0, apiResponse_1.sendSuccess)(res, user, 'user.list.success', 200, language);
        }
        catch (error) {
            next(error);
        }
    }
}
exports.AuthController = AuthController;
//# sourceMappingURL=auth.controller.js.map