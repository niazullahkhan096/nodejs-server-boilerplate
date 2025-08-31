interface UploadedFile {
    originalname: string;
    mimetype: string;
    size: number;
    buffer: Buffer;
}
export declare class FileService {
    static uploadFile(file: UploadedFile, ownerId: string): Promise<any>;
    private static uploadToLocal;
    static getFile(fileId: string, userId: string): Promise<{
        fileObject: any;
        stream: any;
    }>;
    static deleteFile(fileId: string, userId: string): Promise<void>;
    static getUserFiles(userId: string, page?: number, limit?: number): Promise<{
        files: any[];
        total: number;
        page: number;
        totalPages: number;
    }>;
    static getFileById(fileId: string, userId: string): Promise<any>;
}
export {};
//# sourceMappingURL=file.service.d.ts.map