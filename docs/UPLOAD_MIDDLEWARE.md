# Upload Middleware Documentation

This document describes the reusable upload middleware system that provides standardized file upload functionality across the application.

## Overview

The upload middleware (`src/middleware/upload.ts`) provides a centralized, reusable solution for handling file uploads with different configurations for various use cases. It eliminates code duplication and ensures consistent file handling across the application.

## Features

- **Multiple Upload Configurations**: Pre-configured for different file types
- **Customizable**: Factory function for creating custom upload configurations
- **Type Safety**: Full TypeScript support with proper type definitions
- **Error Handling**: Consistent error messages and validation
- **Memory Storage**: Uses memory storage for processing before saving to disk
- **File Size Limits**: Configurable file size limits per upload type
- **MIME Type Validation**: Strict file type validation

## Pre-configured Upload Types

### 1. Profile Image Upload
```typescript
import { uploadProfileImage } from '../middleware/upload';

// Usage in routes
router.post('/profile-image/upload', uploadProfileImage, controller.uploadProfileImage);
```

**Configuration:**
- **File Size**: 2MB maximum
- **Allowed Types**: JPEG, JPG, PNG, GIF, WebP
- **Field Name**: `profileImage`
- **Files**: Single file only

### 2. Document Upload
```typescript
import { uploadDocument, uploadMultipleDocuments } from '../middleware/upload';

// Single document
router.post('/document/upload', uploadDocument, controller.uploadDocument);

// Multiple documents (max 10)
router.post('/documents/upload', uploadMultipleDocuments, controller.uploadDocuments);
```

**Configuration:**
- **File Size**: 10MB maximum
- **Allowed Types**: PDF, DOC, DOCX, XLS, XLSX, TXT, CSV
- **Field Name**: `document` (single) / `documents` (multiple)
- **Files**: Single or multiple (max 10)

### 3. Media Upload
```typescript
import { uploadMedia, uploadMultipleMedia } from '../middleware/upload';

// Single media file
router.post('/media/upload', uploadMedia, controller.uploadMedia);

// Multiple media files (max 5)
router.post('/media/batch-upload', uploadMultipleMedia, controller.uploadMultipleMedia);
```

**Configuration:**
- **File Size**: 50MB maximum
- **Allowed Types**: Images (JPEG, PNG, GIF, WebP), Videos (MP4, AVI, MOV, WMV), Audio (MP3, WAV, OGG)
- **Field Name**: `media` (single) / `media` (multiple)
- **Files**: Single or multiple (max 5)

### 4. Generic File Upload
```typescript
import { uploadFile, uploadMultipleFiles } from '../middleware/upload';

// Single file (any type)
router.post('/file/upload', uploadFile, controller.uploadFile);

// Multiple files (max 20)
router.post('/files/upload', uploadMultipleFiles, controller.uploadFiles);
```

**Configuration:**
- **File Size**: 25MB maximum
- **Allowed Types**: All file types
- **Field Name**: `file` (single) / `files` (multiple)
- **Files**: Single or multiple (max 20)

## Custom Upload Configuration

### Using the Factory Function

```typescript
import { createUploadMiddleware } from '../middleware/upload';

// Custom configuration for Excel files only
const uploadExcel = createUploadMiddleware({
  fieldName: 'excelFile',
  maxFileSize: 5 * 1024 * 1024, // 5MB
  allowedMimeTypes: [
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  ],
  allowedExtensions: ['.xls', '.xlsx'],
  maxFiles: 1
});

// Usage
router.post('/excel/upload', uploadExcel, controller.uploadExcel);
```

### Multiple Files with Custom Configuration

```typescript
import { createUploadMiddleware } from '../middleware/upload';

// Custom configuration for multiple image uploads
const uploadMultipleImages = createUploadMiddleware({
  fieldName: 'images',
  maxFileSize: 5 * 1024 * 1024, // 5MB per file
  allowedMimeTypes: ['image/jpeg', 'image/png', 'image/gif'],
  allowedExtensions: ['.jpg', '.jpeg', '.png', '.gif'],
  maxFiles: 5 // Allow up to 5 files
});

// Usage
router.post('/images/upload', uploadMultipleImages, controller.uploadImages);
```

## Configuration Objects

### Profile Image Configuration
```typescript
const profileImageConfig = {
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 2 * 1024 * 1024, // 2MB
  },
  fileFilter: (req, file, cb) => {
    const allowedMimeTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (allowedMimeTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Allowed types: .jpg, .jpeg, .png, .gif, .webp'));
    }
  },
};
```

### Document Configuration
```typescript
const documentConfig = {
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB
  },
  fileFilter: (req, file, cb) => {
    const allowedMimeTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'text/plain',
      'text/csv',
    ];
    if (allowedMimeTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Allowed types: .pdf, .doc, .docx, .xls, .xlsx, .txt, .csv'));
    }
  },
};
```

## Usage Examples

### Basic Route Implementation

```typescript
import { Router } from 'express';
import { uploadProfileImage, uploadDocument } from '../middleware/upload';
import { UserController } from '../controllers/user.controller';
import { authenticate, authorize } from '../middleware/auth';

const router = Router();

// Profile image upload
router.post('/profile-image/upload', 
  authenticate, 
  authorize(['profile.image.upload']), 
  uploadProfileImage, 
  UserController.uploadProfileImage
);

// Document upload
router.post('/document/upload', 
  authenticate, 
  authorize(['document.upload']), 
  uploadDocument, 
  DocumentController.uploadDocument
);

export default router;
```

### Controller Implementation

```typescript
import { Request, Response, NextFunction } from 'express';

export class UserController {
  static async uploadProfileImage(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: 'No file uploaded'
        });
      }

      // Process the uploaded file
      const file = req.file;
      console.log('File uploaded:', {
        originalName: file.originalname,
        mimetype: file.mimetype,
        size: file.size
      });

      // Your file processing logic here
      const result = await UserService.uploadProfileImage(file, req.user.id);
      
      res.status(201).json({
        success: true,
        message: 'Profile image uploaded successfully',
        data: result
      });
    } catch (error) {
      next(error);
    }
  }
}
```

### Multiple Files Handling

```typescript
import { uploadMultipleDocuments } from '../middleware/upload';

router.post('/documents/batch-upload', 
  authenticate, 
  authorize(['document.upload']), 
  uploadMultipleDocuments, 
  DocumentController.uploadMultipleDocuments
);

// In controller
static async uploadMultipleDocuments(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No files uploaded'
      });
    }

    const files = req.files as Express.Multer.File[];
    console.log(`Uploaded ${files.length} files`);

    // Process multiple files
    const results = await Promise.all(
      files.map(file => DocumentService.uploadDocument(file, req.user.id))
    );

    res.status(201).json({
      success: true,
      message: `${files.length} documents uploaded successfully`,
      data: results
    });
  } catch (error) {
    next(error);
  }
}
```

## Error Handling

### File Size Exceeded
```json
{
  "success": false,
  "message": "File too large",
  "error": "LIMIT_FILE_SIZE"
}
```

### Invalid File Type
```json
{
  "success": false,
  "message": "Invalid file type. Allowed types: .jpg, .jpeg, .png, .gif, .webp",
  "error": "INVALID_FILE_TYPE"
}
```

### Too Many Files
```json
{
  "success": false,
  "message": "Too many files",
  "error": "LIMIT_FILE_COUNT"
}
```

### No File Uploaded
```json
{
  "success": false,
  "message": "No file uploaded",
  "error": "NO_FILE"
}
```

## Best Practices

### 1. Always Check for Files
```typescript
if (!req.file) {
  return res.status(400).json({
    success: false,
    message: 'No file uploaded'
  });
}
```

### 2. Handle Multiple Files Properly
```typescript
if (!req.files || req.files.length === 0) {
  return res.status(400).json({
    success: false,
    message: 'No files uploaded'
  });
}

const files = req.files as Express.Multer.File[];
```

### 3. Use Appropriate Upload Types
- Use `uploadProfileImage` for user profile images
- Use `uploadDocument` for business documents
- Use `uploadMedia` for media files
- Use `uploadFile` for generic file uploads

### 4. Implement Proper Error Handling
```typescript
try {
  // File processing logic
} catch (error) {
  next(error); // Pass to error handling middleware
}
```

### 5. Validate File Content
```typescript
// Additional validation beyond MIME type
if (file.size === 0) {
  return res.status(400).json({
    success: false,
    message: 'File is empty'
  });
}
```

## Migration Guide

### From Inline Multer Configuration

**Before:**
```typescript
import multer from 'multer';

const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 2 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type'));
    }
  },
});

router.post('/upload', upload.single('file'), controller.upload);
```

**After:**
```typescript
import { uploadProfileImage } from '../middleware/upload';

router.post('/upload', uploadProfileImage, controller.upload);
```

### From Custom Upload Configurations

**Before:**
```typescript
const customUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    // Custom validation logic
  },
});
```

**After:**
```typescript
import { createUploadMiddleware } from '../middleware/upload';

const customUpload = createUploadMiddleware({
  fieldName: 'customFile',
  maxFileSize: 5 * 1024 * 1024,
  allowedMimeTypes: ['application/pdf'],
  allowedExtensions: ['.pdf'],
  maxFiles: 1
});
```

## Configuration Reference

### Upload Configuration Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `fieldName` | string | - | Name of the form field containing the file |
| `maxFileSize` | number | 10MB | Maximum file size in bytes |
| `allowedMimeTypes` | string[] | - | Array of allowed MIME types |
| `allowedExtensions` | string[] | - | Array of allowed file extensions |
| `maxFiles` | number | 1 | Maximum number of files (for array uploads) |

### Pre-configured Upload Types

| Type | File Size | Allowed Types | Field Name | Max Files |
|------|-----------|---------------|------------|-----------|
| Profile Image | 2MB | Images (JPEG, PNG, GIF, WebP) | `profileImage` | 1 |
| Document | 10MB | Documents (PDF, DOC, XLS, etc.) | `document` / `documents` | 1 / 10 |
| Media | 50MB | Images, Videos, Audio | `media` | 1 / 5 |
| Generic | 25MB | All types | `file` / `files` | 1 / 20 |

## Troubleshooting

### Common Issues

1. **File Not Uploading**
   - Check if the field name matches the upload configuration
   - Verify the request uses `multipart/form-data`
   - Ensure file size is within limits

2. **Invalid File Type Error**
   - Check the MIME type of the uploaded file
   - Verify the file extension matches allowed types
   - Use browser dev tools to inspect the actual MIME type

3. **File Size Exceeded**
   - Check the file size limit in the configuration
   - Consider compressing files before upload
   - Update the configuration if needed

4. **Multiple Files Not Working**
   - Ensure using the correct middleware (array vs single)
   - Check the `maxFiles` configuration
   - Verify the field name matches the configuration

### Debug Commands

```bash
# Check file upload in browser dev tools
# Look at the Network tab for the request payload

# Test with curl
curl -X POST http://localhost:4000/api/v1/users/profile-image/upload \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "profileImage=@/path/to/image.jpg"

# Check server logs for upload errors
npm run logs:view
```

## Support

For issues and questions:
- Check the application logs: `npm run logs:view`
- Verify file upload configuration
- Test with different file types and sizes
- Review error responses for specific error codes
