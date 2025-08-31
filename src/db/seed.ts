import { config } from 'dotenv';
import mongoose from 'mongoose';
import { env } from '../config';
import Permission from '../models/Permission';
import Role from '../models/Role';
import User from '../models/User';
import logger from '../utils/logger';

// Load environment variables
config();

const seedDatabase = async (): Promise<void> => {
  try {
    // Connect to database
    await mongoose.connect(env.MONGO_URI);
    logger.info('Connected to database for seeding');

    // Check if seeding is allowed
    if (!env.ALLOW_DB_SEED) {
      logger.warn('Database seeding is disabled. Set ALLOW_DB_SEED=true to enable.');
      return;
    }

    // Clear existing data (optional - be careful in production)
    if (env.NODE_ENV === 'development') {
      await Promise.all([
        Permission.deleteMany({}),
        Role.deleteMany({}),
        User.deleteMany({}),
      ]);
      logger.info('Cleared existing data');
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

    const createdPermissions = await Permission.insertMany(permissions);
    logger.info(`Created ${createdPermissions.length} permissions`);

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

    const createdRoles = await Role.insertMany(roles);
    logger.info(`Created ${createdRoles.length} roles`);

    // Create admin user if credentials are provided
    const adminEmail = env.ADMIN_EMAIL || 'admin@example.com';
    const adminPassword = env.ADMIN_PASSWORD || 'admin123456';
    const adminRole = createdRoles.find(r => r.name === 'admin');

    if (adminRole) {
      const existingAdmin = await User.findOne({ email: adminEmail });
      
      if (!existingAdmin) {
        const adminUser = await User.create({
          email: adminEmail,
          password: adminPassword,
          name: 'System Administrator',
          roles: [adminRole._id],
        });

        logger.info(`Created admin user: ${adminEmail}`);
        logger.info(`Admin password: ${adminPassword}`);
        logger.warn('Please change the admin password after first login!');
      } else {
        logger.info(`Admin user already exists: ${adminEmail}`);
      }
    }

    logger.info('Database seeding completed successfully');
    process.exit(0);

  } catch (error) {
    logger.error('Error seeding database:', error);
    process.exit(1);
  }
};

// Run seeding if this file is executed directly
if (require.main === module) {
  seedDatabase();
}
