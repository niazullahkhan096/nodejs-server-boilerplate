"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const role_controller_1 = require("../controllers/role.controller");
const auth_1 = require("../middleware/auth");
const authorize_1 = require("../middleware/authorize");
const validate_1 = require("../middleware/validate");
const validation_1 = require("../utils/validation");
const router = (0, express_1.Router)();
// Routes
router.post('/', auth_1.authenticate, (0, authorize_1.authorize)(['role.create']), (0, validate_1.validate)(validation_1.createRoleSchema), role_controller_1.RoleController.createRole);
router.get('/', auth_1.authenticate, (0, authorize_1.authorize)(['role.read']), role_controller_1.RoleController.getRoles);
router.get('/:id', auth_1.authenticate, (0, authorize_1.authorize)(['role.read']), (0, validate_1.validate)(validation_1.getRoleSchema), role_controller_1.RoleController.getRoleById);
router.put('/:id', auth_1.authenticate, (0, authorize_1.authorize)(['role.update']), (0, validate_1.validate)(validation_1.updateRoleSchema), role_controller_1.RoleController.updateRole);
router.delete('/:id', auth_1.authenticate, (0, authorize_1.authorize)(['role.delete']), (0, validate_1.validate)(validation_1.getRoleSchema), role_controller_1.RoleController.deleteRole);
exports.default = router;
//# sourceMappingURL=role.routes.js.map