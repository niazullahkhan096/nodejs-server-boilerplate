"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logoutSchema = exports.refreshSchema = exports.loginSchema = exports.registerSchema = void 0;
const zod_1 = require("zod");
const common_schema_1 = require("./common.schema");
// Auth validation schemas
exports.registerSchema = zod_1.z.object({
    body: zod_1.z.object({
        email: common_schema_1.commonSchemas.email,
        password: common_schema_1.commonSchemas.password,
        name: common_schema_1.commonSchemas.name,
    }),
});
exports.loginSchema = zod_1.z.object({
    body: zod_1.z.object({
        email: common_schema_1.commonSchemas.email,
        password: common_schema_1.commonSchemas.passwordRequired,
    }),
});
exports.refreshSchema = zod_1.z.object({
    body: zod_1.z.object({
        refreshToken: common_schema_1.commonSchemas.optionalString,
    }),
});
exports.logoutSchema = zod_1.z.object({
    body: zod_1.z.object({
        refreshToken: common_schema_1.commonSchemas.optionalString,
    }),
});
//# sourceMappingURL=auth.schema.js.map