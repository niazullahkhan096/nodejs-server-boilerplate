"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateJti = exports.generateRandomString = exports.compareToken = exports.hashToken = exports.comparePassword = exports.hashPassword = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const crypto_1 = __importDefault(require("crypto"));
const hashPassword = async (password) => {
    const saltRounds = 12;
    return bcryptjs_1.default.hash(password, saltRounds);
};
exports.hashPassword = hashPassword;
const comparePassword = async (password, hash) => {
    return bcryptjs_1.default.compare(password, hash);
};
exports.comparePassword = comparePassword;
const hashToken = async (token) => {
    const saltRounds = 10;
    return bcryptjs_1.default.hash(token, saltRounds);
};
exports.hashToken = hashToken;
const compareToken = async (token, hash) => {
    return bcryptjs_1.default.compare(token, hash);
};
exports.compareToken = compareToken;
const generateRandomString = (length = 32) => {
    return crypto_1.default.randomBytes(length).toString('hex');
};
exports.generateRandomString = generateRandomString;
const generateJti = () => {
    return crypto_1.default.randomUUID();
};
exports.generateJti = generateJti;
//# sourceMappingURL=crypto.js.map