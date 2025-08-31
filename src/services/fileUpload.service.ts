import { BaseFileService, UploadedFile, FileUploadOptions } from './baseFile.service';
import { env } from '../config';

export class FileUploadService extends BaseFileService {
  protected getValidationRules() {
    return {
      allowedMimeTypes: [
        // Images
        'image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp',
        // Documents
        'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'text/plain', 'text/csv',
        // Archives
        'application/zip', 'application/x-rar-compressed', 'application/x-7z-compressed',
        // Media
        'video/mp4', 'video/avi', 'video/mov', 'video/wmv',
        'audio/mpeg', 'audio/wav', 'audio/mp3', 'audio/ogg'
      ],
      maxFileSize: env.MAX_FILE_SIZE,
      allowedExtensions: [
        '.jpg', '.jpeg', '.png', '.gif', '.webp',
        '.pdf', '.doc', '.docx', '.xls', '.xlsx', '.txt', '.csv',
        '.zip', '.rar', '.7z',
        '.mp4', '.avi', '.mov', '.wmv',
        '.mp3', '.wav', '.ogg'
      ]
    };
  }

  protected getServiceName(): string {
    return 'FileUploadService';
  }

  /**
   * Upload a single file
   */
  async uploadFile(file: UploadedFile, ownerId: string, options?: Partial<FileUploadOptions>): Promise<any> {
    // Validate file
    this.validateFile(file);

    // Set default options
    const uploadOptions: FileUploadOptions = {
      category: 'documents',
      ...options
    };

    // Generate file key
    const key = this.generateFileKey(file, uploadOptions);

    // Upload to storage
    return this.uploadToLocal(file, key, ownerId, uploadOptions.category);
  }

  /**
   * Upload multiple files
   */
  async uploadMultipleFiles(
    files: UploadedFile[], 
    ownerId: string, 
    options?: Partial<FileUploadOptions>
  ): Promise<any[]> {
    const uploadedFiles = [];

    for (const file of files) {
      try {
        const uploadedFile = await this.uploadFile(file, ownerId, options);
        uploadedFiles.push(uploadedFile);
      } catch (error) {
        // Log error but continue with other files
        console.error(`Failed to upload file ${file.originalname}:`, error);
        throw error; // Re-throw to stop the process
      }
    }

    return uploadedFiles;
  }

  /**
   * Get file by ID
   */
  override async getFileById(fileId: string, userId: string): Promise<any> {
    return super.getFileById(fileId, userId);
  }

  /**
   * Get file with stream for download
   */
  override async getFileWithStream(fileId: string, userId: string): Promise<{ fileObject: any; stream: any }> {
    return super.getFileWithStream(fileId, userId);
  }

  /**
   * Delete file
   */
  override async deleteFile(fileId: string, userId: string): Promise<void> {
    return super.deleteFile(fileId, userId);
  }

  /**
   * Get user files with pagination
   */
  override async getUserFiles(
    userId: string, 
    page = 1, 
    limit = 10, 
    category?: string
  ): Promise<{ files: any[]; total: number; page: number; totalPages: number }> {
    return super.getUserFiles(userId, page, limit, category);
  }

  /**
   * Get file statistics
   */
  override async getFileStats(userId: string, category?: string): Promise<{
    totalFiles: number;
    totalSize: number;
    averageSize: number;
  }> {
    return super.getFileStats(userId, category);
  }

  /**
   * Check if file exists
   */
  override async fileExists(fileId: string, userId: string): Promise<boolean> {
    return super.fileExists(fileId, userId);
  }
}
