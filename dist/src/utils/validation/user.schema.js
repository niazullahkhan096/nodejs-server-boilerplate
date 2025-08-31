"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUsersSchema = exports.getUserSchema = exports.updateUserSchema = exports.createUserSchema = void 0;
const zod_1 = require("zod");
const common_schema_1 = require("./common.schema");
// User validation schemas
exports.createUserSchema = zod_1.z.object({
    body: zod_1.z.object({
        email: common_schema_1.commonSchemas.email,
        password: common_schema_1.commonSchemas.password,
        name: common_schema_1.commonSchemas.name,
        roles: zod_1.z.array(common_schema_1.commonSchemas.objectId).optional(),
        isActive: zod_1.z.boolean().optional(),
    }),
});
exports.updateUserSchema = zod_1.z.object({
    params: zod_1.z.object({
        id: common_schema_1.commonSchemas.objectId,
    }),
    body: zod_1.z.object({
        email: common_schema_1.commonSchemas.email.optional(),
        password: common_schema_1.commonSchemas.password.optional(),
        name: common_schema_1.commonSchemas.name.optional(),
        roles: zod_1.z.array(common_schema_1.commonSchemas.objectId).optional(),
        isActive: zod_1.z.boolean().optional(),
    }),
});
exports.getUserSchema = zod_1.z.object({
    params: zod_1.z.object({
        id: common_schema_1.commonSchemas.objectId,
    }),
});
exports.getUsersSchema = zod_1.z.object({
    query: zod_1.z.object({
        page: common_schema_1.commonSchemas.page,
        limit: common_schema_1.commonSchemas.limit,
        search: common_schema_1.commonSchemas.optionalString,
        role: common_schema_1.commonSchemas.objectId.optional(),
        isActive: common_schema_1.commonSchemas.booleanString,
    }),
});
//# sourceMappingURL=user.schema.js.map