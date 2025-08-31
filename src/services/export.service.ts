import { Parser } from 'json2csv';
import User from '../models/User';
import { TranslationService } from './translation.service';

export interface DateRangeFilter {
  startDate?: string;
  endDate?: string;
}

export interface ExportOptions {
  dateRange?: DateRangeFilter;
  fields?: string[];
  language?: string;
}

export class ExportService {
  /**
   * Export users data to CSV format
   * @param options - Export options including date range filter
   * @returns CSV string
   */
  static async exportUsersToCSV(options: ExportOptions = {}): Promise<string> {
    const { dateRange, fields, language = 'en' } = options;

    // Build query
    const query: any = {};

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
    const users = await User.find(query)
      .select('-password -refreshTokens')
      .populate('role', 'name')
      .lean();

    // Transform data for CSV export
    const csvData = users.map((user: any) => ({
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
    const parser = new Parser({
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
  static getAvailableFields(language: string = 'en'): Array<{ name: string; description: string }> {
    return [
      { name: 'ID', description: TranslationService.getMessage('export.field.id', language) },
      { name: 'Name', description: TranslationService.getMessage('export.field.name', language) },
      { name: 'Email', description: TranslationService.getMessage('export.field.email', language) },
      { name: 'Role', description: TranslationService.getMessage('export.field.role', language) },
      { name: 'Status', description: TranslationService.getMessage('export.field.status', language) },
      { name: 'Email Verified', description: TranslationService.getMessage('export.field.email_verified', language) },
      { name: 'Created At', description: TranslationService.getMessage('export.field.created_at', language) },
      { name: 'Updated At', description: TranslationService.getMessage('export.field.updated_at', language) },
      { name: 'Last Login', description: TranslationService.getMessage('export.field.last_login', language) }
    ];
  }

  /**
   * Validate date range
   * @param dateRange - Date range to validate
   * @returns Validation result
   */
  static validateDateRange(dateRange: DateRangeFilter): { isValid: boolean; error?: string } {
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
  static generateFilename(prefix: string = 'users', dateRange?: DateRangeFilter): string {
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
