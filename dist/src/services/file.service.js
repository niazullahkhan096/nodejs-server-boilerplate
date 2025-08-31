"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileService = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const crypto_1 = require("../utils/crypto");
const config_1 = require("../config");
const FileObject_1 = __importDefault(require("../models/FileObject"));
const error_1 = require("../middleware/error");
const httpStatus_1 = require("../utils/httpStatus");
class FileService {
    static async uploadFile(file, ownerId) {
        const key = `${Date.now()}-${(0, crypto_1.generateRandomString)(16)}-${file.originalname}`;
        return this.uploadToLocal(file, key, ownerId);
    }
    static async uploadToLocal(file, key, ownerId) {
        const filePath = path_1.default.join(config_1.env.UPLOAD_DIR, key);
        // Ensure directory exists
        const dir = path_1.default.dirname(filePath);
        if (!fs_1.default.existsSync(dir)) {
            fs_1.default.mkdirSync(dir, { recursive: true });
        }
        // Write file to disk
        fs_1.default.writeFileSync(filePath, file.buffer);
        // Save file metadata to database
        const fileObject = await FileObject_1.default.create({
            key,
            originalName: file.originalname,
            mimeType: file.mimetype,
            size: file.size,
            owner: ownerId,
        });
        return fileObject.toJSON();
    }
    static async getFile(fileId, userId) {
        const fileObject = await FileObject_1.default.findById(fileId).populate('owner', 'id name');
        if (!fileObject) {
            throw new error_1.ApiError(httpStatus_1.httpStatus.NOT_FOUND, 'File not found');
        }
        // Check if user has permission to access the file
        if (fileObject.owner.toString() !== userId) {
            throw new error_1.ApiError(httpStatus_1.httpStatus.FORBIDDEN, 'Access denied');
        }
        const filePath = path_1.default.join(config_1.env.UPLOAD_DIR, fileObject.key);
        if (!fs_1.default.existsSync(filePath)) {
            throw new error_1.ApiError(httpStatus_1.httpStatus.NOT_FOUND, 'File not found on disk');
        }
        const stream = fs_1.default.createReadStream(filePath);
        return { fileObject: fileObject.toJSON(), stream };
    }
    static async deleteFile(fileId, userId) {
        const fileObject = await FileObject_1.default.findById(fileId);
        if (!fileObject) {
            throw new error_1.ApiError(httpStatus_1.httpStatus.NOT_FOUND, 'File not found');
        }
        // Check if user has permission to delete the file
        if (fileObject.owner.toString() !== userId) {
            throw new error_1.ApiError(httpStatus_1.httpStatus.FORBIDDEN, 'Access denied');
        }
        // Delete from storage
        const filePath = path_1.default.join(config_1.env.UPLOAD_DIR, fileObject.key);
        if (fs_1.default.existsSync(filePath)) {
            fs_1.default.unlinkSync(filePath);
        }
        // Delete from database
        await FileObject_1.default.findByIdAndDelete(fileId);
    }
    static async getUserFiles(userId, page = 1, limit = 10) {
        const skip = (page - 1) * limit;
        const [files, total] = await Promise.all([
            FileObject_1.default.find({ owner: userId })
                .populate('owner', 'id name')
                .skip(skip)
                .limit(limit)
                .sort({ createdAt: -1 }),
            FileObject_1.default.countDocuments({ owner: userId }),
        ]);
        return {
            files: files.map(file => file.toJSON()),
            total,
            page,
            totalPages: Math.ceil(total / limit),
        };
    }
    static async getFileById(fileId, userId) {
        const fileObject = await FileObject_1.default.findById(fileId).populate('owner', 'id name');
        if (!fileObject) {
            throw new error_1.ApiError(httpStatus_1.httpStatus.NOT_FOUND, 'File not found');
        }
        // Check if user has permission to access the file
        if (fileObject.owner.toString() !== userId) {
            throw new error_1.ApiError(httpStatus_1.httpStatus.FORBIDDEN, 'Access denied');
        }
        return fileObject.toJSON();
    }
}
exports.FileService = FileService;
//# sourceMappingURL=file.service.js.map