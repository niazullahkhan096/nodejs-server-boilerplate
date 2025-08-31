import { z } from 'zod';
import { commonSchemas } from './common.schema';

// User validation schemas
export const createUserSchema = z.object({
  body: z.object({
    email: commonSchemas.email,
    password: commonSchemas.password,
    name: commonSchemas.name,
    roles: z.array(commonSchemas.objectId).optional(),
    isActive: z.boolean().optional(),
  }),
});

export const updateUserSchema = z.object({
  params: z.object({
    id: commonSchemas.objectId,
  }),
  body: z.object({
    email: commonSchemas.email.optional(),
    password: commonSchemas.password.optional(),
    name: commonSchemas.name.optional(),
    roles: z.array(commonSchemas.objectId).optional(),
    isActive: z.boolean().optional(),
  }),
});

export const getUserSchema = z.object({
  params: z.object({
    id: commonSchemas.objectId,
  }),
});

export const getUsersSchema = z.object({
  query: z.object({
    page: commonSchemas.page,
    limit: commonSchemas.limit,
    search: commonSchemas.optionalString,
    role: commonSchemas.objectId.optional(),
    isActive: commonSchemas.booleanString,
  }),
});
