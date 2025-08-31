interface TokenPayload {
    userId: string;
    email: string;
    roles: string[];
    permissions: string[];
}
export declare class TokenService {
    static generateAccessToken(payload: TokenPayload): string;
    static generateRefreshToken(payload: TokenPayload): string;
    static saveRefreshToken(userId: string, token: string, userAgent?: string, ip?: string): Promise<void>;
    static verifyRefreshToken(token: string): Promise<{
        payload: TokenPayload;
        jti: string;
    }>;
    static revokeRefreshToken(jti: string): Promise<void>;
    static revokeAllUserTokens(userId: string): Promise<void>;
}
export {};
//# sourceMappingURL=token.service.d.ts.map