"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = require("dotenv");
const mongoose_1 = __importDefault(require("mongoose"));
const config_1 = require("../config");
const Permission_1 = __importDefault(require("../models/Permission"));
const Role_1 = __importDefault(require("../models/Role"));
const User_1 = __importDefault(require("../models/User"));
const logger_1 = __importDefault(require("../utils/logger"));
// Load environment variables
(0, dotenv_1.config)();
const seedDatabase = async () => {
    try {
        // Connect to database
        await mongoose_1.default.connect(config_1.env.MONGO_URI);
        logger_1.default.info('Connected to database for seeding');
        // Check if seeding is allowed
        if (!config_1.env.ALLOW_DB_SEED) {
            logger_1.default.warn('Database seeding is disabled. Set ALLOW_DB_SEED=true to enable.');
            return;
        }
        // Clear existing data (optional - be careful in production)
        if (config_1.env.NODE_ENV === 'development') {
            await Promise.all([
                Permission_1.default.deleteMany({}),
                Role_1.default.deleteMany({}),
                User_1.default.deleteMany({}),
            ]);
            logger_1.default.info('Cleared existing data');
        }
        // Create permissions
        const permissions = [
            // User permissions
            { name: 'user.read', description: 'Read user information' },
            { name: 'user.create', description: 'Create new users' },
            { name: 'user.update', description: 'Update user information' },
            { name: 'user.delete', description: 'Delete users' },
            // Role permissions
            { name: 'role.read', description: 'Read role information' },
            { name: 'role.create', description: 'Create new roles' },
            { name: 'role.update', description: 'Update role information' },
            { name: 'role.delete', description: 'Delete roles' },
            // Permission permissions
            { name: 'permission.read', description: 'Read permission information' },
            { name: 'permission.create', description: 'Create new permissions' },
            { name: 'permission.delete', description: 'Delete permissions' },
            // File permissions
            { name: 'file.upload', description: 'Upload files' },
            { name: 'file.read', description: 'Read/download files' },
            { name: 'file.delete', description: 'Delete files' },
        ];
        const createdPermissions = await Permission_1.default.insertMany(permissions);
        logger_1.default.info(`Created ${createdPermissions.length} permissions`);
        // Create roles
        const adminPermissions = createdPermissions.map(p => p._id);
        const managerPermissions = createdPermissions
            .filter(p => !p.name.includes('permission.') && !p.name.includes('role.delete'))
            .map(p => p._id);
        const userPermissions = createdPermissions
            .filter(p => p.name.includes('file.') || p.name === 'user.read' || p.name === 'user.update')
            .map(p => p._id);
        const roles = [
            {
                name: 'admin',
                description: 'Administrator with full access to all features',
                permissions: adminPermissions,
            },
            {
                name: 'manager',
                description: 'Manager with limited administrative access',
                permissions: managerPermissions,
            },
            {
                name: 'user',
                description: 'Regular user with basic file and profile access',
                permissions: userPermissions,
            },
        ];
        const createdRoles = await Role_1.default.insertMany(roles);
        logger_1.default.info(`Created ${createdRoles.length} roles`);
        // Create admin user if credentials are provided
        const adminEmail = config_1.env.ADMIN_EMAIL || 'admin@example.com';
        const adminPassword = config_1.env.ADMIN_PASSWORD || 'admin123456';
        const adminRole = createdRoles.find(r => r.name === 'admin');
        if (adminRole) {
            const existingAdmin = await User_1.default.findOne({ email: adminEmail });
            if (!existingAdmin) {
                const adminUser = await User_1.default.create({
                    email: adminEmail,
                    password: adminPassword,
                    name: 'System Administrator',
                    roles: [adminRole._id],
                });
                logger_1.default.info(`Created admin user: ${adminEmail}`);
                logger_1.default.info(`Admin password: ${adminPassword}`);
                logger_1.default.warn('Please change the admin password after first login!');
            }
            else {
                logger_1.default.info(`Admin user already exists: ${adminEmail}`);
            }
        }
        logger_1.default.info('Database seeding completed successfully');
        process.exit(0);
    }
    catch (error) {
        logger_1.default.error('Error seeding database:', error);
        process.exit(1);
    }
};
// Run seeding if this file is executed directly
if (require.main === module) {
    seedDatabase();
}
//# sourceMappingURL=seed.js.map