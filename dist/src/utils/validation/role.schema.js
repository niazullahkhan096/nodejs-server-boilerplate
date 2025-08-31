"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRoleSchema = exports.updateRoleSchema = exports.createRoleSchema = void 0;
const zod_1 = require("zod");
const common_schema_1 = require("./common.schema");
// Role validation schemas
exports.createRoleSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: common_schema_1.commonSchemas.name,
        description: common_schema_1.commonSchemas.description,
        permissions: zod_1.z.array(common_schema_1.commonSchemas.objectId).optional(),
    }),
});
exports.updateRoleSchema = zod_1.z.object({
    params: zod_1.z.object({
        id: common_schema_1.commonSchemas.objectId,
    }),
    body: zod_1.z.object({
        name: common_schema_1.commonSchemas.name.optional(),
        description: common_schema_1.commonSchemas.description,
        permissions: zod_1.z.array(common_schema_1.commonSchemas.objectId).optional(),
    }),
});
exports.getRoleSchema = zod_1.z.object({
    params: zod_1.z.object({
        id: common_schema_1.commonSchemas.objectId,
    }),
});
//# sourceMappingURL=role.schema.js.map