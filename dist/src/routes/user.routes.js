"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_controller_1 = require("../controllers/user.controller");
const auth_1 = require("../middleware/auth");
const authorize_1 = require("../middleware/authorize");
const validate_1 = require("../middleware/validate");
const validation_1 = require("../utils/validation");
const router = (0, express_1.Router)();
// Routes
router.post('/', auth_1.authenticate, (0, authorize_1.authorize)(['user.create']), (0, validate_1.validate)(validation_1.createUserSchema), user_controller_1.UserController.createUser);
router.get('/', auth_1.authenticate, (0, authorize_1.authorize)(['user.read']), (0, validate_1.validate)(validation_1.getUsersSchema), user_controller_1.UserController.getUsers);
router.get('/:id', auth_1.authenticate, (0, authorize_1.authorize)(['user.read']), (0, validate_1.validate)(validation_1.getUserSchema), user_controller_1.UserController.getUserById);
router.put('/:id', auth_1.authenticate, (0, authorize_1.authorize)(['user.update']), (0, validate_1.validate)(validation_1.updateUserSchema), user_controller_1.UserController.updateUser);
router.delete('/:id', auth_1.authenticate, (0, authorize_1.authorize)(['user.delete']), (0, validate_1.validate)(validation_1.getUserSchema), user_controller_1.UserController.deleteUser);
exports.default = router;
//# sourceMappingURL=user.routes.js.map