"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.specs = void 0;
const swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
const config_1 = require("../config");
const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Node.js Server Boilerplate API',
            version: '1.0.0',
            description: 'A production-ready Node.js 20 + TypeScript 5 server boilerplate with Express, Mongoose, JWT auth, RBAC, and file uploads',
            contact: {
                name: 'API Support',
                email: 'support@example.com',
            },
            license: {
                name: 'MIT',
                url: 'https://opensource.org/licenses/MIT',
            },
        },
        servers: [
            {
                url: `http://localhost:${config_1.env.PORT}`,
                description: 'Development server',
            },
            {
                url: 'https://api.example.com',
                description: 'Production server',
            },
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                    description: 'Enter your JWT access token',
                },
            },
            schemas: {
                Error: {
                    type: 'object',
                    properties: {
                        success: {
                            type: 'boolean',
                            example: false,
                        },
                        message: {
                            type: 'string',
                            example: 'Error message',
                        },
                        errors: {
                            type: 'object',
                            additionalProperties: {
                                type: 'array',
                                items: {
                                    type: 'string',
                                },
                            },
                        },
                        traceId: {
                            type: 'string',
                            example: 'req-id-123',
                        },
                    },
                },
                Success: {
                    type: 'object',
                    properties: {
                        success: {
                            type: 'boolean',
                            example: true,
                        },
                        message: {
                            type: 'string',
                            example: 'Success message',
                        },
                        data: {
                            type: 'object',
                        },
                    },
                },
                User: {
                    type: 'object',
                    properties: {
                        id: {
                            type: 'string',
                            example: '507f1f77bcf86cd799439011',
                        },
                        email: {
                            type: 'string',
                            format: 'email',
                            example: 'user@example.com',
                        },
                        name: {
                            type: 'string',
                            example: 'John Doe',
                        },
                        roles: {
                            type: 'array',
                            items: {
                                type: 'object',
                                properties: {
                                    id: {
                                        type: 'string',
                                    },
                                    name: {
                                        type: 'string',
                                    },
                                    permissions: {
                                        type: 'array',
                                        items: {
                                            type: 'object',
                                            properties: {
                                                id: {
                                                    type: 'string',
                                                },
                                                name: {
                                                    type: 'string',
                                                },
                                            },
                                        },
                                    },
                                },
                            },
                        },
                        isActive: {
                            type: 'boolean',
                            example: true,
                        },
                        createdAt: {
                            type: 'string',
                            format: 'date-time',
                        },
                        updatedAt: {
                            type: 'string',
                            format: 'date-time',
                        },
                    },
                },
                Role: {
                    type: 'object',
                    properties: {
                        id: {
                            type: 'string',
                            example: '507f1f77bcf86cd799439011',
                        },
                        name: {
                            type: 'string',
                            example: 'admin',
                        },
                        description: {
                            type: 'string',
                            example: 'Administrator role with full access',
                        },
                        permissions: {
                            type: 'array',
                            items: {
                                type: 'object',
                                properties: {
                                    id: {
                                        type: 'string',
                                    },
                                    name: {
                                        type: 'string',
                                    },
                                    description: {
                                        type: 'string',
                                    },
                                },
                            },
                        },
                        createdAt: {
                            type: 'string',
                            format: 'date-time',
                        },
                        updatedAt: {
                            type: 'string',
                            format: 'date-time',
                        },
                    },
                },
                Permission: {
                    type: 'object',
                    properties: {
                        id: {
                            type: 'string',
                            example: '507f1f77bcf86cd799439011',
                        },
                        name: {
                            type: 'string',
                            example: 'user.read',
                        },
                        description: {
                            type: 'string',
                            example: 'Read user information',
                        },
                        createdAt: {
                            type: 'string',
                            format: 'date-time',
                        },
                        updatedAt: {
                            type: 'string',
                            format: 'date-time',
                        },
                    },
                },
                FileObject: {
                    type: 'object',
                    properties: {
                        id: {
                            type: 'string',
                            example: '507f1f77bcf86cd799439011',
                        },
                        key: {
                            type: 'string',
                            example: '1703123456789-abc123-def456-document.pdf',
                        },
                        originalName: {
                            type: 'string',
                            example: 'document.pdf',
                        },
                        mimeType: {
                            type: 'string',
                            example: 'application/pdf',
                        },
                        size: {
                            type: 'number',
                            example: 1024000,
                        },
                        owner: {
                            type: 'object',
                            properties: {
                                id: {
                                    type: 'string',
                                },
                                name: {
                                    type: 'string',
                                },
                            },
                        },
                        createdAt: {
                            type: 'string',
                            format: 'date-time',
                        },
                    },
                },
            },
        },
        tags: [
            {
                name: 'Auth',
                description: 'Authentication endpoints',
            },
            {
                name: 'Users',
                description: 'User management endpoints',
            },
            {
                name: 'Roles',
                description: 'Role management endpoints',
            },
            {
                name: 'Permissions',
                description: 'Permission management endpoints',
            },
            {
                name: 'Files',
                description: 'File upload and management endpoints',
            },
            {
                name: 'Health',
                description: 'Health check endpoints',
            },
        ],
    },
    apis: ['./src/routes/*.ts', './src/controllers/*.ts'],
};
exports.specs = (0, swagger_jsdoc_1.default)(options);
//# sourceMappingURL=swagger.js.map