# File Service Architecture

This document describes the refactored file handling system with a modular, generic architecture.

## Overview

The file handling system has been refactored to follow the **Template Method Pattern** and **Strategy Pattern** principles, providing:

- **Generic base implementation** for common file operations
- **Specialized services** for specific use cases
- **Code reusability** and **maintainability**
- **Consistent validation** and **error handling**
- **Unified logging** and **monitoring**

## Architecture Diagram

```
BaseFileService (Abstract)
├── FileUploadService (General file uploads)
├── FileExportService (Data export functionality)
└── ProfileImageService (Profile image handling)
```

## Service Hierarchy

### 1. BaseFileService (Abstract Base Class)

**Location**: `src/services/baseFile.service.ts`

**Purpose**: Provides common file operations and validation logic.

**Key Features**:
- File validation (MIME type, size, extensions)
- File storage operations (upload, download, delete)
- Database operations (CRUD for FileObject)
- User permission validation
- Structured logging
- File statistics and metadata

**Abstract Methods**:
- `getValidationRules()`: Define service-specific validation rules
- `getServiceName()`: Return service name for logging

**Protected Methods**:
- `validateFile()`: Validate uploaded files
- `generateFileKey()`: Generate unique file keys
- `uploadToLocal()`: Upload files to local storage
- `getFileById()`: Retrieve file metadata
- `getFileWithStream()`: Get file with download stream
- `deleteFile()`: Delete files from storage and database
- `getUserFiles()`: Get paginated user files
- `fileExists()`: Check file existence and access
- `getFileStats()`: Get file statistics

### 2. FileUploadService (General File Uploads)

**Location**: `src/services/fileUpload.service.ts`

**Purpose**: Handles general file uploads with broad format support.

**Supported Formats**:
- **Images**: JPEG, PNG, GIF, WebP
- **Documents**: PDF, DOC, DOCX, XLS, XLSX, TXT, CSV
- **Archives**: ZIP, RAR, 7Z
- **Media**: MP4, AVI, MOV, WMV, MP3, WAV, OGG

**Key Methods**:
- `uploadFile()`: Upload single file
- `uploadMultipleFiles()`: Upload multiple files
- `getUserFiles()`: Get user's uploaded files
- `getFileStats()`: Get upload statistics

**Configuration**:
- **Max File Size**: Configurable via `env.MAX_FILE_SIZE`
- **Categories**: `documents`, `media`, `archives`
- **Validation**: MIME type and extension validation

### 3. FileExportService (Data Export)

**Location**: `src/services/fileExport.service.ts`

**Purpose**: Handles data export to various formats.

**Supported Export Formats**:
- **CSV**: Comma-separated values
- **JSON**: JavaScript Object Notation
- **XML**: Extensible Markup Language

**Key Methods**:
- `exportToCSV()`: Export data to CSV format
- `exportToJSON()`: Export data to JSON format
- `exportToXML()`: Export data to XML format
- `getExportFiles()`: Get user's export files
- `getExportStats()`: Get export statistics
- `cleanupOldExports()`: Clean up old export files

**Configuration**:
- **Max File Size**: 50MB for export files
- **Categories**: `exports/csv`, `exports/json`, `exports/xml`
- **Auto-cleanup**: Configurable retention period

### 4. ProfileImageService (Profile Images)

**Location**: `src/services/profileImage.service.ts`

**Purpose**: Specialized service for user profile image management.

**Supported Formats**:
- JPEG, PNG, GIF, WebP

**Key Methods**:
- `uploadProfileImage()`: Upload and update user profile image
- `deleteProfileImage()`: Delete user's profile image
- `getProfileImage()`: Get user's profile image info

**Special Features**:
- **Automatic cleanup**: Old profile images are deleted when uploading new ones
- **User association**: Links profile images to user accounts
- **Size optimization**: 2MB maximum for profile images

## File Storage Structure

```
uploads/
├── profile-images/
│   ├── 1693456789123-abc123def456.jpg
│   └── 1693456789456-def789ghi012.png
├── documents/
│   ├── reports/
│   ├── contracts/
│   └── presentations/
├── exports/
│   ├── csv/
│   ├── json/
│   └── xml/
└── media/
    ├── videos/
    ├── audio/
    └── images/
```

## Database Schema

### FileObject Model

```typescript
interface IFileObject {
  key: string;              // File path/key
  originalName: string;     // Original filename
  mimeType: string;         // MIME type
  size: number;             // File size in bytes
  owner: ObjectId;          // User who owns the file
  category: string;         // File category (profile-image, document, export, etc.)
  createdAt: Date;          // Creation timestamp
}
```

### User Model Updates

```typescript
interface IUser {
  // ... existing fields
  profileImage?: ObjectId;  // Reference to profile image FileObject
}
```

## Usage Examples

### 1. General File Upload

```typescript
import { FileUploadService } from './services/fileUpload.service';

const fileUploadService = new FileUploadService();

// Upload a document
const result = await fileUploadService.uploadFile(file, userId, {
  category: 'documents',
  subdirectory: 'reports'
});

// Upload multiple files
const results = await fileUploadService.uploadMultipleFiles(files, userId, {
  category: 'media',
  subdirectory: 'videos'
});
```

### 2. Data Export

```typescript
import { FileExportService } from './services/fileExport.service';

const fileExportService = new FileExportService();

// Export to CSV
const csvFile = await fileExportService.exportToCSV(data, userId, {
  customFileName: 'user-report',
  headers: ['id', 'name', 'email']
});

// Export to JSON
const jsonFile = await fileExportService.exportToJSON(data, userId, {
  customFileName: 'data-export'
});

// Get export statistics
const stats = await fileExportService.getExportStats(userId);
```

### 3. Profile Image Management

```typescript
import { ProfileImageService } from './services/profileImage.service';

const profileImageService = new ProfileImageService();

// Upload profile image
const result = await profileImageService.uploadProfileImage(file, userId);

// Delete profile image
const result = await profileImageService.deleteProfileImage(userId);

// Get profile image info
const info = await profileImageService.getProfileImage(userId);
```

## Validation Rules

### FileUploadService
- **Max Size**: Configurable (default: 10MB)
- **Formats**: Images, documents, archives, media
- **Extensions**: `.jpg`, `.png`, `.pdf`, `.doc`, `.zip`, etc.

### FileExportService
- **Max Size**: 50MB
- **Formats**: CSV, JSON, XML
- **Extensions**: `.csv`, `.json`, `.xml`

### ProfileImageService
- **Max Size**: 2MB
- **Formats**: Images only
- **Extensions**: `.jpg`, `.jpeg`, `.png`, `.gif`, `.webp`

## Error Handling

All services inherit consistent error handling from `BaseFileService`:

```typescript
// Validation errors
throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid file type');

// Permission errors
throw new ApiError(httpStatus.FORBIDDEN, 'Access denied');

// Not found errors
throw new ApiError(httpStatus.NOT_FOUND, 'File not found');
```

## Logging

Structured logging is implemented across all services:

```typescript
logger.info({
  service: 'ProfileImageService',
  action: 'profile_image_upload',
  userId,
  fileId: fileObject.id,
  fileSize: file.size,
  mimeType: file.mimetype
}, 'Profile image uploaded successfully');
```

## Security Features

1. **File Validation**: MIME type and extension validation
2. **Size Limits**: Configurable file size restrictions
3. **Access Control**: User ownership validation
4. **Secure Naming**: Timestamp + random string file names
5. **Directory Traversal Prevention**: Safe file path handling

## Performance Considerations

1. **Streaming**: File downloads use streams for memory efficiency
2. **Pagination**: File listings support pagination
3. **Indexing**: Database indexes on frequently queried fields
4. **Caching**: Consider implementing CDN for frequently accessed files

## Migration Guide

### From Old Implementation

1. **Update Imports**:
   ```typescript
   // Old
   import { FileService } from './services/file.service';
   
   // New
   import { FileUploadService } from './services/fileUpload.service';
   ```

2. **Update Service Usage**:
   ```typescript
   // Old
   const result = await FileService.uploadFile(file, userId);
   
   // New
   const fileUploadService = new FileUploadService();
   const result = await fileUploadService.uploadFile(file, userId);
   ```

3. **Update Controllers**:
   ```typescript
   // Old
   const result = await ProfileImageService.uploadProfileImage(file, userId);
   
   // New
   const profileImageService = new ProfileImageService();
   const result = await profileImageService.uploadProfileImage(file, userId);
   ```

## Best Practices

1. **Service Selection**: Choose the appropriate service for your use case
2. **Validation**: Always validate files before processing
3. **Error Handling**: Implement proper error handling in controllers
4. **Logging**: Use structured logging for debugging and monitoring
5. **Cleanup**: Implement regular cleanup for temporary files
6. **Security**: Validate user permissions before file operations

## Future Enhancements

1. **Cloud Storage**: Add support for AWS S3, Google Cloud Storage
2. **Image Processing**: Add image resizing and optimization
3. **Virus Scanning**: Implement file virus scanning
4. **Compression**: Add file compression for storage optimization
5. **CDN Integration**: Add CDN support for better performance
