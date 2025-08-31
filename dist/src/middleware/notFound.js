"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.notFound = void 0;
const error_1 = require("./error");
const notFound = (req, res, next) => {
    next(new error_1.ApiError(404, 'not_found'));
};
exports.notFound = notFound;
//# sourceMappingURL=notFound.js.map