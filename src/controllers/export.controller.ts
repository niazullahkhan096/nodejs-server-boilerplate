import { Request, Response, NextFunction } from 'express';
import { ExportService, DateRangeFilter } from '../services/export.service';
import { sendSuccess, sendError, getLanguageFromRequest } from '../utils/apiResponse';

export class ExportController {
  /**
   * Export users data to CSV
   */
  static async exportUsers(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const language = getLanguageFromRequest(req);
      
      // Extract query parameters
      const { startDate, endDate, fields } = req.query;
      
      // Build date range filter
      const dateRange: DateRangeFilter = {};
      if (startDate && typeof startDate === 'string') {
        dateRange.startDate = startDate;
      }
      if (endDate && typeof endDate === 'string') {
        dateRange.endDate = endDate;
      }

      // Validate date range
      const validation = ExportService.validateDateRange(dateRange);
      if (!validation.isValid) {
        sendError(res, 'export.invalid_date_range', 400, { error: validation.error }, language);
        return;
      }

      // Parse fields if provided
      let exportFields: string[] | undefined;
      if (fields && typeof fields === 'string') {
        exportFields = fields.split(',').map(field => field.trim());
      }

      // Export data to CSV
      const csvData = await ExportService.exportUsersToCSV({
        dateRange,
        fields: exportFields,
        language
      });

      // Check if data was found
      if (!csvData || csvData.trim() === '') {
        sendError(res, 'export.no_data', 404, null, language);
        return;
      }

      // Generate filename
      const filename = ExportService.generateFilename('users', dateRange);

      // Set response headers for file download
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
      res.setHeader('Cache-Control', 'no-cache');

      // Send CSV data
      res.send(csvData);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get available export fields
   */
  static async getExportFields(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const language = getLanguageFromRequest(req);
      
      const fields = ExportService.getAvailableFields(language);
      
      sendSuccess(res, { fields }, 'export.success', 200, language);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get export statistics (count of users in date range)
   */
  static async getExportStats(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const language = getLanguageFromRequest(req);
      
      // Extract query parameters
      const { startDate, endDate } = req.query;
      
      // Build date range filter
      const dateRange: DateRangeFilter = {};
      if (startDate && typeof startDate === 'string') {
        dateRange.startDate = startDate;
      }
      if (endDate && typeof endDate === 'string') {
        dateRange.endDate = endDate;
      }

      // Validate date range
      const validation = ExportService.validateDateRange(dateRange);
      if (!validation.isValid) {
        sendError(res, 'export.invalid_date_range', 400, { error: validation.error }, language);
        return;
      }

      // Build query for counting
      const query: any = {};
      if (dateRange?.startDate || dateRange?.endDate) {
        query.createdAt = {};
        
        if (dateRange.startDate) {
          query.createdAt.$gte = new Date(dateRange.startDate);
        }
        
        if (dateRange.endDate) {
          const endDate = new Date(dateRange.endDate);
          endDate.setHours(23, 59, 59, 999);
          query.createdAt.$lte = endDate;
        }
      }

      // Get total count
      const User = (await import('../models/User')).default;
      const totalCount = await User.countDocuments(query);

      // Get date range info
      const stats = {
        totalUsers: totalCount,
        dateRange: {
          startDate: dateRange.startDate || null,
          endDate: dateRange.endDate || null
        },
        exportAvailable: totalCount > 0
      };

      sendSuccess(res, stats, 'export.success', 200, language);
    } catch (error) {
      next(error);
    }
  }
}
