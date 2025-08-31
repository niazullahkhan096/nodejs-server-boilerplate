import { Request, Response, NextFunction } from 'express';
export declare class ApiError extends Error {
    statusCode: number;
    details?: Record<string, string[]>;
    constructor(statusCode: number, message: string, details?: Record<string, string[]>);
}
export declare const errorConverter: (err: Error, req: Request, res: Response, next: NextFunction) => void;
export declare const errorHandler: (err: ApiError, req: Request, res: Response, next: NextFunction) => void;
//# sourceMappingURL=error.d.ts.map