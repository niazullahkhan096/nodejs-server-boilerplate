export interface DateRangeFilter {
    startDate?: string;
    endDate?: string;
}
export interface ExportOptions {
    dateRange?: DateRangeFilter;
    fields?: string[];
    language?: string;
}
export declare class ExportService {
    /**
     * Export users data to CSV format
     * @param options - Export options including date range filter
     * @returns CSV string
     */
    static exportUsersToCSV(options?: ExportOptions): Promise<string>;
    /**
     * Get available export fields
     * @param language - Language for field descriptions
     * @returns Array of field objects with name and description
     */
    static getAvailableFields(language?: string): Array<{
        name: string;
        description: string;
    }>;
    /**
     * Validate date range
     * @param dateRange - Date range to validate
     * @returns Validation result
     */
    static validateDateRange(dateRange: DateRangeFilter): {
        isValid: boolean;
        error?: string;
    };
    /**
     * Generate filename for export
     * @param prefix - File prefix
     * @param dateRange - Date range filter
     * @returns Generated filename
     */
    static generateFilename(prefix?: string, dateRange?: DateRangeFilter): string;
}
//# sourceMappingURL=export.service.d.ts.map