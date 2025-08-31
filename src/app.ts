import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import pinoHttp from 'pino-http';
import { env } from './config';
import logger from './utils/logger';
import routes from './routes';
import { errorConverter, errorHandler } from './middleware/error';
import { notFound } from './middleware/notFound';
import { rateLimiter } from './middleware/rateLimit';

const app = express();

// Trust proxy for rate limiting
app.set('trust proxy', 1);

// Request logging middleware
app.use(pinoHttp({
  logger,
  genReqId: (req) => req.id,
  customLogLevel: (req, res, err) => {
    if (res.statusCode >= 400 && res.statusCode < 500) {
      return 'warn';
    }
    if (res.statusCode >= 500 || err) {
      return 'error';
    }
    return 'info';
  },
}));

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
}));

// CORS configuration
app.use(cors({
  origin: env.CORS_ORIGIN,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
}));

// Compression middleware
app.use(compression());

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Cookie parser middleware
app.use(cookieParser());

// Rate limiting
app.use(rateLimiter);



// Health check endpoints (before rate limiting)
app.get('/healthz', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Service is healthy',
    timestamp: new Date().toISOString(),
  });
});

app.get('/readyz', (req, res) => {
  // Add any readiness checks here (database connection, etc.)
  res.status(200).json({
    success: true,
    message: 'Service is ready',
    timestamp: new Date().toISOString(),
  });
});

// API routes
app.use('/', routes);

// 404 handler
app.use(notFound);

// Error handling middleware
app.use(errorConverter);
app.use(errorHandler);

export default app;
