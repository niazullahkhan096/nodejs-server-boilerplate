import { z } from 'zod';
export declare const exportUsersSchema: z.ZodObject<{
    query: z.ZodObject<{
        startDate: z.ZodOptional<z.ZodString>;
        endDate: z.ZodOptional<z.ZodString>;
        fields: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        fields?: string | undefined;
        startDate?: string | undefined;
        endDate?: string | undefined;
    }, {
        fields?: string | undefined;
        startDate?: string | undefined;
        endDate?: string | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    query: {
        fields?: string | undefined;
        startDate?: string | undefined;
        endDate?: string | undefined;
    };
}, {
    query: {
        fields?: string | undefined;
        startDate?: string | undefined;
        endDate?: string | undefined;
    };
}>;
export declare const exportStatsSchema: z.ZodObject<{
    query: z.ZodObject<{
        startDate: z.ZodOptional<z.ZodString>;
        endDate: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        startDate?: string | undefined;
        endDate?: string | undefined;
    }, {
        startDate?: string | undefined;
        endDate?: string | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    query: {
        startDate?: string | undefined;
        endDate?: string | undefined;
    };
}, {
    query: {
        startDate?: string | undefined;
        endDate?: string | undefined;
    };
}>;
//# sourceMappingURL=export.schema.d.ts.map