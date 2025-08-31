import { Request, Response, NextFunction } from 'express';
export declare class RoleController {
    static createRole(req: Request, res: Response, next: NextFunction): Promise<void>;
    static getRoles(req: Request, res: Response, next: NextFunction): Promise<void>;
    static getRoleById(req: Request, res: Response, next: NextFunction): Promise<void>;
    static updateRole(req: Request, res: Response, next: NextFunction): Promise<void>;
    static deleteRole(req: Request, res: Response, next: NextFunction): Promise<void>;
    static getRolePermissions(req: Request, res: Response, next: NextFunction): Promise<void>;
}
//# sourceMappingURL=role.controller.d.ts.map