interface CreateUserData {
    email: string;
    password: string;
    name: string;
    roles?: string[];
}
interface UpdateUserData {
    email?: string;
    name?: string;
    roles?: string[];
    isActive?: boolean;
}
export declare class UserService {
    static createUser(data: CreateUserData): Promise<any>;
    static getUsers(page?: number, limit?: number, search?: string): Promise<{
        users: any[];
        total: number;
        page: number;
        totalPages: number;
    }>;
    static getUserById(userId: string): Promise<any>;
    static updateUser(userId: string, data: UpdateUserData): Promise<any>;
    static deleteUser(userId: string): Promise<void>;
    static getUserPermissions(userId: string): Promise<string[]>;
}
export {};
//# sourceMappingURL=user.service.d.ts.map