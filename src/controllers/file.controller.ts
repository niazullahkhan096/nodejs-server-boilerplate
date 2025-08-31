import { Request, Response, NextFunction } from 'express';
import { FileService } from '../services/file.service';
import { sendSuccess, sendError, getLanguageFromRequest } from '../utils/apiResponse';

export class FileController {
  static async uploadFile(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.file) {
        const language = getLanguageFromRequest(req);
        sendError(res, 'file.upload.no_file', 400, null, language);
        return;
      }

      if (!req.user) {
        const language = getLanguageFromRequest(req);
        sendError(res, 'unauthorized', 401, null, language);
        return;
      }

      const file = await FileService.uploadFile(req.file, req.user.id);
      const language = getLanguageFromRequest(req);
      sendSuccess(res, file, 'file.upload.success', 201, language);
    } catch (error) {
      next(error);
    }
  }

  static async uploadMultipleFiles(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.files || !Array.isArray(req.files)) {
        const language = getLanguageFromRequest(req);
        sendError(res, 'file.upload.no_file', 400, null, language);
        return;
      }

      if (!req.user) {
        const language = getLanguageFromRequest(req);
        sendError(res, 'unauthorized', 401, null, language);
        return;
      }

      const uploadedFiles = [];
      for (const file of req.files) {
        const uploadedFile = await FileService.uploadFile(file, req.user!.id);
        uploadedFiles.push(uploadedFile);
      }

      const language = getLanguageFromRequest(req);
      sendSuccess(res, uploadedFiles, 'file.upload.success', 201, language);
    } catch (error) {
      next(error);
    }
  }

  static async downloadFile(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;

      if (!req.user) {
        const language = getLanguageFromRequest(req);
        sendError(res, 'unauthorized', 401, null, language);
        return;
      }

      const { fileObject, stream } = await FileService.getFile(id, req.user.id);

      res.setHeader('Content-Type', fileObject.mimeType);
      res.setHeader('Content-Disposition', `attachment; filename="${fileObject.originalName}"`);
      res.setHeader('Content-Length', fileObject.size);

      stream.pipe(res);
    } catch (error) {
      next(error);
    }
  }

  static async getFileInfo(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;

      if (!req.user) {
        return;
      }

      const file = await FileService.getFileById(id, req.user.id);
      const language = getLanguageFromRequest(req);
      sendSuccess(res, file, 'file.list.success', 200, language);
    } catch (error) {
      next(error);
    }
  }

  static async deleteFile(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;

      if (!req.user) {
        return;
      }

      await FileService.deleteFile(id, req.user.id);
      const language = getLanguageFromRequest(req);
      sendSuccess(res, null, 'file.delete.success', 204, language);
    } catch (error) {
      next(error);
    }
  }

  static async getUserFiles(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        return;
      }

      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;

      const result = await FileService.getUserFiles(req.user.id, page, limit);
      const language = getLanguageFromRequest(req);
      sendSuccess(res, result, 'file.list.success', 200, language);
    } catch (error) {
      next(error);
    }
  }
}
