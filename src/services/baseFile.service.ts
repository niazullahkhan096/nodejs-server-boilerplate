import fs from 'fs';
import path from 'path';
import { generateRandomString } from '../utils/crypto';
import { env } from '../config';
import FileObject from '../models/FileObject';
import { ApiError } from '../middleware/error';
import { httpStatus } from '../utils/httpStatus';
import logger from '../utils/logger';

export interface UploadedFile {
  originalname: string;
  mimetype: string;
  size: number;
  buffer: Buffer;
}

export interface FileValidationRules {
  allowedMimeTypes: string[];
  maxFileSize: number;
  allowedExtensions?: string[];
}

export interface FileUploadOptions {
  category: string;
  subdirectory?: string;
  customFileName?: string;
  preserveOriginalName?: boolean;
}

export abstract class BaseFileService {
  protected abstract getValidationRules(): FileValidationRules;
  protected abstract getServiceName(): string;

  /**
   * Validate file according to service-specific rules
   */
  protected validateFile(file: UploadedFile): void {
    const rules = this.getValidationRules();
    
    // Check MIME type
    if (!rules.allowedMimeTypes.includes(file.mimetype)) {
      throw new ApiError(
        httpStatus.BAD_REQUEST, 
        `Invalid file type. Allowed types: ${rules.allowedMimeTypes.join(', ')}`
      );
    }

    // Check file size
    if (file.size > rules.maxFileSize) {
      const maxSizeMB = Math.round(rules.maxFileSize / (1024 * 1024));
      throw new ApiError(
        httpStatus.BAD_REQUEST, 
        `File size too large. Maximum size is ${maxSizeMB}MB`
      );
    }

    // Check file extension if specified
    if (rules.allowedExtensions) {
      const extension = path.extname(file.originalname).toLowerCase();
      if (!rules.allowedExtensions.includes(extension)) {
        throw new ApiError(
          httpStatus.BAD_REQUEST,
          `Invalid file extension. Allowed extensions: ${rules.allowedExtensions.join(', ')}`
        );
      }
    }
  }

  /**
   * Generate unique file key
   */
  protected generateFileKey(file: UploadedFile, options: FileUploadOptions): string {
    const extension = path.extname(file.originalname);
    const timestamp = Date.now();
    const randomString = generateRandomString(16);
    
    if (options.customFileName) {
      return `${options.category}/${options.customFileName}${extension}`;
    }
    
    if (options.preserveOriginalName) {
      const baseName = path.basename(file.originalname, extension);
      return `${options.category}/${timestamp}-${baseName}-${randomString}${extension}`;
    }
    
    const subdir = options.subdirectory ? `${options.subdirectory}/` : '';
    return `${options.category}/${subdir}${timestamp}-${randomString}${extension}`;
  }

  /**
   * Upload file to local storage
   */
  protected async uploadToLocal(
    file: UploadedFile, 
    key: string, 
    ownerId: string, 
    category: string
  ): Promise<any> {
    const filePath = path.join(env.UPLOAD_DIR, key);
    
    // Ensure directory exists
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    // Write file to disk
    fs.writeFileSync(filePath, file.buffer);

    // Save file metadata to database
    const fileObject = await FileObject.create({
      key,
      originalName: file.originalname,
      mimeType: file.mimetype,
      size: file.size,
      owner: ownerId,
      category,
    });

    logger.info({
      service: this.getServiceName(),
      action: 'file_uploaded',
      fileId: fileObject.id,
      key,
      size: file.size,
      category
    }, 'File uploaded successfully');

    return fileObject.toJSON();
  }

  /**
   * Get file by ID with ownership validation
   */
  protected async getFileById(fileId: string, userId: string): Promise<any> {
    const fileObject = await FileObject.findById(fileId).populate('owner', 'id name');
    
    if (!fileObject) {
      throw new ApiError(httpStatus.NOT_FOUND, 'File not found');
    }

    // Check if user has permission to access the file
    if (fileObject.owner.toString() !== userId) {
      throw new ApiError(httpStatus.FORBIDDEN, 'Access denied');
    }

    return fileObject.toJSON();
  }

  /**
   * Get file with stream for download
   */
  protected async getFileWithStream(fileId: string, userId: string): Promise<{ fileObject: any; stream: any }> {
    const fileObject = await FileObject.findById(fileId).populate('owner', 'id name');
    
    if (!fileObject) {
      throw new ApiError(httpStatus.NOT_FOUND, 'File not found');
    }

    // Check if user has permission to access the file
    if (fileObject.owner.toString() !== userId) {
      throw new ApiError(httpStatus.FORBIDDEN, 'Access denied');
    }

    const filePath = path.join(env.UPLOAD_DIR, fileObject.key);
    
    if (!fs.existsSync(filePath)) {
      throw new ApiError(httpStatus.NOT_FOUND, 'File not found on disk');
    }

    const stream = fs.createReadStream(filePath);

    return { fileObject: fileObject.toJSON(), stream };
  }

  /**
   * Delete file from storage and database
   */
  protected async deleteFile(fileId: string, userId: string): Promise<void> {
    const fileObject = await FileObject.findById(fileId);
    
    if (!fileObject) {
      throw new ApiError(httpStatus.NOT_FOUND, 'File not found');
    }

    // Check if user has permission to delete the file
    if (fileObject.owner.toString() !== userId) {
      throw new ApiError(httpStatus.FORBIDDEN, 'Access denied');
    }

    // Delete from storage
    const filePath = path.join(env.UPLOAD_DIR, fileObject.key);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    // Delete from database
    await FileObject.findByIdAndDelete(fileId);

    logger.info({
      service: this.getServiceName(),
      action: 'file_deleted',
      fileId,
      key: fileObject.key
    }, 'File deleted successfully');
  }

  /**
   * Get user files with pagination
   */
  protected async getUserFiles(
    userId: string, 
    page = 1, 
    limit = 10, 
    category?: string
  ): Promise<{ files: any[]; total: number; page: number; totalPages: number }> {
    const skip = (page - 1) * limit;
    
    const query: any = { owner: userId };
    if (category) {
      query.category = category;
    }

    const [files, total] = await Promise.all([
      FileObject.find(query)
        .populate('owner', 'id name')
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 }),
      FileObject.countDocuments(query),
    ]);

    return {
      files: files.map(file => file.toJSON()),
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }

  /**
   * Check if file exists and is accessible
   */
  protected async fileExists(fileId: string, userId: string): Promise<boolean> {
    try {
      const fileObject = await FileObject.findById(fileId);
      return !!(fileObject && fileObject.owner.toString() === userId);
    } catch {
      return false;
    }
  }

  /**
   * Get file statistics
   */
  protected async getFileStats(userId: string, category?: string): Promise<{
    totalFiles: number;
    totalSize: number;
    averageSize: number;
  }> {
    const query: any = { owner: userId };
    if (category) {
      query.category = category;
    }

    const stats = await FileObject.aggregate([
      { $match: query },
      {
        $group: {
          _id: null,
          totalFiles: { $sum: 1 },
          totalSize: { $sum: '$size' },
          averageSize: { $avg: '$size' }
        }
      }
    ]);

    return stats[0] || { totalFiles: 0, totalSize: 0, averageSize: 0 };
  }
}
