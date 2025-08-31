import { Request, Response, NextFunction } from 'express';
export declare class FileController {
    static uploadFile(req: Request, res: Response, next: NextFunction): Promise<void>;
    static uploadMultipleFiles(req: Request, res: Response, next: NextFunction): Promise<void>;
    static downloadFile(req: Request, res: Response, next: NextFunction): Promise<void>;
    static getFileInfo(req: Request, res: Response, next: NextFunction): Promise<void>;
    static deleteFile(req: Request, res: Response, next: NextFunction): Promise<void>;
    static getUserFiles(req: Request, res: Response, next: NextFunction): Promise<void>;
}
//# sourceMappingURL=file.controller.d.ts.map