"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExportService = void 0;
const json2csv_1 = require("json2csv");
const User_1 = __importDefault(require("../models/User"));
const translation_service_1 = require("./translation.service");
class ExportService {
    /**
     * Export users data to CSV format
     * @param options - Export options including date range filter
     * @returns CSV string
     */
    static async exportUsersToCSV(options = {}) {
        const { dateRange, fields, language = 'en' } = options;
        // Build query
        const query = {};
        // Add date range filter if provided
        if (dateRange?.startDate || dateRange?.endDate) {
            query.createdAt = {};
            if (dateRange.startDate) {
                query.createdAt.$gte = new Date(dateRange.startDate);
            }
            if (dateRange.endDate) {
                // Set end date to end of day
                const endDate = new Date(dateRange.endDate);
                endDate.setHours(23, 59, 59, 999);
                query.createdAt.$lte = endDate;
            }
        }
        // Fetch users with date range filter
        const users = await User_1.default.find(query)
            .select('-password -refreshTokens')
            .populate('role', 'name')
            .lean();
        // Transform data for CSV export
        const csvData = users.map((user) => ({
            ID: user._id.toString(),
            Name: user.name,
            Email: user.email,
            Role: user.role?.name || 'No Role',
            Status: user.isActive ? 'Active' : 'Inactive',
            'Email Verified': user.isEmailVerified ? 'Yes' : 'No',
            'Created At': user.createdAt ? new Date(user.createdAt).toISOString() : '',
            'Updated At': user.updatedAt ? new Date(user.updatedAt).toISOString() : '',
            'Last Login': user.lastLoginAt ? new Date(user.lastLoginAt).toISOString() : 'Never'
        }));
        // Define CSV fields (columns)
        const csvFields = fields || [
            'ID',
            'Name',
            'Email',
            'Role',
            'Status',
            'Email Verified',
            'Created At',
            'Updated At',
            'Last Login'
        ];
        // Configure CSV parser
        const parser = new json2csv_1.Parser({
            fields: csvFields,
            header: true,
            quote: '"',
            delimiter: ',',
            eol: '\n'
        });
        // Generate CSV
        const csv = parser.parse(csvData);
        return csv;
    }
    /**
     * Get available export fields
     * @param language - Language for field descriptions
     * @returns Array of field objects with name and description
     */
    static getAvailableFields(language = 'en') {
        return [
            { name: 'ID', description: translation_service_1.TranslationService.getMessage('export.field.id', language) },
            { name: 'Name', description: translation_service_1.TranslationService.getMessage('export.field.name', language) },
            { name: 'Email', description: translation_service_1.TranslationService.getMessage('export.field.email', language) },
            { name: 'Role', description: translation_service_1.TranslationService.getMessage('export.field.role', language) },
            { name: 'Status', description: translation_service_1.TranslationService.getMessage('export.field.status', language) },
            { name: 'Email Verified', description: translation_service_1.TranslationService.getMessage('export.field.email_verified', language) },
            { name: 'Created At', description: translation_service_1.TranslationService.getMessage('export.field.created_at', language) },
            { name: 'Updated At', description: translation_service_1.TranslationService.getMessage('export.field.updated_at', language) },
            { name: 'Last Login', description: translation_service_1.TranslationService.getMessage('export.field.last_login', language) }
        ];
    }
    /**
     * Validate date range
     * @param dateRange - Date range to validate
     * @returns Validation result
     */
    static validateDateRange(dateRange) {
        if (!dateRange.startDate && !dateRange.endDate) {
            return { isValid: true };
        }
        if (dateRange.startDate) {
            const startDate = new Date(dateRange.startDate);
            if (isNaN(startDate.getTime())) {
                return { isValid: false, error: 'Invalid start date format' };
            }
        }
        if (dateRange.endDate) {
            const endDate = new Date(dateRange.endDate);
            if (isNaN(endDate.getTime())) {
                return { isValid: false, error: 'Invalid end date format' };
            }
        }
        if (dateRange.startDate && dateRange.endDate) {
            const startDate = new Date(dateRange.startDate);
            const endDate = new Date(dateRange.endDate);
            if (startDate > endDate) {
                return { isValid: false, error: 'Start date cannot be after end date' };
            }
        }
        return { isValid: true };
    }
    /**
     * Generate filename for export
     * @param prefix - File prefix
     * @param dateRange - Date range filter
     * @returns Generated filename
     */
    static generateFilename(prefix = 'users', dateRange) {
        const timestamp = new Date().toISOString().split('T')[0];
        let filename = `${prefix}_${timestamp}`;
        if (dateRange?.startDate) {
            const startDate = new Date(dateRange.startDate).toISOString().split('T')[0];
            filename += `_from_${startDate}`;
        }
        if (dateRange?.endDate) {
            const endDate = new Date(dateRange.endDate).toISOString().split('T')[0];
            filename += `_to_${endDate}`;
        }
        return `${filename}.csv`;
    }
}
exports.ExportService = ExportService;
//# sourceMappingURL=export.service.js.map