"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.exportStatsSchema = exports.exportUsersSchema = void 0;
const zod_1 = require("zod");
const common_schema_1 = require("./common.schema");
exports.exportUsersSchema = zod_1.z.object({
    query: zod_1.z.object({
        startDate: common_schema_1.commonSchemas.dateString.optional(),
        endDate: common_schema_1.commonSchemas.dateString.optional(),
        fields: common_schema_1.commonSchemas.optionalString
    })
});
exports.exportStatsSchema = zod_1.z.object({
    query: zod_1.z.object({
        startDate: common_schema_1.commonSchemas.dateString.optional(),
        endDate: common_schema_1.commonSchemas.dateString.optional()
    })
});
//# sourceMappingURL=export.schema.js.map