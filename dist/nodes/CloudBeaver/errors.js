"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TimeoutError = exports.ContextError = exports.QueryError = exports.CloudBeaverError = void 0;
const n8n_workflow_1 = require("n8n-workflow");
class CloudBeaverError extends n8n_workflow_1.OperationalError {
}
exports.CloudBeaverError = CloudBeaverError;
class QueryError extends CloudBeaverError {
}
exports.QueryError = QueryError;
class ContextError extends CloudBeaverError {
}
exports.ContextError = ContextError;
class TimeoutError extends CloudBeaverError {
}
exports.TimeoutError = TimeoutError;
//# sourceMappingURL=errors.js.map