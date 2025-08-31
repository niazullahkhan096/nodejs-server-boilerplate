"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileController = void 0;
const file_service_1 = require("../services/file.service");
const apiResponse_1 = require("../utils/apiResponse");
class FileController {
    static async uploadFile(req, res, next) {
        try {
            if (!req.file) {
                const language = (0, apiResponse_1.getLanguageFromRequest)(req);
                (0, apiResponse_1.sendError)(res, 'file.upload.no_file', 400, null, language);
                return;
            }
            if (!req.user) {
                const language = (0, apiResponse_1.getLanguageFromRequest)(req);
                (0, apiResponse_1.sendError)(res, 'unauthorized', 401, null, language);
                return;
            }
            const file = await file_service_1.FileService.uploadFile(req.file, req.user.id);
            const language = (0, apiResponse_1.getLanguageFromRequest)(req);
            (0, apiResponse_1.sendSuccess)(res, file, 'file.upload.success', 201, language);
        }
        catch (error) {
            next(error);
        }
    }
    static async uploadMultipleFiles(req, res, next) {
        try {
            if (!req.files || !Array.isArray(req.files)) {
                const language = (0, apiResponse_1.getLanguageFromRequest)(req);
                (0, apiResponse_1.sendError)(res, 'file.upload.no_file', 400, null, language);
                return;
            }
            if (!req.user) {
                const language = (0, apiResponse_1.getLanguageFromRequest)(req);
                (0, apiResponse_1.sendError)(res, 'unauthorized', 401, null, language);
                return;
            }
            const uploadedFiles = [];
            for (const file of req.files) {
                const uploadedFile = await file_service_1.FileService.uploadFile(file, req.user.id);
                uploadedFiles.push(uploadedFile);
            }
            const language = (0, apiResponse_1.getLanguageFromRequest)(req);
            (0, apiResponse_1.sendSuccess)(res, uploadedFiles, 'file.upload.success', 201, language);
        }
        catch (error) {
            next(error);
        }
    }
    static async downloadFile(req, res, next) {
        try {
            const { id } = req.params;
            if (!req.user) {
                const language = (0, apiResponse_1.getLanguageFromRequest)(req);
                (0, apiResponse_1.sendError)(res, 'unauthorized', 401, null, language);
                return;
            }
            const { fileObject, stream } = await file_service_1.FileService.getFile(id, req.user.id);
            res.setHeader('Content-Type', fileObject.mimeType);
            res.setHeader('Content-Disposition', `attachment; filename="${fileObject.originalName}"`);
            res.setHeader('Content-Length', fileObject.size);
            stream.pipe(res);
        }
        catch (error) {
            next(error);
        }
    }
    static async getFileInfo(req, res, next) {
        try {
            const { id } = req.params;
            if (!req.user) {
                return;
            }
            const file = await file_service_1.FileService.getFileById(id, req.user.id);
            const language = (0, apiResponse_1.getLanguageFromRequest)(req);
            (0, apiResponse_1.sendSuccess)(res, file, 'file.list.success', 200, language);
        }
        catch (error) {
            next(error);
        }
    }
    static async deleteFile(req, res, next) {
        try {
            const { id } = req.params;
            if (!req.user) {
                return;
            }
            await file_service_1.FileService.deleteFile(id, req.user.id);
            const language = (0, apiResponse_1.getLanguageFromRequest)(req);
            (0, apiResponse_1.sendSuccess)(res, null, 'file.delete.success', 204, language);
        }
        catch (error) {
            next(error);
        }
    }
    static async getUserFiles(req, res, next) {
        try {
            if (!req.user) {
                return;
            }
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const result = await file_service_1.FileService.getUserFiles(req.user.id, page, limit);
            const language = (0, apiResponse_1.getLanguageFromRequest)(req);
            (0, apiResponse_1.sendSuccess)(res, result, 'file.list.success', 200, language);
        }
        catch (error) {
            next(error);
        }
    }
}
exports.FileController = FileController;
//# sourceMappingURL=file.controller.js.map