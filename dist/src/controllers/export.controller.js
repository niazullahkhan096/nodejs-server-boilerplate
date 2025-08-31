"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExportController = void 0;
const export_service_1 = require("../services/export.service");
const apiResponse_1 = require("../utils/apiResponse");
class ExportController {
    /**
     * Export users data to CSV
     */
    static async exportUsers(req, res, next) {
        try {
            const language = (0, apiResponse_1.getLanguageFromRequest)(req);
            // Extract query parameters
            const { startDate, endDate, fields } = req.query;
            // Build date range filter
            const dateRange = {};
            if (startDate && typeof startDate === 'string') {
                dateRange.startDate = startDate;
            }
            if (endDate && typeof endDate === 'string') {
                dateRange.endDate = endDate;
            }
            // Validate date range
            const validation = export_service_1.ExportService.validateDateRange(dateRange);
            if (!validation.isValid) {
                (0, apiResponse_1.sendError)(res, 'export.invalid_date_range', 400, { error: validation.error }, language);
                return;
            }
            // Parse fields if provided
            let exportFields;
            if (fields && typeof fields === 'string') {
                exportFields = fields.split(',').map(field => field.trim());
            }
            // Export data to CSV
            const csvData = await export_service_1.ExportService.exportUsersToCSV({
                dateRange,
                fields: exportFields,
                language
            });
            // Check if data was found
            if (!csvData || csvData.trim() === '') {
                (0, apiResponse_1.sendError)(res, 'export.no_data', 404, null, language);
                return;
            }
            // Generate filename
            const filename = export_service_1.ExportService.generateFilename('users', dateRange);
            // Set response headers for file download
            res.setHeader('Content-Type', 'text/csv');
            res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
            res.setHeader('Cache-Control', 'no-cache');
            // Send CSV data
            res.send(csvData);
        }
        catch (error) {
            next(error);
        }
    }
    /**
     * Get available export fields
     */
    static async getExportFields(req, res, next) {
        try {
            const language = (0, apiResponse_1.getLanguageFromRequest)(req);
            const fields = export_service_1.ExportService.getAvailableFields(language);
            (0, apiResponse_1.sendSuccess)(res, { fields }, 'export.success', 200, language);
        }
        catch (error) {
            next(error);
        }
    }
    /**
     * Get export statistics (count of users in date range)
     */
    static async getExportStats(req, res, next) {
        try {
            const language = (0, apiResponse_1.getLanguageFromRequest)(req);
            // Extract query parameters
            const { startDate, endDate } = req.query;
            // Build date range filter
            const dateRange = {};
            if (startDate && typeof startDate === 'string') {
                dateRange.startDate = startDate;
            }
            if (endDate && typeof endDate === 'string') {
                dateRange.endDate = endDate;
            }
            // Validate date range
            const validation = export_service_1.ExportService.validateDateRange(dateRange);
            if (!validation.isValid) {
                (0, apiResponse_1.sendError)(res, 'export.invalid_date_range', 400, { error: validation.error }, language);
                return;
            }
            // Build query for counting
            const query = {};
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
            const User = (await Promise.resolve().then(() => __importStar(require('../models/User')))).default;
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
            (0, apiResponse_1.sendSuccess)(res, stats, 'export.success', 200, language);
        }
        catch (error) {
            next(error);
        }
    }
}
exports.ExportController = ExportController;
//# sourceMappingURL=export.controller.js.map