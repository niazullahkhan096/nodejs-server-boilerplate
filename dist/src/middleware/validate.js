"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validate = void 0;
const zod_1 = require("zod");
const error_1 = require("./error");
const httpStatus_1 = require("../utils/httpStatus");
const validate = (schema) => {
    return async (req, res, next) => {
        try {
            await schema.parseAsync({
                body: req.body,
                query: req.query,
                params: req.params,
            });
            next();
        }
        catch (error) {
            if (error instanceof zod_1.ZodError) {
                const details = error.errors.reduce((acc, curr) => {
                    const field = curr.path.join('.');
                    if (!acc[field])
                        acc[field] = [];
                    acc[field].push(curr.message);
                    return acc;
                }, {});
                next(new error_1.ApiError(httpStatus_1.httpStatus.BAD_REQUEST, 'Validation Error', details));
            }
            else {
                next(error);
            }
        }
    };
};
exports.validate = validate;
//# sourceMappingURL=validate.js.map