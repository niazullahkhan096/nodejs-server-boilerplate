interface CreatePermissionData {
    name: string;
    description: string;
}
interface UpdatePermissionData {
    name?: string;
    description?: string;
}
export declare class PermissionService {
    static createPermission(data: CreatePermissionData): Promise<any>;
    static getPermissions(): Promise<any[]>;
    static getPermissionById(permissionId: string): Promise<any>;
    static updatePermission(permissionId: string, data: UpdatePermissionData): Promise<any>;
    static deletePermission(permissionId: string): Promise<void>;
    static getPermissionsByNames(names: string[]): Promise<any[]>;
}
export {};
//# sourceMappingURL=permission.service.d.ts.map