interface CreateRoleData {
    name: string;
    description: string;
    permissions: string[];
}
interface UpdateRoleData {
    name?: string;
    description?: string;
    permissions?: string[];
}
export declare class RoleService {
    static createRole(data: CreateRoleData): Promise<any>;
    static getRoles(): Promise<any[]>;
    static getRoleById(roleId: string): Promise<any>;
    static updateRole(roleId: string, data: UpdateRoleData): Promise<any>;
    static deleteRole(roleId: string): Promise<void>;
    static getRolePermissions(roleId: string): Promise<string[]>;
}
export {};
//# sourceMappingURL=role.service.d.ts.map