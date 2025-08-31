# Profile Image Upload API Documentation

This document describes the profile image upload functionality integrated into the user management system.

## Overview

The profile image upload system is now part of the user module, providing:
- **User-integrated functionality** - Profile images are managed as part of user operations
- **Secure image upload** with validation
- **Automatic old image cleanup** when uploading new images
- **Multiple image format support** (JPEG, PNG, GIF, WebP)
- **File size limits** (2MB maximum)
- **RBAC integration** with proper permissions
- **Structured logging** for all operations
- **Database integration** with FileObject model

## API Endpoints

### Base URL
```
/api/v1/users
```

### Endpoints

| Method | Endpoint | Description | Authentication | Permissions |
|--------|----------|-------------|----------------|-------------|
| POST | `/profile-image/upload` | Upload profile image | Required | `profile.image.upload` |
| DELETE | `/profile-image/delete` | Delete profile image | Required | `profile.image.delete` |
| GET | `/profile-image/me` | Get current user's profile image | Required | `profile.image.read` |
| GET | `/:userId/profile-image` | Get profile image by user ID | Required | `profile.image.read` |

## Authentication

All endpoints require authentication via JWT token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

## Request/Response Examples

### 1. Upload Profile Image

**Request:**
```http
POST /api/v1/users/profile-image/upload
Content-Type: multipart/form-data
Authorization: Bearer <jwt-token>

Form Data:
- profileImage: [image file]
```

**Response (Success - 201):**
```json
{
  "success": true,
  "message": "Profile image uploaded successfully",
  "data": {
    "user": {
      "id": "64f8a1b2c3d4e5f6a7b8c9d0",
      "email": "user@example.com",
      "name": "John Doe",
      "roles": [
        {
          "id": "64f8a1b2c3d4e5f6a7b8c9d1",
          "name": "user",
          "permissions": [...]
        }
      ],
      "profileImage": {
        "id": "64f8a1b2c3d4e5f6a7b8c9d2",
        "key": "profile-images/1693456789123-abc123def456.jpg",
        "originalName": "profile.jpg",
        "mimeType": "image/jpeg",
        "size": 1024000,
        "category": "profile-image",
        "createdAt": "2023-08-31T12:34:56.789Z"
      },
      "isActive": true,
      "createdAt": "2023-08-31T10:00:00.000Z",
      "updatedAt": "2023-08-31T12:34:56.789Z"
    },
    "profileImage": {
      "id": "64f8a1b2c3d4e5f6a7b8c9d2",
      "key": "profile-images/1693456789123-abc123def456.jpg",
      "originalName": "profile.jpg",
      "mimeType": "image/jpeg",
      "size": 1024000,
      "category": "profile-image",
      "createdAt": "2023-08-31T12:34:56.789Z"
    }
  }
}
```

**Response (Error - 400):**
```json
{
  "success": false,
  "message": "Invalid file type. Only JPEG, PNG, GIF, and WebP images are allowed.",
  "error": "BAD_REQUEST",
  "statusCode": 400
}
```

### 2. Delete Profile Image

**Request:**
```http
DELETE /api/v1/users/profile-image/delete
Authorization: Bearer <jwt-token>
```

**Response (Success - 200):**
```json
{
  "success": true,
  "message": "Profile image deleted successfully",
  "data": {
    "user": {
      "id": "64f8a1b2c3d4e5f6a7b8c9d0",
      "email": "user@example.com",
      "name": "John Doe",
      "roles": [...],
      "isActive": true,
      "createdAt": "2023-08-31T10:00:00.000Z",
      "updatedAt": "2023-08-31T12:35:00.000Z"
    },
    "message": "Profile image deleted successfully"
  }
}
```

**Response (Error - 400):**
```json
{
  "success": false,
  "message": "No profile image to delete",
  "error": "BAD_REQUEST",
  "statusCode": 400
}
```

### 3. Get Current User's Profile Image

**Request:**
```http
GET /api/v1/users/profile-image/me
Authorization: Bearer <jwt-token>
```

**Response (Success - 200):**
```json
{
  "success": true,
  "message": "Profile image retrieved successfully",
  "data": {
    "user": {
      "id": "64f8a1b2c3d4e5f6a7b8c9d0",
      "email": "user@example.com",
      "name": "John Doe",
      "roles": [...],
      "profileImage": {
        "id": "64f8a1b2c3d4e5f6a7b8c9d2",
        "key": "profile-images/1693456789123-abc123def456.jpg",
        "originalName": "profile.jpg",
        "mimeType": "image/jpeg",
        "size": 1024000,
        "category": "profile-image",
        "createdAt": "2023-08-31T12:34:56.789Z"
      },
      "isActive": true,
      "createdAt": "2023-08-31T10:00:00.000Z",
      "updatedAt": "2023-08-31T12:34:56.789Z"
    },
    "hasProfileImage": true
  }
}
```

### 4. Get Profile Image by User ID

**Request:**
```http
GET /api/v1/users/64f8a1b2c3d4e5f6a7b8c9d0/profile-image
Authorization: Bearer <jwt-token>
```

**Response (Success - 200):**
```json
{
  "success": true,
  "message": "Profile image retrieved successfully",
  "data": {
    "user": {
      "id": "64f8a1b2c3d4e5f6a7b8c9d0",
      "email": "user@example.com",
      "name": "John Doe",
      "roles": [...],
      "profileImage": {
        "id": "64f8a1b2c3d4e5f6a7b8c9d2",
        "key": "profile-images/1693456789123-abc123def456.jpg",
        "originalName": "profile.jpg",
        "mimeType": "image/jpeg",
        "size": 1024000,
        "category": "profile-image",
        "createdAt": "2023-08-31T12:34:56.789Z"
      },
      "isActive": true,
      "createdAt": "2023-08-31T10:00:00.000Z",
      "updatedAt": "2023-08-31T12:34:56.789Z"
    },
    "hasProfileImage": true
  }
}
```

## File Validation

### Supported Formats
- JPEG (.jpg, .jpeg)
- PNG (.png)
- GIF (.gif)
- WebP (.webp)

### File Size Limits
- **Maximum size**: 2MB (2,048,000 bytes)
- **Recommended size**: Under 1MB for optimal performance

### Validation Rules
1. File must be an image (MIME type validation)
2. File size must not exceed 2MB
3. File must be uploaded as `profileImage` field in multipart/form-data
4. User must be authenticated
5. User must have `profile.image.upload` permission

## Error Codes

| Status Code | Error Type | Description |
|-------------|------------|-------------|
| 400 | BAD_REQUEST | Invalid file type, file too large, or no file provided |
| 401 | UNAUTHORIZED | Missing or invalid authentication token |
| 403 | FORBIDDEN | User lacks required permissions |
| 404 | NOT_FOUND | User not found |
| 500 | INTERNAL_SERVER_ERROR | Server error during processing |

## Database Schema

### User Model Updates
```typescript
interface IUser {
  // ... existing fields
  profileImage?: string; // Reference to FileObject
}
```

### FileObject Model Updates
```typescript
interface IFileObject {
  // ... existing fields
  category?: string; // 'profile-image', 'document', 'media', 'other'
}
```

## File Storage

### Directory Structure
```
uploads/
├── profile-images/
│   ├── 1693456789123-abc123def456.jpg
│   ├── 1693456789456-def789ghi012.png
│   └── ...
├── documents/
└── media/
```

### File Naming Convention
Profile images are stored with the following naming pattern:
```
profile-images/{timestamp}-{random-string}.{extension}
```

Example: `profile-images/1693456789123-abc123def456.jpg`

## Security Features

### File Validation
- MIME type validation
- File size limits
- Secure file naming
- Directory traversal prevention

### Access Control
- JWT authentication required
- RBAC permission system
- User ownership validation
- Automatic cleanup of old files

### Logging
All profile image operations are logged with:
- User ID
- Action type
- File metadata
- Success/failure status
- Error details (if applicable)

## Usage Examples

### JavaScript/Node.js
```javascript
const FormData = require('form-data');
const fs = require('fs');

async function uploadProfileImage(token, imagePath) {
  const form = new FormData();
  form.append('profileImage', fs.createReadStream(imagePath));

  const response = await fetch('http://localhost:4000/api/v1/users/profile-image/upload', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      ...form.getHeaders()
    },
    body: form
  });

  return response.json();
}
```

### cURL
```bash
# Upload profile image
curl -X POST http://localhost:4000/api/v1/users/profile-image/upload \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -F "profileImage=@/path/to/image.jpg"

# Delete profile image
curl -X DELETE http://localhost:4000/api/v1/users/profile-image/delete \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"

# Get current user's profile image
curl -X GET http://localhost:4000/api/v1/users/profile-image/me \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"

# Get profile image by user ID
curl -X GET http://localhost:4000/api/v1/users/64f8a1b2c3d4e5f6a7b8c9d0/profile-image \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Python
```python
import requests

def upload_profile_image(token, image_path):
    url = "http://localhost:4000/api/v1/users/profile-image/upload"
    headers = {"Authorization": f"Bearer {token}"}
    
    with open(image_path, 'rb') as f:
        files = {'profileImage': f}
        response = requests.post(url, headers=headers, files=files)
    
    return response.json()
```

## Integration with User Management

### User Service Integration
Profile image functionality is now integrated into the UserService:

```typescript
// Upload profile image
const result = await UserService.uploadProfileImage(file, userId);

// Delete profile image
const result = await UserService.deleteProfileImage(userId);

// Get profile image
const result = await UserService.getProfileImage(userId);
```

### User Controller Integration
Profile image endpoints are part of the UserController:

```typescript
// Upload profile image
UserController.uploadProfileImage(req, res, next);

// Delete profile image
UserController.deleteProfileImage(req, res, next);

// Get profile image
UserController.getProfileImage(req, res, next);
```

### User Routes Integration
Profile image routes are part of the user routes:

```typescript
// Profile image routes within user routes
router.post('/profile-image/upload', ...);
router.delete('/profile-image/delete', ...);
router.get('/profile-image/me', ...);
router.get('/:userId/profile-image', ...);
```

## Best Practices

### Frontend Integration
1. **Image Compression**: Compress images before upload to reduce file size
2. **Preview**: Show image preview before upload
3. **Progress Indicators**: Display upload progress
4. **Error Handling**: Handle validation errors gracefully
5. **Fallback Images**: Provide default avatar when no profile image exists

### Backend Considerations
1. **CDN Integration**: Consider using CDN for image delivery
2. **Image Processing**: Implement image resizing/optimization
3. **Caching**: Cache profile images for better performance
4. **Backup**: Implement backup strategy for uploaded images
5. **Monitoring**: Monitor disk usage and file operations

### Security Considerations
1. **File Scanning**: Implement virus scanning for uploaded files
2. **Rate Limiting**: Apply rate limits to prevent abuse
3. **Content Validation**: Validate image content, not just extension
4. **Access Logs**: Log all file access for audit purposes
5. **Backup Strategy**: Regular backups of uploaded files

## Troubleshooting

### Common Issues

1. **File Upload Fails**
   - Check file size (must be under 2MB)
   - Verify file format (JPEG, PNG, GIF, WebP only)
   - Ensure proper multipart/form-data format
   - Check authentication token

2. **Permission Denied**
   - Verify user has `profile.image.upload` permission
   - Check role assignments
   - Ensure JWT token is valid

3. **Old Image Not Deleted**
   - Check file permissions on upload directory
   - Verify database connection
   - Check application logs for errors

4. **Image Not Displaying**
   - Verify file exists in storage
   - Check file permissions
   - Ensure proper URL construction
   - Verify CDN configuration (if applicable)

### Debug Commands

```bash
# Check file permissions
ls -la uploads/profile-images/

# Check disk usage
du -sh uploads/

# View application logs
npm run logs:view

# Check database records
# Use MongoDB shell or GUI tool to query FileObject collection
```

## Migration Guide

### From Previous Versions

If upgrading from a version without profile image support:

1. **Database Migration**
   ```javascript
   // Add profileImage field to User collection
   db.users.updateMany({}, { $set: { profileImage: null } });
   
   // Add category field to FileObject collection
   db.fileobjects.updateMany({}, { $set: { category: "other" } });
   ```

2. **Permission Setup**
   ```bash
   # Run database seed to add new permissions
   npm run seed
   ```

3. **File Storage**
   ```bash
   # Create profile-images directory
   mkdir -p uploads/profile-images
   ```

### From Separate Profile Image Routes

If migrating from the previous separate profile image routes:

1. **Update API Endpoints**:
   ```javascript
   // Old endpoints
   POST /api/v1/profile-images/upload
   DELETE /api/v1/profile-images/delete
   GET /api/v1/profile-images/me
   GET /api/v1/profile-images/:userId
   
   // New endpoints
   POST /api/v1/users/profile-image/upload
   DELETE /api/v1/users/profile-image/delete
   GET /api/v1/users/profile-image/me
   GET /api/v1/users/:userId/profile-image
   ```

2. **Update Service Usage**:
   ```typescript
   // Old
   import { ProfileImageService } from './services/profileImage.service';
   const profileImageService = new ProfileImageService();
   const result = await profileImageService.uploadProfileImage(file, userId);
   
   // New
   import { UserService } from './services/user.service';
   const result = await UserService.uploadProfileImage(file, userId);
   ```

## Support

For issues and questions:
- Check the application logs: `npm run logs:view`
- Review error responses for specific error codes
- Ensure all required permissions are assigned
- Verify file system permissions on upload directory
