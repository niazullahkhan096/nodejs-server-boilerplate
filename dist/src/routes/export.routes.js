"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const export_controller_1 = require("../controllers/export.controller");
const auth_1 = require("../middleware/auth");
const authorize_1 = require("../middleware/authorize");
const validate_1 = require("../middleware/validate");
const validation_1 = require("../utils/validation");
const router = (0, express_1.Router)();
// Export users to CSV (requires user.read permission)
router.get('/users/csv', auth_1.authenticate, (0, authorize_1.authorize)(['user.read']), (0, validate_1.validate)(validation_1.exportUsersSchema), export_controller_1.ExportController.exportUsers);
// Get available export fields
router.get('/users/fields', auth_1.authenticate, (0, authorize_1.authorize)(['user.read']), export_controller_1.ExportController.getExportFields);
// Get export statistics
router.get('/users/stats', auth_1.authenticate, (0, authorize_1.authorize)(['user.read']), (0, validate_1.validate)(validation_1.exportStatsSchema), export_controller_1.ExportController.getExportStats);
exports.default = router;
//# sourceMappingURL=export.routes.js.map