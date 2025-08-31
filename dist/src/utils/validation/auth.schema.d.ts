import { z } from 'zod';
export declare const registerSchema: z.ZodObject<{
    body: z.ZodObject<{
        email: z.ZodString;
        password: z.ZodString;
        name: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        email: string;
        password: string;
        name: string;
    }, {
        email: string;
        password: string;
        name: string;
    }>;
}, "strip", z.ZodTypeAny, {
    body: {
        email: string;
        password: string;
        name: string;
    };
}, {
    body: {
        email: string;
        password: string;
        name: string;
    };
}>;
export declare const loginSchema: z.ZodObject<{
    body: z.ZodObject<{
        email: z.ZodString;
        password: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        email: string;
        password: string;
    }, {
        email: string;
        password: string;
    }>;
}, "strip", z.ZodTypeAny, {
    body: {
        email: string;
        password: string;
    };
}, {
    body: {
        email: string;
        password: string;
    };
}>;
export declare const refreshSchema: z.ZodObject<{
    body: z.ZodObject<{
        refreshToken: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        refreshToken?: string | undefined;
    }, {
        refreshToken?: string | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    body: {
        refreshToken?: string | undefined;
    };
}, {
    body: {
        refreshToken?: string | undefined;
    };
}>;
export declare const logoutSchema: z.ZodObject<{
    body: z.ZodObject<{
        refreshToken: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        refreshToken?: string | undefined;
    }, {
        refreshToken?: string | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    body: {
        refreshToken?: string | undefined;
    };
}, {
    body: {
        refreshToken?: string | undefined;
    };
}>;
//# sourceMappingURL=auth.schema.d.ts.map