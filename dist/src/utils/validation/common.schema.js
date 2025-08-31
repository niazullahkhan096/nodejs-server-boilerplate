"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createCommonSchemas = exports.commonSchemas = void 0;
const zod_1 = require("zod");
// Common validation patterns that can be reused across schemas
exports.commonSchemas = {
    // String validations
    email: zod_1.z.string().email('Invalid email format'),
    password: zod_1.z.string().min(8, 'Password must be at least 8 characters'),
    passwordRequired: zod_1.z.string().min(1, 'Password is required'),
    name: zod_1.z.string().min(2, 'Name must be at least 2 characters').max(100, 'Name too long'),
    description: zod_1.z.string().max(500, 'Description too long').optional(),
    // Required string validations
    requiredString: zod_1.z.string().min(1, 'This field is required'),
    optionalString: zod_1.z.string().optional(),
    // ID validations
    objectId: zod_1.z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid ID format'),
    // Pagination validations
    page: zod_1.z.string().transform(val => parseInt(val, 10)).pipe(zod_1.z.number().min(1)).optional(),
    limit: zod_1.z.string().transform(val => parseInt(val, 10)).pipe(zod_1.z.number().min(1).max(100)).optional(),
    // Boolean transformations
    booleanString: zod_1.z.string().transform(val => val === 'true').optional(),
    // Date validations
    dateString: zod_1.z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'),
};
// Common schema builders
const createCommonSchemas = () => ({
    // Pagination query schema
    paginationQuery: zod_1.z.object({
        page: exports.commonSchemas.page,
        limit: exports.commonSchemas.limit,
    }),
    // ID param schema
    idParam: zod_1.z.object({
        params: zod_1.z.object({
            id: exports.commonSchemas.objectId,
        }),
    }),
    // Search query schema
    searchQuery: zod_1.z.object({
        query: zod_1.z.object({
            search: exports.commonSchemas.optionalString,
        }),
    }),
});
exports.createCommonSchemas = createCommonSchemas;
//# sourceMappingURL=common.schema.js.map