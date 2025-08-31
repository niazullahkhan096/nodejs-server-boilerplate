import fs from 'fs';
import path from 'path';
import { generateRandomString } from '../utils/crypto';
import { env } from '../config';
import FileObject from '../models/FileObject';
import { ApiError } from '../middleware/error';
import { httpStatus } from '../utils/httpStatus';

interface UploadedFile {
  originalname: string;
  mimetype: string;
  size: number;
  buffer: Buffer;
}

export class FileService {
  static async uploadFile(file: UploadedFile, ownerId: string): Promise<any> {
    const key = `${Date.now()}-${generateRandomString(16)}-${file.originalname}`;
    return this.uploadToLocal(file, key, ownerId);
  }

  private static async uploadToLocal(file: UploadedFile, key: string, ownerId: string): Promise<any> {
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
    });

    return fileObject.toJSON();
  }

  static async getFile(fileId: string, userId: string): Promise<{ fileObject: any; stream: any }> {
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

  static async deleteFile(fileId: string, userId: string): Promise<void> {
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
  }

  static async getUserFiles(userId: string, page = 1, limit = 10): Promise<{ files: any[]; total: number; page: number; totalPages: number }> {
    const skip = (page - 1) * limit;

    const [files, total] = await Promise.all([
      FileObject.find({ owner: userId })
        .populate('owner', 'id name')
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 }),
      FileObject.countDocuments({ owner: userId }),
    ]);

    return {
      files: files.map(file => file.toJSON()),
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }

  static async getFileById(fileId: string, userId: string): Promise<any> {
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
}
