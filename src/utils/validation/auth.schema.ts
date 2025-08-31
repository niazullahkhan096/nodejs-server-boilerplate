import { z } from 'zod';
import { commonSchemas } from './common.schema';

// Auth validation schemas
export const registerSchema = z.object({
  body: z.object({
    email: commonSchemas.email,
    password: commonSchemas.password,
    name: commonSchemas.name,
  }),
});

export const loginSchema = z.object({
  body: z.object({
    email: commonSchemas.email,
    password: commonSchemas.passwordRequired,
  }),
});

export const refreshSchema = z.object({
  body: z.object({
    refreshToken: commonSchemas.optionalString,
  }),
});

export const logoutSchema = z.object({
  body: z.object({
    refreshToken: commonSchemas.optionalString,
  }),
});
