import { FileUploadService } from './fileUpload.service';
import { UploadedFile } from './baseFile.service';

export class FileService {
  private static fileUploadService = new FileUploadService();

  static async uploadFile(file: UploadedFile, ownerId: string): Promise<any> {
    return this.fileUploadService.uploadFile(file, ownerId, {
      category: 'documents'
    });
  }

  static async getFile(fileId: string, userId: string): Promise<{ fileObject: any; stream: any }> {
    return this.fileUploadService.getFileWithStream(fileId, userId);
  }

  static async deleteFile(fileId: string, userId: string): Promise<void> {
    return this.fileUploadService.deleteFile(fileId, userId);
  }

  static async getUserFiles(userId: string, page = 1, limit = 10): Promise<{ files: any[]; total: number; page: number; totalPages: number }> {
    return this.fileUploadService.getUserFiles(userId, page, limit);
  }

  static async getFileById(fileId: string, userId: string): Promise<any> {
    return this.fileUploadService.getFileById(fileId, userId);
  }
}
