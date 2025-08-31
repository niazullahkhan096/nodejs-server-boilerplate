"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const permission_controller_1 = require("../controllers/permission.controller");
const auth_1 = require("../middleware/auth");
const authorize_1 = require("../middleware/authorize");
const validate_1 = require("../middleware/validate");
const validation_1 = require("../utils/validation");
const router = (0, express_1.Router)();
// Routes
router.post('/', auth_1.authenticate, (0, authorize_1.authorize)(['permission.create']), (0, validate_1.validate)(validation_1.createPermissionSchema), permission_controller_1.PermissionController.createPermission);
router.get('/', auth_1.authenticate, (0, authorize_1.authorize)(['permission.read']), permission_controller_1.PermissionController.getPermissions);
router.get('/:id', auth_1.authenticate, (0, authorize_1.authorize)(['permission.read']), (0, validate_1.validate)(validation_1.getPermissionSchema), permission_controller_1.PermissionController.getPermissionById);
router.put('/:id', auth_1.authenticate, (0, authorize_1.authorize)(['permission.update']), (0, validate_1.validate)(validation_1.updatePermissionSchema), permission_controller_1.PermissionController.updatePermission);
router.delete('/:id', auth_1.authenticate, (0, authorize_1.authorize)(['permission.delete']), (0, validate_1.validate)(validation_1.getPermissionSchema), permission_controller_1.PermissionController.deletePermission);
exports.default = router;
//# sourceMappingURL=permission.routes.js.map