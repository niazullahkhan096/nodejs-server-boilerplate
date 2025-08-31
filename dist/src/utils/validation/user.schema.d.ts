import { z } from 'zod';
export declare const createUserSchema: z.ZodObject<{
    body: z.ZodObject<{
        email: z.ZodString;
        password: z.ZodString;
        name: z.ZodString;
        roles: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        isActive: z.ZodOptional<z.ZodBoolean>;
    }, "strip", z.ZodTypeAny, {
        email: string;
        password: string;
        name: string;
        roles?: string[] | undefined;
        isActive?: boolean | undefined;
    }, {
        email: string;
        password: string;
        name: string;
        roles?: string[] | undefined;
        isActive?: boolean | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    body: {
        email: string;
        password: string;
        name: string;
        roles?: string[] | undefined;
        isActive?: boolean | undefined;
    };
}, {
    body: {
        email: string;
        password: string;
        name: string;
        roles?: string[] | undefined;
        isActive?: boolean | undefined;
    };
}>;
export declare const updateUserSchema: z.ZodObject<{
    params: z.ZodObject<{
        id: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        id: string;
    }, {
        id: string;
    }>;
    body: z.ZodObject<{
        email: z.ZodOptional<z.ZodString>;
        password: z.ZodOptional<z.ZodString>;
        name: z.ZodOptional<z.ZodString>;
        roles: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        isActive: z.ZodOptional<z.ZodBoolean>;
    }, "strip", z.ZodTypeAny, {
        email?: string | undefined;
        password?: string | undefined;
        name?: string | undefined;
        roles?: string[] | undefined;
        isActive?: boolean | undefined;
    }, {
        email?: string | undefined;
        password?: string | undefined;
        name?: string | undefined;
        roles?: string[] | undefined;
        isActive?: boolean | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    params: {
        id: string;
    };
    body: {
        email?: string | undefined;
        password?: string | undefined;
        name?: string | undefined;
        roles?: string[] | undefined;
        isActive?: boolean | undefined;
    };
}, {
    params: {
        id: string;
    };
    body: {
        email?: string | undefined;
        password?: string | undefined;
        name?: string | undefined;
        roles?: string[] | undefined;
        isActive?: boolean | undefined;
    };
}>;
export declare const getUserSchema: z.ZodObject<{
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
export declare const getUsersSchema: z.ZodObject<{
    query: z.ZodObject<{
        page: z.ZodOptional<z.ZodPipeline<z.ZodEffects<z.ZodString, number, string>, z.ZodNumber>>;
        limit: z.ZodOptional<z.ZodPipeline<z.ZodEffects<z.ZodString, number, string>, z.ZodNumber>>;
        search: z.ZodOptional<z.ZodString>;
        role: z.ZodOptional<z.ZodString>;
        isActive: z.ZodOptional<z.ZodEffects<z.ZodString, boolean, string>>;
    }, "strip", z.ZodTypeAny, {
        isActive?: boolean | undefined;
        search?: string | undefined;
        limit?: number | undefined;
        page?: number | undefined;
        role?: string | undefined;
    }, {
        isActive?: string | undefined;
        search?: string | undefined;
        limit?: string | undefined;
        page?: string | undefined;
        role?: string | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    query: {
        isActive?: boolean | undefined;
        search?: string | undefined;
        limit?: number | undefined;
        page?: number | undefined;
        role?: string | undefined;
    };
}, {
    query: {
        isActive?: string | undefined;
        search?: string | undefined;
        limit?: string | undefined;
        page?: string | undefined;
        role?: string | undefined;
    };
}>;
//# sourceMappingURL=user.schema.d.ts.map