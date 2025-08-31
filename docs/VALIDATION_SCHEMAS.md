# Validation Schema Organization

This document describes the organization and structure of validation schemas in the application, following the Single Responsibility Principle.

## 📁 Schema Organization

### Directory Structure

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

## 🏗️ Schema Architecture

### 1. Common Schema Patterns (`common.schema.ts`)

Centralized validation patterns that can be reused across all schemas:

```typescript
export const commonSchemas = {
  // String validations
  email: z.string().email('Invalid email format'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  passwordRequired: z.string().min(1, 'Password is required'),
  name: z.string().min(2, 'Name must be at least 2 characters').max(100, 'Name too long'),
  description: z.string().max(500, 'Description too long').optional(),
  
  // Required string validations
  requiredString: z.string().min(1, 'This field is required'),
  optionalString: z.string().optional(),
  
  // ID validations
  objectId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid ID format'),
  
  // Pagination validations
  page: z.string().transform(val => parseInt(val, 10)).pipe(z.number().min(1)).optional(),
  limit: z.string().transform(val => parseInt(val, 10)).pipe(z.number().min(1).max(100)).optional(),
  
  // Boolean transformations
  booleanString: z.string().transform(val => val === 'true').optional(),
  
  // Date validations
  dateString: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'),
} as const;
```

### 2. Domain-Specific Schemas

Each domain has its own schema file containing related validations:

#### Authentication Schemas (`auth.schema.ts`)
- `registerSchema` - User registration validation
- `loginSchema` - User login validation
- `refreshSchema` - Token refresh validation
- `logoutSchema` - User logout validation

#### User Management Schemas (`user.schema.ts`)
- `createUserSchema` - Create user validation
- `updateUserSchema` - Update user validation
- `getUserSchema` - Get single user validation
- `getUsersSchema` - Get users list validation

#### Role Management Schemas (`role.schema.ts`)
- `createRoleSchema` - Create role validation
- `updateRoleSchema` - Update role validation
- `getRoleSchema` - Get role validation

#### Permission Management Schemas (`permission.schema.ts`)
- `createPermissionSchema` - Create permission validation
- `updatePermissionSchema` - Update permission validation
- `getPermissionSchema` - Get permission validation

#### File Management Schemas (`file.schema.ts`)
- `getFileSchema` - Get file validation
- `getUserFilesSchema` - Get user files validation

#### Export Schemas (`export.schema.ts`)
- `exportUsersSchema` - Export users validation
- `exportStatsSchema` - Export statistics validation

## 🔄 Usage in Routes

### Before Refactoring

```typescript
// In route files - schemas defined inline
import { z } from 'zod';

const registerSchema = z.object({
  body: z.object({
    email: z.string().email('Invalid email format'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    name: z.string().min(2, 'Name must be at least 2 characters').max(100, 'Name too long'),
  }),
});

router.post('/register', validate(registerSchema), AuthController.register);
```

### After Refactoring

```typescript
// In route files - schemas imported from dedicated files
import { registerSchema } from '../utils/validation';

router.post('/register', validate(registerSchema), AuthController.register);
```

## ✅ Benefits of This Organization

### 1. **Single Responsibility Principle**
- Each schema file has a single responsibility (domain-specific validation)
- Common patterns are centralized and reusable
- Clear separation of concerns

### 2. **Maintainability**
- Easy to find and modify validation rules
- Consistent validation patterns across the application
- Reduced code duplication

### 3. **Reusability**
- Common validation patterns can be reused across schemas
- Easy to extend and add new validation rules
- Consistent error messages

### 4. **Type Safety**
- All schemas are properly typed with TypeScript
- IntelliSense support for schema properties
- Compile-time validation

### 5. **Testing**
- Schemas can be tested independently
- Easy to mock and test validation logic
- Clear test boundaries

## 🛠️ Adding New Schemas

### 1. For New Domains

Create a new schema file following the naming convention:

```typescript
// src/utils/validation/new-domain.schema.ts
import { z } from 'zod';
import { commonSchemas } from './common.schema';

export const createNewDomainSchema = z.object({
  body: z.object({
    name: commonSchemas.name,
    description: commonSchemas.description,
    // ... other fields
  }),
});
```

### 2. For New Common Patterns

Add to `common.schema.ts`:

```typescript
export const commonSchemas = {
  // ... existing patterns
  newPattern: z.string().min(1, 'New pattern validation'),
} as const;
```

### 3. Update Index File

Add export to `index.ts`:

```typescript
export * from './new-domain.schema';
```

## 📋 Validation Patterns

### Common Patterns Used

1. **String Validations**
   - Email format validation
   - Password strength validation
   - Name length validation
   - Required/optional string validation

2. **ID Validations**
   - MongoDB ObjectId format validation
   - UUID format validation (if needed)

3. **Pagination Validations**
   - Page number validation
   - Limit validation with min/max bounds
   - Search string validation

4. **Date Validations**
   - ISO date format validation
   - Date range validation

5. **Boolean Transformations**
   - String to boolean conversion
   - Optional boolean validation

## 🔍 Best Practices

### 1. **Use Common Patterns**
Always use common patterns when possible to maintain consistency:

```typescript
// ✅ Good - Using common pattern
name: commonSchemas.name

// ❌ Bad - Duplicating validation logic
name: z.string().min(2, 'Name must be at least 2 characters').max(100, 'Name too long')
```

### 2. **Consistent Error Messages**
Use consistent error message patterns:

```typescript
// ✅ Good - Consistent error message
email: z.string().email('Invalid email format')

// ❌ Bad - Inconsistent error message
email: z.string().email('Please provide a valid email')
```

### 3. **Proper Type Annotations**
Always use proper TypeScript types:

```typescript
// ✅ Good - Proper type annotation
export const schema: z.ZodSchema = z.object({...})

// ❌ Bad - Missing type annotation
export const schema = z.object({...})
```

### 4. **Documentation**
Add JSDoc comments for complex schemas:

```typescript
/**
 * Schema for user registration
 * Validates email, password, and name fields
 */
export const registerSchema = z.object({
  body: z.object({
    email: commonSchemas.email,
    password: commonSchemas.password,
    name: commonSchemas.name,
  }),
});
```

## 🚀 Migration Guide

If you're migrating from inline schemas to this organization:

1. **Identify Schema Duplication**
   - Look for repeated validation patterns
   - Extract common patterns to `common.schema.ts`

2. **Group Related Schemas**
   - Move schemas to appropriate domain files
   - Update imports in route files

3. **Update Route Files**
   - Remove inline schema definitions
   - Import schemas from validation files

4. **Test Thoroughly**
   - Ensure all validations still work
   - Check error messages are consistent
   - Verify TypeScript compilation

## 📚 Related Documentation

- [API Response Format](./API_RESPONSE_FORMAT.md)
- [Middleware Documentation](./MIDDLEWARE.md)
- [Error Handling](./ERROR_HANDLING.md)
