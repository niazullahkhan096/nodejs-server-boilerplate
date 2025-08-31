"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_controller_1 = require("../controllers/auth.controller");
const auth_1 = require("../middleware/auth");
const validate_1 = require("../middleware/validate");
const validation_1 = require("../utils/validation");
const router = (0, express_1.Router)();
// Routes
router.post('/register', (0, validate_1.validate)(validation_1.registerSchema), auth_controller_1.AuthController.register);
router.post('/login', (0, validate_1.validate)(validation_1.loginSchema), auth_controller_1.AuthController.login);
router.post('/refresh', (0, validate_1.validate)(validation_1.refreshSchema), auth_controller_1.AuthController.refresh);
router.post('/logout', auth_1.authenticate, (0, validate_1.validate)(validation_1.logoutSchema), auth_controller_1.AuthController.logout);
exports.default = router;
//# sourceMappingURL=auth.routes.js.map