import { BaseFileService, UploadedFile, FileUploadOptions } from './baseFile.service';
import { env } from '../config';
import logger from '../utils/logger';

export interface ExportOptions {
  format: 'csv' | 'json' | 'xml';
  filename?: string;
  includeHeaders?: boolean;
  dateFormat?: string;
}

export class FileExportService extends BaseFileService {
  protected getValidationRules() {
    return {
      allowedMimeTypes: [
        'text/csv',
        'application/json',
        'application/xml',
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      ],
      maxFileSize: 50 * 1024 * 1024, // 50MB for export files
      allowedExtensions: ['.csv', '.json', '.xml', '.xls', '.xlsx']
    };
  }

  protected getServiceName(): string {
    return 'FileExportService';
  }

  /**
   * Export data to CSV file
   */
  async exportToCSV(
    data: any[], 
    ownerId: string, 
    options?: Partial<FileUploadOptions & { headers?: string[] }>
  ): Promise<any> {
    const csvContent = this.convertToCSV(data, options?.headers);
    const buffer = Buffer.from(csvContent, 'utf-8');
    
    const file: UploadedFile = {
      originalname: options?.customFileName || `export-${Date.now()}.csv`,
      mimetype: 'text/csv',
      size: buffer.length,
      buffer
    };

    const uploadOptions: FileUploadOptions = {
      category: 'exports',
      subdirectory: 'csv',
      ...options
    };

    return this.uploadToLocal(file, this.generateFileKey(file, uploadOptions), ownerId, uploadOptions.category);
  }

  /**
   * Export data to JSON file
   */
  async exportToJSON(
    data: any, 
    ownerId: string, 
    options?: Partial<FileUploadOptions>
  ): Promise<any> {
    const jsonContent = JSON.stringify(data, null, 2);
    const buffer = Buffer.from(jsonContent, 'utf-8');
    
    const file: UploadedFile = {
      originalname: options?.customFileName || `export-${Date.now()}.json`,
      mimetype: 'application/json',
      size: buffer.length,
      buffer
    };

    const uploadOptions: FileUploadOptions = {
      category: 'exports',
      subdirectory: 'json',
      ...options
    };

    return this.uploadToLocal(file, this.generateFileKey(file, uploadOptions), ownerId, uploadOptions.category);
  }

  /**
   * Export data to XML file
   */
  async exportToXML(
    data: any, 
    ownerId: string, 
    options?: Partial<FileUploadOptions & { rootElement?: string }>
  ): Promise<any> {
    const xmlContent = this.convertToXML(data, options?.rootElement);
    const buffer = Buffer.from(xmlContent, 'utf-8');
    
    const file: UploadedFile = {
      originalname: options?.customFileName || `export-${Date.now()}.xml`,
      mimetype: 'application/xml',
      size: buffer.length,
      buffer
    };

    const uploadOptions: FileUploadOptions = {
      category: 'exports',
      subdirectory: 'xml',
      ...options
    };

    return this.uploadToLocal(file, this.generateFileKey(file, uploadOptions), ownerId, uploadOptions.category);
  }

  /**
   * Get export files for user
   */
  async getExportFiles(
    userId: string, 
    page = 1, 
    limit = 10, 
    format?: string
  ): Promise<{ files: any[]; total: number; page: number; totalPages: number }> {
    const category = format ? `exports/${format}` : 'exports';
    return this.getUserFiles(userId, page, limit, category);
  }

  /**
   * Get export statistics
   */
  async getExportStats(userId: string, format?: string): Promise<{
    totalFiles: number;
    totalSize: number;
    averageSize: number;
    formats: { [key: string]: number };
  }> {
    const baseStats = await this.getFileStats(userId, format ? `exports/${format}` : 'exports');
    
    // Get format breakdown
    const formatStats = await this.getFormatBreakdown(userId);
    
    return {
      ...baseStats,
      formats: formatStats
    };
  }

  /**
   * Clean up old export files
   */
  async cleanupOldExports(userId: string, daysOld: number = 30): Promise<number> {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysOld);

    const oldFiles = await this.findOldExportFiles(userId, cutoffDate);
    let deletedCount = 0;

    for (const file of oldFiles) {
      try {
        await this.deleteFile(file.id, userId);
        deletedCount++;
      } catch (error) {
        logger.error({
          service: this.getServiceName(),
          action: 'cleanup_old_exports',
          fileId: file.id,
          error: error instanceof Error ? error.message : 'Unknown error'
        }, 'Failed to delete old export file');
      }
    }

    logger.info({
      service: this.getServiceName(),
      action: 'cleanup_old_exports',
      userId,
      deletedCount,
      daysOld
    }, 'Old export files cleanup completed');

    return deletedCount;
  }

  /**
   * Convert data to CSV format
   */
  private convertToCSV(data: any[], headers?: string[]): string {
    if (!data || data.length === 0) {
      return '';
    }

    // Auto-generate headers if not provided
    if (!headers) {
      headers = Object.keys(data[0]);
    }

    // Create CSV header
    const csvRows = [headers.join(',')];

    // Add data rows
    for (const row of data) {
      const values = headers.map(header => {
        const value = row[header];
        // Escape commas and quotes
        if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
          return `"${value.replace(/"/g, '""')}"`;
        }
        return value || '';
      });
      csvRows.push(values.join(','));
    }

    return csvRows.join('\n');
  }

  /**
   * Convert data to XML format
   */
  private convertToXML(data: any, rootElement: string = 'data'): string {
    const xmlDeclaration = '<?xml version="1.0" encoding="UTF-8"?>';
    
    if (Array.isArray(data)) {
      const items = data.map(item => this.objectToXML(item, 'item')).join('\n');
      return `${xmlDeclaration}\n<${rootElement}>\n${items}\n</${rootElement}>`;
    } else {
      const content = this.objectToXML(data, 'item');
      return `${xmlDeclaration}\n<${rootElement}>\n${content}\n</${rootElement}>`;
    }
  }

  /**
   * Convert object to XML
   */
  private objectToXML(obj: any, elementName: string): string {
    if (typeof obj !== 'object' || obj === null) {
      return `<${elementName}>${obj}</${elementName}>`;
    }

    if (Array.isArray(obj)) {
      return obj.map(item => this.objectToXML(item, elementName)).join('\n');
    }

    const attributes: string[] = [];
    const children: string[] = [];

    for (const [key, value] of Object.entries(obj)) {
      if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
        children.push(this.objectToXML(value, key));
      } else {
        attributes.push(`${key}="${value}"`);
      }
    }

    if (children.length > 0) {
      return `<${elementName} ${attributes.join(' ')}>\n${children.join('\n')}\n</${elementName}>`;
    } else {
      return `<${elementName} ${attributes.join(' ')} />`;
    }
  }

  /**
   * Get format breakdown for exports
   */
  private async getFormatBreakdown(userId: string): Promise<{ [key: string]: number }> {
    const result = await this.aggregateExportFormats(userId);
    const breakdown: { [key: string]: number } = {};
    
    for (const item of result) {
      breakdown[item._id] = item.count;
    }
    
    return breakdown;
  }

  /**
   * Find old export files
   */
  private async findOldExportFiles(userId: string, cutoffDate: Date): Promise<any[]> {
    // This would need to be implemented with actual database query
    // For now, returning empty array
    return [];
  }

  /**
   * Aggregate export formats
   */
  private async aggregateExportFormats(userId: string): Promise<any[]> {
    // This would need to be implemented with actual database aggregation
    // For now, returning empty array
    return [];
  }
}
