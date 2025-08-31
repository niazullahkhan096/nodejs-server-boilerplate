import { BaseFileService, UploadedFile, FileUploadOptions } from './baseFile.service';
import User from '../models/User';
import { ApiError } from '../middleware/error';
import { httpStatus } from '../utils/httpStatus';
import logger from '../utils/logger';

export class ProfileImageService extends BaseFileService {
  protected getValidationRules() {
    return {
      allowedMimeTypes: [
        'image/jpeg',
        'image/jpg',
        'image/png',
        'image/gif',
        'image/webp'
      ],
      maxFileSize: 2 * 1024 * 1024, // 2MB for profile images
      allowedExtensions: ['.jpg', '.jpeg', '.png', '.gif', '.webp']
    };
  }

  protected getServiceName(): string {
    return 'ProfileImageService';
  }

  /**
   * Upload profile image
   */
  async uploadProfileImage(file: UploadedFile, userId: string): Promise<any> {
    try {
      // Validate file
      this.validateFile(file);

      // Set upload options for profile images
      const uploadOptions: FileUploadOptions = {
        category: 'profile-images',
        preserveOriginalName: false
      };

      // Generate file key
      const key = this.generateFileKey(file, uploadOptions);

      // Upload file to storage
      const fileObject = await this.uploadToLocal(file, key, userId, uploadOptions.category);

      // Update user's profile image
      await this.updateUserProfileImage(userId, fileObject.id);

      // Get updated user with populated profile image
      const user = await User.findById(userId)
        .populate('profileImage')
        .populate('roles', 'name permissions')
        .select('-password');

      if (!user) {
        throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
      }

      logger.info({
        userId,
        action: 'profile_image_upload',
        fileId: fileObject.id,
        fileSize: file.size,
        mimeType: file.mimetype
      }, 'Profile image uploaded successfully');

      return {
        user: user.toJSON(),
        profileImage: fileObject
      };
    } catch (error) {
      logger.error({
        userId,
        action: 'profile_image_upload',
        error: error instanceof Error ? error.message : 'Unknown error'
      }, 'Profile image upload failed');
      throw error;
    }
  }

  /**
   * Delete profile image
   */
  async deleteProfileImage(userId: string): Promise<any> {
    try {
      const user = await User.findById(userId);
      if (!user) {
        throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
      }

      if (!user.profileImage) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'No profile image to delete');
      }

      // Delete the profile image file using base service
      await this.deleteFile(user.profileImage.toString(), userId);

      // Remove profile image reference from user
      await User.findByIdAndUpdate(userId, { $unset: { profileImage: 1 } });

      // Get updated user
      const updatedUser = await User.findById(userId)
        .populate('roles', 'name permissions')
        .select('-password');

      logger.info({
        userId,
        action: 'delete_profile_image'
      }, 'Profile image deleted successfully');

      return {
        user: updatedUser?.toJSON(),
        message: 'Profile image deleted successfully'
      };
    } catch (error) {
      logger.error({
        userId,
        action: 'delete_profile_image',
        error: error instanceof Error ? error.message : 'Unknown error'
      }, 'Profile image deletion failed');
      throw error;
    }
  }

  /**
   * Get profile image information
   */
  async getProfileImage(userId: string): Promise<any> {
    try {
      const user = await User.findById(userId)
        .populate('profileImage')
        .populate('roles', 'name permissions')
        .select('-password');

      if (!user) {
        throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
      }

      return {
        user: user.toJSON(),
        hasProfileImage: !!user.profileImage
      };
    } catch (error) {
      logger.error({
        userId,
        action: 'get_profile_image',
        error: error instanceof Error ? error.message : 'Unknown error'
      }, 'Failed to get profile image');
      throw error;
    }
  }

  /**
   * Update user's profile image reference
   */
  private async updateUserProfileImage(userId: string, fileId: string): Promise<void> {
    // Get current user to check if they have an existing profile image
    const user = await User.findById(userId);
    if (!user) {
      throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
    }

    // If user has an existing profile image, delete it
    if (user.profileImage) {
      await this.deleteFile(user.profileImage.toString(), userId);
    }

    // Update user with new profile image
    await User.findByIdAndUpdate(userId, { profileImage: fileId });
  }
}
