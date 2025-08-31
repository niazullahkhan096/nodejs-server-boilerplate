import { z } from 'zod';
import { commonSchemas } from './common.schema';

export const exportUsersSchema = z.object({
  query: z.object({
    startDate: commonSchemas.dateString.optional(),
    endDate: commonSchemas.dateString.optional(),
    fields: commonSchemas.optionalString
  })
});

export const exportStatsSchema = z.object({
  query: z.object({
    startDate: commonSchemas.dateString.optional(),
    endDate: commonSchemas.dateString.optional()
  })
});
