export declare const hashPassword: (password: string) => Promise<string>;
export declare const comparePassword: (password: string, hash: string) => Promise<boolean>;
export declare const hashToken: (token: string) => Promise<string>;
export declare const compareToken: (token: string, hash: string) => Promise<boolean>;
export declare const generateRandomString: (length?: number) => string;
export declare const generateJti: () => string;
//# sourceMappingURL=crypto.d.ts.map