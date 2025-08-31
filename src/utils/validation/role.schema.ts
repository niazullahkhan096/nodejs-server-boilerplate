import { z } from 'zod';
import { commonSchemas } from './common.schema';

// Role validation schemas
export const createRoleSchema = z.object({
  body: z.object({
    name: commonSchemas.name,
    description: commonSchemas.description,
    permissions: z.array(commonSchemas.objectId).optional(),
  }),
});

export const updateRoleSchema = z.object({
  params: z.object({
    id: commonSchemas.objectId,
  }),
  body: z.object({
    name: commonSchemas.name.optional(),
    description: commonSchemas.description,
    permissions: z.array(commonSchemas.objectId).optional(),
  }),
});

export const getRoleSchema = z.object({
  params: z.object({
    id: commonSchemas.objectId,
  }),
});
