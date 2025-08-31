import { z } from 'zod';
export declare const commonSchemas: {
    readonly email: z.ZodString;
    readonly password: z.ZodString;
    readonly passwordRequired: z.ZodString;
    readonly name: z.ZodString;
    readonly description: z.ZodOptional<z.ZodString>;
    readonly requiredString: z.ZodString;
    readonly optionalString: z.ZodOptional<z.ZodString>;
    readonly objectId: z.ZodString;
    readonly page: z.ZodOptional<z.ZodPipeline<z.ZodEffects<z.ZodString, number, string>, z.ZodNumber>>;
    readonly limit: z.ZodOptional<z.ZodPipeline<z.ZodEffects<z.ZodString, number, string>, z.ZodNumber>>;
    readonly booleanString: z.ZodOptional<z.ZodEffects<z.ZodString, boolean, string>>;
    readonly dateString: z.ZodString;
};
export declare const createCommonSchemas: () => {
    paginationQuery: z.ZodObject<{
        page: z.ZodOptional<z.ZodPipeline<z.ZodEffects<z.ZodString, number, string>, z.ZodNumber>>;
        limit: z.ZodOptional<z.ZodPipeline<z.ZodEffects<z.ZodString, number, string>, z.ZodNumber>>;
    }, "strip", z.ZodTypeAny, {
        limit?: number | undefined;
        page?: number | undefined;
    }, {
        limit?: string | undefined;
        page?: string | undefined;
    }>;
    idParam: z.ZodObject<{
        params: z.ZodObject<{
            id: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            id: string;
        }, {
            id: string;
        }>;
    }, "strip", z.ZodTypeAny, {
        params: {
            id: string;
        };
    }, {
        params: {
            id: string;
        };
    }>;
    searchQuery: z.ZodObject<{
        query: z.ZodObject<{
            search: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            search?: string | undefined;
        }, {
            search?: string | undefined;
        }>;
    }, "strip", z.ZodTypeAny, {
        query: {
            search?: string | undefined;
        };
    }, {
        query: {
            search?: string | undefined;
        };
    }>;
};
//# sourceMappingURL=common.schema.d.ts.map