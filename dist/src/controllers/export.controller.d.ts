import { Request, Response, NextFunction } from 'express';
export declare class ExportController {
    /**
     * Export users data to CSV
     */
    static exportUsers(req: Request, res: Response, next: NextFunction): Promise<void>;
    /**
     * Get available export fields
     */
    static getExportFields(req: Request, res: Response, next: NextFunction): Promise<void>;
    /**
     * Get export statistics (count of users in date range)
     */
    static getExportStats(req: Request, res: Response, next: NextFunction): Promise<void>;
}
//# sourceMappingURL=export.controller.d.ts.map