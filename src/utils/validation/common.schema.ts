import { z } from 'zod';

// Common validation patterns that can be reused across schemas
export const commonSchemas = {
  // String validations
  email: z.string().email('Invalid email format'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  passwordRequired: z.string().min(1, 'Password is required'),
  name: z.string().min(2, 'Name must be at least 2 characters').max(100, 'Name too long'),
  description: z.string().max(500, 'Description too long').optional(),
  
  // Required string validations
  requiredString: z.string().min(1, 'This field is required'),
  optionalString: z.string().optional(),
  
  // ID validations
  objectId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid ID format'),
  
  // Pagination validations
  page: z.string().transform(val => parseInt(val, 10)).pipe(z.number().min(1)).optional(),
  limit: z.string().transform(val => parseInt(val, 10)).pipe(z.number().min(1).max(100)).optional(),
  
  // Boolean transformations
  booleanString: z.string().transform(val => val === 'true').optional(),
  
  // Date validations
  dateString: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'),
} as const;

// Common schema builders
export const createCommonSchemas = () => ({
  // Pagination query schema
  paginationQuery: z.object({
    page: commonSchemas.page,
    limit: commonSchemas.limit,
  }),
  
  // ID param schema
  idParam: z.object({
    params: z.object({
      id: commonSchemas.objectId,
    }),
  }),
  
  // Search query schema
  searchQuery: z.object({
    query: z.object({
      search: commonSchemas.optionalString,
    }),
  }),
});
