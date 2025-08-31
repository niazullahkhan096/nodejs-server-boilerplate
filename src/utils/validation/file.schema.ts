import { z } from 'zod';
import { commonSchemas } from './common.schema';

// File validation schemas
export const getFileSchema = z.object({
  params: z.object({
    id: commonSchemas.objectId,
  }),
});

export const getUserFilesSchema = z.object({
  query: z.object({
    page: commonSchemas.page,
    limit: commonSchemas.limit,
    search: commonSchemas.optionalString,
    mimeType: commonSchemas.optionalString,
  }),
});
