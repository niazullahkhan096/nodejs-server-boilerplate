interface RegisterData {
    email: string;
    password: string;
    name: string;
}
interface LoginData {
    email: string;
    password: string;
}
interface AuthResponse {
    user: any;
    accessToken: string;
    refreshToken: string;
}
export declare class AuthService {
    static register(data: RegisterData): Promise<AuthResponse>;
    static login(data: LoginData): Promise<AuthResponse>;
    static refreshToken(token: string): Promise<AuthResponse>;
    static logout(refreshToken: string): Promise<void>;
    static getCurrentUser(userId: string): Promise<any>;
}
export {};
//# sourceMappingURL=auth.service.d.ts.map