"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const errorHandler = (err, req, res, next) => {
    const status = res.statusCode ? res.statusCode : 500;
    res.status(status);
    res.json({
        status: "failed",
        code: status,
        message: err.message,
        stack: process.env.NODE_ENV === "production" ? null : err.stack,
    });
};
exports.default = errorHandler;
