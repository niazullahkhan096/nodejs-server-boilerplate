"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserFilesSchema = exports.getFileSchema = void 0;
const zod_1 = require("zod");
const common_schema_1 = require("./common.schema");
// File validation schemas
exports.getFileSchema = zod_1.z.object({
    params: zod_1.z.object({
        id: common_schema_1.commonSchemas.objectId,
    }),
});
exports.getUserFilesSchema = zod_1.z.object({
    query: zod_1.z.object({
        page: common_schema_1.commonSchemas.page,
        limit: common_schema_1.commonSchemas.limit,
        search: common_schema_1.commonSchemas.optionalString,
        mimeType: common_schema_1.commonSchemas.optionalString,
    }),
});
//# sourceMappingURL=file.schema.js.map