module.exports = {
  apps: [
    {
      name: 'ecommerce-backend',
      script: 'dist/server.js',
      instances: 'max', // Use all available CPU cores
      exec_mode: 'cluster',
      env: {
        NODE_ENV: 'development',
        PORT: 4000
      },
      env_production: {
        NODE_ENV: 'production',
        PORT: 4000
      },
      env_file: '.env.production',
      // Logging
      log_file: './logs/combined.log',
      out_file: './logs/out.log',
      error_file: './logs/error.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      // Process management
      max_memory_restart: '1G',
      min_uptime: '10s',
      max_restarts: 10,
      restart_delay: 4000,
      // Monitoring
      watch: false,
      ignore_watch: ['node_modules', 'logs', 'uploads'],
      // Health check
      health_check_grace_period: 3000,
      health_check_fatal_exceptions: true,
      // Advanced settings
      node_args: '--max-old-space-size=1024',
      // Environment variables
      env_production: {
        NODE_ENV: 'production',
        PORT: 4000,
        LOG_LEVEL: 'warn',
        CORS_ORIGIN: 'https://your-frontend-domain.com',
        COOKIE_SECURE: 'true',
        COOKIE_SAME_SITE: 'strict',
        RATE_LIMIT_MAX: 50,
        ALLOW_DB_SEED: 'false',
        DEFAULT_LANGUAGE: 'en'
      }
    }
  ],

  // Deployment configuration
  deploy: {
    production: {
      user: 'deploy',
      host: 'your-server.com',
      ref: 'origin/main',
      repo: 'git@github.com:your-username/ecommerce-backend.git',
      path: '/var/www/ecommerce-backend',
      'pre-deploy-local': '',
      'post-deploy': 'npm install && npm run build && pm2 reload ecosystem.config.js --env production',
      'pre-setup': ''
    }
  }
};
