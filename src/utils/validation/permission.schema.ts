import { z } from 'zod';
import { commonSchemas } from './common.schema';

// Permission validation schemas
export const createPermissionSchema = z.object({
  body: z.object({
    name: commonSchemas.name,
    description: commonSchemas.description,
    resource: commonSchemas.requiredString,
    action: commonSchemas.requiredString,
  }),
});

export const updatePermissionSchema = z.object({
  params: z.object({
    id: commonSchemas.objectId,
  }),
  body: z.object({
    name: commonSchemas.name.optional(),
    description: commonSchemas.description,
    resource: commonSchemas.requiredString.optional(),
    action: commonSchemas.requiredString.optional(),
  }),
});

export const getPermissionSchema = z.object({
  params: z.object({
    id: commonSchemas.objectId,
  }),
});
