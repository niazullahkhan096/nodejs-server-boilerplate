import { Request, Response, NextFunction } from 'express';
export declare class UserController {
    static createUser(req: Request, res: Response, next: NextFunction): Promise<void>;
    static getUsers(req: Request, res: Response, next: NextFunction): Promise<void>;
    static getUserById(req: Request, res: Response, next: NextFunction): Promise<void>;
    static updateUser(req: Request, res: Response, next: NextFunction): Promise<void>;
    static deleteUser(req: Request, res: Response, next: NextFunction): Promise<void>;
    static getUserPermissions(req: Request, res: Response, next: NextFunction): Promise<void>;
}
//# sourceMappingURL=user.controller.d.ts.map