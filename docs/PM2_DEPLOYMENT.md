# PM2 Deployment Guide

This guide covers how to deploy and manage the application using PM2 in production.

## 📋 Prerequisites

- Node.js 20+ installed
- PM2 installed globally: `npm install -g pm2`
- Environment variables configured (`.env.production`)

## 🚀 Quick Start

### 1. Build the Application

```bash
npm run build
```

### 2. Start with PM2

```bash
# Development mode
npm run pm2:start

# Production mode
npm run pm2:start:prod
```

### 3. Setup PM2 for Production

```bash
# Run the setup script
./scripts/pm2-setup.sh

# Or manually:
pm2 start ecosystem.config.js --env production
pm2 save
pm2 startup
```

## 📊 PM2 Management Commands

### Process Management

```bash
# Start processes
npm run pm2:start          # Start in development mode
npm run pm2:start:prod     # Start in production mode

# Stop processes
npm run pm2:stop           # Stop all processes
npm run pm2:delete         # Delete all processes

# Restart processes
npm run pm2:restart        # Restart all processes
npm run pm2:reload         # Zero-downtime reload

# Monitor processes
npm run pm2:status         # Check process status
npm run pm2:logs           # View logs
npm run pm2:monit          # Monitor processes
```

### Advanced PM2 Commands

```bash
# Process-specific commands
pm2 restart ecommerce-backend    # Restart specific app
pm2 reload ecommerce-backend     # Reload specific app
pm2 stop ecommerce-backend       # Stop specific app
pm2 delete ecommerce-backend     # Delete specific app

# Log management
pm2 logs ecommerce-backend       # View specific app logs
pm2 flush                        # Clear all logs
pm2 flush ecommerce-backend      # Clear specific app logs

# Monitoring
pm2 monit                        # Interactive monitoring
pm2 show ecommerce-backend       # Show detailed info
pm2 describe ecommerce-backend   # Show configuration
```

## 🔧 Configuration

### Ecosystem Configuration

The main configuration is in `ecosystem.config.js`:

```javascript
{
  name: 'ecommerce-backend',
  script: 'dist/server.js',
  instances: 'max',              // Use all CPU cores
  exec_mode: 'cluster',          // Cluster mode for load balancing
  env_production: {
    NODE_ENV: 'production',
    PORT: 4000,
    // ... other production env vars
  }
}
```

### Key Configuration Options

- **`instances`**: Number of instances (use 'max' for all CPU cores)
- **`exec_mode`**: 'cluster' for load balancing, 'fork' for single process
- **`max_memory_restart`**: Restart if memory exceeds this limit
- **`min_uptime`**: Minimum uptime before considering app stable
- **`max_restarts`**: Maximum restart attempts
- **`restart_delay`**: Delay between restarts

## 📈 Monitoring & Logging

### Log Files

PM2 creates several log files in the `logs/` directory:

- `combined.log` - Combined stdout and stderr
- `out.log` - Standard output
- `error.log` - Error output

### Monitoring Dashboard

```bash
pm2 monit
```

This opens an interactive dashboard showing:
- CPU usage
- Memory usage
- Process status
- Logs in real-time

### Health Checks

The application includes health check endpoints:

```bash
# Health check
curl http://localhost:4000/healthz

# Readiness check
curl http://localhost:4000/readyz
```

## 🔄 Zero-Downtime Deployment

### Using PM2 Reload

```bash
# Build new version
npm run build

# Zero-downtime reload
pm2 reload ecommerce-backend
```

### Using PM2 Deploy

```bash
# Setup deployment (first time)
pm2 deploy production setup

# Deploy new version
pm2 deploy production update
```

## 🛠️ Troubleshooting

### Common Issues

1. **Process not starting**
   ```bash
   pm2 logs ecommerce-backend
   pm2 show ecommerce-backend
   ```

2. **High memory usage**
   ```bash
   pm2 monit
   # Check memory usage and restart if needed
   ```

3. **Port already in use**
   ```bash
   # Check what's using the port
   lsof -i :4000
   # Kill the process or change port
   ```

### Reset PM2

```bash
# Stop and delete all processes
pm2 delete all

# Clear logs
pm2 flush

# Reset PM2 daemon
pm2 kill
pm2 resurrect
```

## 🔒 Security Considerations

### Production Security

1. **Environment Variables**: Ensure all sensitive data is in `.env.production`
2. **File Permissions**: Set proper permissions for logs and uploads directories
3. **Network Security**: Use reverse proxy (nginx) in front of PM2
4. **Process Isolation**: Run PM2 as a dedicated user

### Recommended Production Setup

```bash
# Create dedicated user
sudo useradd -m -s /bin/bash pm2user

# Set proper permissions
sudo chown -R pm2user:pm2user /path/to/app
sudo chmod 755 /path/to/app

# Run as dedicated user
sudo -u pm2user pm2 start ecosystem.config.js --env production
```

## 📚 Additional Resources

- [PM2 Official Documentation](https://pm2.keymetrics.io/docs/)
- [PM2 Ecosystem File](https://pm2.keymetrics.io/docs/usage/application-declaration/)
- [PM2 Monitoring](https://pm2.keymetrics.io/docs/usage/monitoring/)
- [PM2 Deployment](https://pm2.keymetrics.io/docs/usage/deployment/)

## 🆘 Support

If you encounter issues:

1. Check the logs: `pm2 logs`
2. Monitor processes: `pm2 monit`
3. Check process status: `pm2 status`
4. Review configuration: `pm2 show ecommerce-backend`
