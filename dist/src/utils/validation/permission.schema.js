"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPermissionSchema = exports.updatePermissionSchema = exports.createPermissionSchema = void 0;
const zod_1 = require("zod");
const common_schema_1 = require("./common.schema");
// Permission validation schemas
exports.createPermissionSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: common_schema_1.commonSchemas.name,
        description: common_schema_1.commonSchemas.description,
        resource: common_schema_1.commonSchemas.requiredString,
        action: common_schema_1.commonSchemas.requiredString,
    }),
});
exports.updatePermissionSchema = zod_1.z.object({
    params: zod_1.z.object({
        id: common_schema_1.commonSchemas.objectId,
    }),
    body: zod_1.z.object({
        name: common_schema_1.commonSchemas.name.optional(),
        description: common_schema_1.commonSchemas.description,
        resource: common_schema_1.commonSchemas.requiredString.optional(),
        action: common_schema_1.commonSchemas.requiredString.optional(),
    }),
});
exports.getPermissionSchema = zod_1.z.object({
    params: zod_1.z.object({
        id: common_schema_1.commonSchemas.objectId,
    }),
});
//# sourceMappingURL=permission.schema.js.map