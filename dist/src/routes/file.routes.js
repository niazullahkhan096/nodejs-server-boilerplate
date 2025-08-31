"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const multer_1 = __importDefault(require("multer"));
const file_controller_1 = require("../controllers/file.controller");
const auth_1 = require("../middleware/auth");
const authorize_1 = require("../middleware/authorize");
const validate_1 = require("../middleware/validate");
const config_1 = require("../config");
const validation_1 = require("../utils/validation");
const router = (0, express_1.Router)();
// Multer configuration
const storage = multer_1.default.memoryStorage();
const upload = (0, multer_1.default)({
    storage,
    limits: {
        fileSize: config_1.env.MAX_FILE_SIZE,
    },
    fileFilter: (req, file, cb) => {
        // Allow all file types for now, you can add restrictions here
        cb(null, true);
    },
});
// Routes
router.post('/upload', auth_1.authenticate, (0, authorize_1.authorize)(['file.upload']), upload.single('file'), file_controller_1.FileController.uploadFile);
router.get('/', auth_1.authenticate, (0, authorize_1.authorize)(['file.read']), (0, validate_1.validate)(validation_1.getUserFilesSchema), file_controller_1.FileController.getUserFiles);
router.get('/:id', auth_1.authenticate, (0, authorize_1.authorize)(['file.read']), (0, validate_1.validate)(validation_1.getFileSchema), file_controller_1.FileController.getFileInfo);
router.get('/:id/download', auth_1.authenticate, (0, authorize_1.authorize)(['file.read']), (0, validate_1.validate)(validation_1.getFileSchema), file_controller_1.FileController.downloadFile);
router.delete('/:id', auth_1.authenticate, (0, authorize_1.authorize)(['file.delete']), (0, validate_1.validate)(validation_1.getFileSchema), file_controller_1.FileController.deleteFile);
exports.default = router;
//# sourceMappingURL=file.routes.js.map