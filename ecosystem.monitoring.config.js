module.exports = {
  apps: [
    {
      name: 'ecommerce-backend-dev',
      script: 'dist/server.js',
      instances: 1,
      exec_mode: 'fork',
      env: {
        NODE_ENV: 'development',
        PORT: 4000
      },
      env_file: '.env.development',
      // Logging
      log_file: './logs/combined.log',
      out_file: './logs/out.log',
      error_file: './logs/error.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      // Process management
      max_memory_restart: '512M',
      min_uptime: '10s',
      max_restarts: 5,
      restart_delay: 2000,
      // Monitoring
      watch: false,
      ignore_watch: ['node_modules', 'logs', 'uploads'],
      // Health check
      health_check_grace_period: 3000,
      health_check_fatal_exceptions: true,
      // Advanced settings
      node_args: '--max-old-space-size=512'
    },
    {
      name: 'ecommerce-backend-monitor',
      script: 'node_modules/pm2/bin/pm2',
      args: 'monit',
      instances: 1,
      exec_mode: 'fork',
      env: {
        NODE_ENV: 'development'
      },
      // Only run in development
      env_development: {
        NODE_ENV: 'development'
      }
    }
  ]
};
