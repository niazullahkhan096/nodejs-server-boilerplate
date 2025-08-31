import { z } from 'zod';
export declare const createPermissionSchema: z.ZodObject<{
    body: z.ZodObject<{
        name: z.ZodString;
        description: z.ZodOptional<z.ZodString>;
        resource: z.ZodString;
        action: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        name: string;
        resource: string;
        action: string;
        description?: string | undefined;
    }, {
        name: string;
        resource: string;
        action: string;
        description?: string | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    body: {
        name: string;
        resource: string;
        action: string;
        description?: string | undefined;
    };
}, {
    body: {
        name: string;
        resource: string;
        action: string;
        description?: string | undefined;
    };
}>;
export declare const updatePermissionSchema: z.ZodObject<{
    params: z.ZodObject<{
        id: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        id: string;
    }, {
        id: string;
    }>;
    body: z.ZodObject<{
        name: z.ZodOptional<z.ZodString>;
        description: z.ZodOptional<z.ZodString>;
        resource: z.ZodOptional<z.ZodString>;
        action: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        name?: string | undefined;
        description?: string | undefined;
        resource?: string | undefined;
        action?: string | undefined;
    }, {
        name?: string | undefined;
        description?: string | undefined;
        resource?: string | undefined;
        action?: string | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    params: {
        id: string;
    };
    body: {
        name?: string | undefined;
        description?: string | undefined;
        resource?: string | undefined;
        action?: string | undefined;
    };
}, {
    params: {
        id: string;
    };
    body: {
        name?: string | undefined;
        description?: string | undefined;
        resource?: string | undefined;
        action?: string | undefined;
    };
}>;
export declare const getPermissionSchema: z.ZodObject<{
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
//# sourceMappingURL=permission.schema.d.ts.map