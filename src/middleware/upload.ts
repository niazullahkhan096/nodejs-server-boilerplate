import multer from 'multer';
import { Request } from 'express';

// Storage configuration
const storage = multer.memoryStorage();

// File filter function type
type FileFilterFunction = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => void;

// Create file filter for specific file types
const createFileFilter = (allowedMimeTypes: string[], allowedExtensions: string[]): FileFilterFunction => {
  return (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    // Check MIME type
    if (allowedMimeTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error(`Invalid file type. Allowed types: ${allowedExtensions.join(', ')}`));
    }
  };
};

// Profile image configuration
const profileImageConfig = {
  storage,
  limits: {
    fileSize: 2 * 1024 * 1024, // 2MB
  },
  fileFilter: createFileFilter(
    ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'],
    ['.jpg', '.jpeg', '.png', '.gif', '.webp']
  ),
};

// Document upload configuration
const documentConfig = {
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB
  },
  fileFilter: createFileFilter(
    [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'text/plain',
      'text/csv',
    ],
    ['.pdf', '.doc', '.docx', '.xls', '.xlsx', '.txt', '.csv']
  ),
};

// Media upload configuration
const mediaConfig = {
  storage,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB
  },
  fileFilter: createFileFilter(
    [
      'image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp',
      'video/mp4', 'video/avi', 'video/mov', 'video/wmv',
      'audio/mpeg', 'audio/wav', 'audio/ogg',
    ],
    ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.mp4', '.avi', '.mov', '.wmv', '.mp3', '.wav', '.ogg']
  ),
};

// Generic file upload configuration
const genericConfig = {
  storage,
  limits: {
    fileSize: 25 * 1024 * 1024, // 25MB
  },
  fileFilter: (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    // Allow all file types for generic upload
    cb(null, true);
  },
};

// Create multer instances
export const profileImageUpload = multer(profileImageConfig);
export const documentUpload = multer(documentConfig);
export const mediaUpload = multer(mediaConfig);
export const genericUpload = multer(genericConfig);

// Single file upload middlewares
export const uploadProfileImage = profileImageUpload.single('profileImage');
export const uploadDocument = documentUpload.single('document');
export const uploadMedia = mediaUpload.single('media');
export const uploadFile = genericUpload.single('file');

// Multiple files upload middlewares
export const uploadMultipleDocuments = documentUpload.array('documents', 10); // Max 10 files
export const uploadMultipleMedia = mediaUpload.array('media', 5); // Max 5 files
export const uploadMultipleFiles = genericUpload.array('files', 20); // Max 20 files

// Custom upload middleware factory
export const createUploadMiddleware = (
  config: {
    fieldName: string;
    maxFileSize?: number;
    allowedMimeTypes?: string[];
    allowedExtensions?: string[];
    maxFiles?: number;
  }
) => {
  const uploadConfig = {
    storage,
    limits: {
      fileSize: config.maxFileSize || 10 * 1024 * 1024, // Default 10MB
    },
    fileFilter: config.allowedMimeTypes && config.allowedExtensions
      ? createFileFilter(config.allowedMimeTypes, config.allowedExtensions)
      : (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => cb(null, true),
  };

  const multerInstance = multer(uploadConfig);
  
  return config.maxFiles && config.maxFiles > 1
    ? multerInstance.array(config.fieldName, config.maxFiles)
    : multerInstance.single(config.fieldName);
};

// Export configuration objects for reference
export const uploadConfigs = {
  profileImage: profileImageConfig,
  document: documentConfig,
  media: mediaConfig,
  generic: genericConfig,
};

// Export file filter creator for custom use cases
export { createFileFilter };
