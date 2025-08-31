# Node.js Server Boilerplate

A production-ready Node.js 20 + TypeScript 5 server boilerplate with Express, Mongoose, JWT authentication, Role-Based Access Control (RBAC), and file uploads.

## 🚀 Features

- **Runtime**: Node.js 20 LTS with TypeScript 5
- **Framework**: Express.js with comprehensive middleware
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT with access + refresh tokens and rotation
- **Authorization**: Role-Based Access Control (RBAC) with permissions
- **Validation**: Organized Zod schemas following Single Responsibility Principle
- **Security**: Helmet, CORS, rate limiting, and more
- **File Uploads**: Local disk storage support
- **Internationalization**: Multi-language response messages
- **Data Export**: CSV export functionality with date range filtering
- **Process Management**: PM2 for production deployment and monitoring


- **Logging**: Pino with request ID tracking

- **CI/CD**: GitHub Actions workflow
- **Code Quality**: ESLint, Prettier, and Husky hooks

## 📋 Prerequisites

- Node.js 20.x or higher
- MongoDB 7.0 or higher


## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd node-server-boilerplate
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   **For Development:**
   ```bash
   cp .env.development .env
   # Edit .env with your MongoDB URI and JWT secrets
   ```
   
   **For Production:**
   ```bash
   cp .env.production .env
   # Edit .env with your production values
   ```
   
   **Required Environment Variables:**
   ```env
   MONGO_URI=mongodb://localhost:27017/your-database
   JWT_ACCESS_SECRET=your-access-secret-key-min-32-chars
   JWT_REFRESH_SECRET=your-refresh-secret-key-min-32-chars
   ```
   
   **Available Environment Files:**
   - `.env.development` - Development settings (debug logging, relaxed rate limits)
   - `.env.production` - Production settings (warn logging, strict security)
   - `env.example` - Template with all available variables

4. **Start MongoDB**
   ```bash
   # Install and start MongoDB locally
   # Follow instructions at https://docs.mongodb.com/manual/installation/
   ```

5. **Seed the database (optional)**
   ```bash
   npm run seed
   ```

6. **Start the development server**
   ```bash
   npm run dev
   ```

The server will be available at `http://localhost:4000`



## 📚 API Endpoints

Once the server is running, you can access:

- **Health Check**: http://localhost:4000/healthz

## 🌐 API Response Format

All API responses follow a consistent format:

```json
{
  "code": 200,
  "message": "Success message",
  "data": { ... }
}
```

### Internationalization

The API supports multiple languages for response messages. Languages can be specified via:

1. **Accept-Language header**: `Accept-Language: es`
2. **Query parameter**: `?lang=es` or `?language=es`
3. **Environment variable**: `DEFAULT_LANGUAGE=es`

**Supported Languages:**
- `en` - English (default)
- `es` - Spanish
- `fr` - French
- `de` - German
- `ar` - Arabic

**Example:**
```bash
# English response (default)
curl http://localhost:4000/api/v1/auth/login

# Spanish response
curl -H "Accept-Language: es" http://localhost:4000/api/v1/auth/login

# French response via query parameter
curl http://localhost:4000/api/v1/auth/login?lang=fr
```

## 📊 Data Export

The API provides CSV export functionality for users data with date range filtering.

### Export Endpoints

#### Export Users to CSV
```http
GET /api/v1/export/users/csv
```

**Query Parameters:**
- `startDate` (optional): Start date in YYYY-MM-DD format
- `endDate` (optional): End date in YYYY-MM-DD format  
- `fields` (optional): Comma-separated list of fields to include

**Example:**
```bash
# Export all users
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:4000/api/v1/export/users/csv

# Export users created between dates
curl -H "Authorization: Bearer YOUR_TOKEN" \
  "http://localhost:4000/api/v1/export/users/csv?startDate=2024-01-01&endDate=2024-12-31"

# Export specific fields only
curl -H "Authorization: Bearer YOUR_TOKEN" \
  "http://localhost:4000/api/v1/export/users/csv?fields=Name,Email,Role,Status"
```

#### Get Available Export Fields
```http
GET /api/v1/export/users/fields
```

Returns available fields for export with descriptions in the requested language.

#### Get Export Statistics
```http
GET /api/v1/export/users/stats
```

Returns statistics about the data that would be exported based on the date range.

**Query Parameters:**
- `startDate` (optional): Start date in YYYY-MM-DD format
- `endDate` (optional): End date in YYYY-MM-DD format

### Export Features

- **Date Range Filtering**: Filter users by creation date
- **Field Selection**: Choose which fields to include in the export
- **Internationalization**: Field descriptions in multiple languages
- **File Naming**: Automatic filename generation with date range
- **CSV Format**: Standard CSV format with headers
- **Authentication Required**: Requires `user.read` permission

### Available Fields

- `ID` - User ID
- `Name` - User name
- `Email` - Email address
- `Role` - User role
- `Status` - Account status (Active/Inactive)
- `Email Verified` - Email verification status
- `Created At` - Account creation date
- `Updated At` - Last update date
- `Last Login` - Last login date

## ✅ Validation Schema Organization

The application uses a well-organized validation system following the Single Responsibility Principle:

### Schema Structure

```
src/utils/validation/
├── index.ts              # Main export file
├── common.schema.ts      # Common validation patterns
├── auth.schema.ts        # Authentication schemas
├── user.schema.ts        # User management schemas
├── role.schema.ts        # Role management schemas
├── permission.schema.ts  # Permission management schemas
├── file.schema.ts        # File management schemas
└── export.schema.ts      # Export functionality schemas
```

### Key Features

- **Domain-Specific Organization**: Each domain has its own schema file
- **Common Patterns**: Reusable validation patterns in `common.schema.ts`
- **Consistent Error Messages**: Standardized error messages across all schemas
- **Type Safety**: Full TypeScript support with IntelliSense
- **Maintainability**: Easy to find, modify, and extend validation rules

### Usage Example

```typescript
// Import schemas from organized structure
import { registerSchema, loginSchema } from '../utils/validation';

// Use in routes
router.post('/register', validate(registerSchema), AuthController.register);
router.post('/login', validate(loginSchema), AuthController.login);
```

For detailed documentation, see [docs/VALIDATION_SCHEMAS.md](docs/VALIDATION_SCHEMAS.md).

## 🔐 Authentication & Authorization

### JWT Token Flow

1. **Register/Login** to get access and refresh tokens
2. **Use access token** in Authorization header: `Bearer <token>`
3. **Refresh tokens** when access token expires
4. **Logout** to invalidate refresh tokens

### RBAC System

The system uses a three-tier permission system:

1. **Permissions**: Granular actions (e.g., `user.read`, `file.upload`)
2. **Roles**: Collections of permissions (e.g., `admin`, `user`, `manager`)
3. **Users**: Assigned one or more roles

### Default Roles

- **Admin**: Full access to all features
- **Manager**: Limited administrative access
- **User**: Basic file and profile access

## 📁 File Upload System

### Storage

Files are stored locally on the server disk in the configured upload directory.

### Configuration

Configure the upload directory in your environment variables:
```env
UPLOAD_DIR=./uploads
MAX_FILE_SIZE=10485760
```



## 📝 Available Scripts

```bash
# Development
npm run dev          # Start development server with nodemon and .env.development
npm run dev:prod     # Start development server with nodemon and production env
npm run build        # Build for production
npm run start        # Start production server
npm run start:dev    # Start with development environment
npm run start:prod   # Start with production environment

# PM2 Process Management
npm run pm2:start    # Start with PM2 (development)
npm run pm2:start:prod # Start with PM2 (production)
npm run pm2:stop     # Stop PM2 processes
npm run pm2:restart  # Restart PM2 processes
npm run pm2:reload   # Zero-downtime reload
npm run pm2:logs     # View PM2 logs
npm run pm2:monit    # Monitor PM2 processes

# Code Quality
npm run lint         # Run ESLint
npm run lint:fix     # Fix ESLint errors
npm run format       # Format code with Prettier



# Database
npm run seed         # Seed database with initial data
```

## 🔧 Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NODE_ENV` | Environment mode | `development` |
| `PORT` | Server port | `4000` |
| `MONGO_URI` | MongoDB connection string | Required |
| `JWT_ACCESS_SECRET` | JWT access token secret | Required |
| `JWT_REFRESH_SECRET` | JWT refresh token secret | Required |
| `UPLOAD_DIR` | Upload directory | `./uploads` |
| `CORS_ORIGIN` | CORS allowed origin | `http://localhost:5173` |
| `DEFAULT_LANGUAGE` | Default language for responses | `en` |

See `env.example` for all available options.

### Environment Files

The project includes pre-configured environment files:

- **`.env.development`** - Optimized for local development
  - Debug logging level
  - Relaxed rate limiting (1000 requests per window)
  - Database seeding enabled
  - Local CORS origins

- **`.env.production`** - Optimized for production deployment
  - Warning logging level
  - Strict rate limiting (50 requests per window)
  - Secure cookie settings
  - HTTPS CORS origins
  - Database seeding disabled

## 🏗️ Project Structure

```
src/
├── app.ts                 # Express app setup
├── server.ts              # Server entry point
├── config/                # Configuration files
├── db/                    # Database connection and seeding
├── models/                # Mongoose models
├── middleware/            # Express middleware
├── services/              # Business logic
├── controllers/           # Route controllers
├── routes/                # API routes
├── utils/                 # Utility functions
│   └── validation/       # Organized validation schemas
│       ├── index.ts      # Main export file
│       ├── common.schema.ts # Common validation patterns
│       ├── auth.schema.ts   # Authentication schemas
│       ├── user.schema.ts   # User management schemas
│       ├── role.schema.ts   # Role management schemas
│       ├── permission.schema.ts # Permission schemas
│       ├── file.schema.ts   # File management schemas
│       └── export.schema.ts # Export functionality schemas
└── types/                 # TypeScript type definitions
```

## 🔒 Security Features

- **Helmet**: Security headers
- **CORS**: Cross-origin resource sharing
- **Rate Limiting**: Request throttling
- **JWT**: Secure token-based authentication
- **Password Hashing**: bcrypt for password security
- **Input Validation**: Organized Zod schema validation with reusable patterns
- **SQL Injection Protection**: Mongoose ODM
- **XSS Protection**: Helmet middleware

## 🚀 Deployment

### PM2 Production Deployment

The application includes PM2 configuration for production deployment with process management, monitoring, and zero-downtime reloads.

#### Quick Start with PM2

```bash
# Install PM2 globally
npm install -g pm2

# Build the application
npm run build

# Start with PM2 in production mode
npm run pm2:start:prod

# Setup PM2 to start on system boot
pm2 save
pm2 startup
```

#### PM2 Configuration

The application uses `ecosystem.config.js` for PM2 configuration with:

- **Cluster Mode**: Uses all available CPU cores for load balancing
- **Auto Restart**: Restarts on crashes or memory limits
- **Logging**: Comprehensive logging to `logs/` directory
- **Health Checks**: Built-in health monitoring
- **Zero-Downtime Reloads**: Seamless deployments

#### PM2 Management

```bash
# Process management
npm run pm2:status     # Check process status
npm run pm2:logs       # View logs
npm run pm2:monit      # Interactive monitoring
npm run pm2:reload     # Zero-downtime reload

# Advanced commands
pm2 show ecommerce-backend    # Show detailed info
pm2 describe ecommerce-backend # Show configuration
```

For detailed PM2 deployment guide, see [docs/PM2_DEPLOYMENT.md](docs/PM2_DEPLOYMENT.md).

### Production Checklist

1. **Environment Variables**
   - Set `NODE_ENV=production`
   - Use strong JWT secrets
   - Configure production MongoDB URI
   - Set appropriate CORS origins

2. **Security**
   - Enable HTTPS
   - Set secure cookie options
   - Configure proper rate limits
   - Use environment-specific secrets

3. **Monitoring**
   - Set up logging aggregation
   - Configure health checks
   - Monitor database connections
   - Set up error tracking

### Deployment Options

- **Heroku**: Configure buildpacks
- **AWS**: Use ECS or EC2
- **Vercel**: Configure for Node.js
- **Railway**: Direct deployment

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes following the established patterns
4. Ensure code quality standards are met (linting, formatting)
5. Add tests if applicable
6. Update documentation if needed
7. Submit a pull request

### Development Guidelines

- **Validation Schemas**: Follow the established schema organization in `src/utils/validation/`
- **Code Style**: Use ESLint and Prettier for consistent formatting
- **Documentation**: Update relevant documentation files
- **Testing**: Add tests for new features or changes

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Issues**: Create a GitHub issue
- **Documentation**: Check the API endpoints for usage
- **Examples**: See the API documentation for usage examples
- **Validation Schemas**: See [docs/VALIDATION_SCHEMAS.md](docs/VALIDATION_SCHEMAS.md) for schema organization
- **PM2 Deployment**: See [docs/PM2_DEPLOYMENT.md](docs/PM2_DEPLOYMENT.md) for deployment guide

## 🔄 Changelog

### v1.1.0
- **Validation Schema Refactoring**: Organized Zod schemas following Single Responsibility Principle
- **Common Validation Patterns**: Centralized reusable validation patterns
- **Schema Organization**: Domain-specific schema files with clear separation of concerns
- **Code Quality**: Reduced duplication and improved maintainability
- **Documentation**: Comprehensive validation schema documentation

### v1.0.0
- Initial release
- Complete authentication system
- RBAC implementation
- File upload system
- API documentation
