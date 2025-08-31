"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_routes_1 = __importDefault(require("./auth.routes"));
const user_routes_1 = __importDefault(require("./user.routes"));
const role_routes_1 = __importDefault(require("./role.routes"));
const permission_routes_1 = __importDefault(require("./permission.routes"));
const file_routes_1 = __importDefault(require("./file.routes"));
const export_routes_1 = __importDefault(require("./export.routes"));
const router = (0, express_1.Router)();
const apiResponse_1 = require("../utils/apiResponse");
// Health check endpoints
router.get('/healthz', (req, res) => {
    const language = (0, apiResponse_1.getLanguageFromRequest)(req);
    (0, apiResponse_1.sendSuccess)(res, { timestamp: new Date().toISOString() }, 'health.success', 200, language);
});
router.get('/readyz', (req, res) => {
    const language = (0, apiResponse_1.getLanguageFromRequest)(req);
    (0, apiResponse_1.sendSuccess)(res, { timestamp: new Date().toISOString() }, 'ready.success', 200, language);
});
// API routes
router.use('/api/v1/auth', auth_routes_1.default);
router.use('/api/v1/users', user_routes_1.default);
router.use('/api/v1/roles', role_routes_1.default);
router.use('/api/v1/permissions', permission_routes_1.default);
router.use('/api/v1/files', file_routes_1.default);
router.use('/api/v1/export', export_routes_1.default);
exports.default = router;
//# sourceMappingURL=index.js.map