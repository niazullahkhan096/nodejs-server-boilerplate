# Logging System Documentation

This document describes the comprehensive logging system implemented in the Node.js server boilerplate.

## Overview

The logging system provides:
- **File-based logging** with automatic rotation
- **Environment-specific configuration** (development vs production)
- **PM2 compatibility** for production deployments
- **Structured logging** with JSON format
- **Multiple log levels** and specialized loggers
- **Request/response logging** with timing information
- **Error tracking** with stack traces
- **Security event logging**
- **Performance monitoring**

## Configuration

### Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `LOG_LEVEL` | `info` | Log level (fatal, error, warn, info, debug, trace) |
| `LOG_TO_FILE` | `false` | Enable file-based logging |
| `LOG_DIR` | `./logs` | Directory for log files |
| `LOG_MAX_SIZE` | `10485760` | Maximum log file size in bytes (10MB) |
| `LOG_MAX_FILES` | `5` | Maximum number of backup files to keep |
| `LOG_ROTATE_INTERVAL` | `1d` | Log rotation interval |

### Environment-Specific Settings

#### Development
```bash
LOG_LEVEL=debug
LOG_TO_FILE=false
```

#### Production
```bash
LOG_LEVEL=info
LOG_TO_FILE=true
LOG_DIR=./logs
LOG_MAX_SIZE=10485760
LOG_MAX_FILES=5
LOG_ROTATE_INTERVAL=1d
```

## Log Files

The system creates the following log files in the `logs/` directory:

- `combined.log` - All application logs
- `error.log` - Error-level logs only
- `access.log` - HTTP request/response logs
- `application.log` - Application-specific logs
- `pm2-combined.log` - PM2 process logs
- `pm2-out.log` - PM2 stdout logs
- `pm2-error.log` - PM2 stderr logs

## Usage

### Basic Logging

```typescript
import logger from './utils/logger';

// Different log levels
logger.trace('Trace message');
logger.debug('Debug message');
logger.info('Info message');
logger.warn('Warning message');
logger.error('Error message');
logger.fatal('Fatal message');
```

### Structured Logging

```typescript
import logger from './utils/logger';

// Log with additional context
logger.info({
  userId: '123',
  action: 'login',
  ip: '192.168.1.1',
  userAgent: 'Mozilla/5.0...'
}, 'User logged in successfully');
```

### Specialized Loggers

```typescript
import { 
  logRequest, 
  logError, 
  logDatabase, 
  logSecurity, 
  logPerformance 
} from './utils/logger';

// HTTP request logging (automatic via middleware)
logRequest(req, res, responseTime);

// Error logging
logError(error, req, { additionalContext: 'value' });

// Database operation logging
logDatabase('find', 'users', 150, true);

// Security event logging
logSecurity('failed_login', 'user@example.com', '192.168.1.1', {
  reason: 'invalid_password'
});

// Performance logging
logPerformance('database_query', 250, { collection: 'users' });
```

## Middleware

### Request Logging Middleware

Automatically logs all HTTP requests with:
- Request method and URL
- Response status code
- Response time
- User agent
- IP address
- Unique request ID

### Error Logging Middleware

Automatically logs all application errors with:
- Error message and stack trace
- Request context
- Additional metadata

## PM2 Integration

The logging system is designed to work seamlessly with PM2:

1. **Console Output**: PM2 captures console output for monitoring
2. **File Logging**: Application logs are written to files
3. **Log Rotation**: Automatic log rotation prevents disk space issues
4. **Process Management**: PM2 handles process restarts and log management

### PM2 Commands

```bash
# Start with production environment
npm run pm2:start:prod

# View logs
npm run pm2:logs

# Monitor processes
npm run pm2:monit

# Check status
npm run pm2:status
```

## Log Rotation

### Automatic Rotation

Log files are automatically rotated when they reach the configured size limit.

### Manual Rotation

Use the provided script for manual log rotation:

```bash
# Run log rotation script
./scripts/log-rotation.sh

# Set up cron job for daily rotation
0 2 * * * /path/to/project/scripts/log-rotation.sh
```

### Cron Job Setup

Add to crontab for automatic log rotation:

```bash
# Edit crontab
crontab -e

# Add daily log rotation at 2 AM
0 2 * * * cd /path/to/project && ./scripts/log-rotation.sh >> /var/log/log-rotation.log 2>&1
```

## Monitoring and Analysis

### Log Analysis Tools

- **Pino**: Built-in log analysis and formatting
- **Logrotate**: System-level log rotation
- **ELK Stack**: Elasticsearch, Logstash, Kibana
- **Grafana**: Log visualization and monitoring

### Log Format

Logs are in JSON format for easy parsing:

```json
{
  "level": 30,
  "time": 1640995200000,
  "pid": 12345,
  "hostname": "server-1",
  "env": "production",
  "reqId": "uuid-here",
  "msg": "HTTP Request",
  "method": "GET",
  "url": "/api/users",
  "status": 200,
  "responseTime": 150,
  "userAgent": "Mozilla/5.0...",
  "ip": "192.168.1.1"
}
```

## Best Practices

### Development
- Use `LOG_LEVEL=debug` for detailed logging
- Disable file logging (`LOG_TO_FILE=false`) for console output
- Use pretty printing for readable logs

### Production
- Use `LOG_LEVEL=info` or `warn` to reduce log volume
- Enable file logging (`LOG_TO_FILE=true`)
- Set up log rotation to prevent disk space issues
- Monitor log file sizes and rotation
- Use structured logging for better analysis

### Security
- Never log sensitive information (passwords, tokens, etc.)
- Use appropriate log levels for different types of information
- Implement log retention policies
- Secure log file permissions

### Performance
- Use appropriate log levels to avoid performance impact
- Implement log buffering for high-volume applications
- Monitor log writing performance
- Use asynchronous logging when possible

## Troubleshooting

### Common Issues

1. **Log files not created**
   - Check `LOG_DIR` path and permissions
   - Ensure directory exists and is writable

2. **Log rotation not working**
   - Check file permissions on rotation script
   - Verify cron job is properly configured
   - Check log file sizes manually

3. **High disk usage**
   - Reduce `LOG_MAX_FILES` value
   - Increase `LOG_MAX_SIZE` for less frequent rotation
   - Implement log compression

4. **PM2 logs not showing**
   - Check PM2 configuration
   - Verify log file paths in ecosystem.config.js
   - Restart PM2 processes

### Debug Commands

```bash
# Check log directory permissions
ls -la logs/

# Check log file sizes
du -h logs/*.log

# View recent logs
tail -f logs/combined.log

# Check PM2 logs
pm2 logs

# Test log rotation
./scripts/log-rotation.sh
```
