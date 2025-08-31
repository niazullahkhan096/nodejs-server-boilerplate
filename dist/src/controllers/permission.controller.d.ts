import { Request, Response, NextFunction } from 'express';
export declare class PermissionController {
    static createPermission(req: Request, res: Response, next: NextFunction): Promise<void>;
    static getPermissions(req: Request, res: Response, next: NextFunction): Promise<void>;
    static getPermissionById(req: Request, res: Response, next: NextFunction): Promise<void>;
    static updatePermission(req: Request, res: Response, next: NextFunction): Promise<void>;
    static deletePermission(req: Request, res: Response, next: NextFunction): Promise<void>;
}
//# sourceMappingURL=permission.controller.d.ts.map