"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CloudBeaverClient = void 0;
const queries_1 = require("../queries");
const errors_1 = require("../errors");
function unwrap(response, errorFactory, fallback) {
    var _a, _b;
    if ((_a = response.errors) === null || _a === void 0 ? void 0 : _a.length) {
        throw errorFactory((_b = response.errors[0].message) !== null && _b !== void 0 ? _b : fallback);
    }
    if (response.data === undefined) {
        throw errorFactory(fallback);
    }
    return response.data;
}
class CloudBeaverClient {
    constructor(request) {
        this.request = request;
    }
    async initConnection(connectionId, projectId) {
        const response = await this.request({
            ...queries_1.INIT_CONNECTION,
            variables: { id: connectionId, projectId },
        });
        unwrap(response, (msg) => new errors_1.QueryError(msg), 'Failed to initialize connection');
    }
    async createContext(connectionId, projectId) {
        var _a;
        const response = await this.request({
            ...queries_1.SQL_CONTEXT_CREATE,
            variables: { connectionId, projectId },
        });
        const data = unwrap(response, (msg) => new errors_1.ContextError(msg), 'Failed to create SQL context');
        const contextId = (_a = data.sqlContextCreate) === null || _a === void 0 ? void 0 : _a.id;
        if (!contextId)
            throw new errors_1.ContextError('CloudBeaver returned no context ID');
        return contextId;
    }
    async executeQuery(params) {
        var _a;
        const response = await this.request({
            ...queries_1.ASYNC_SQL_EXECUTE_QUERY,
            variables: {
                connectionId: params.connectionId,
                contextId: params.contextId,
                sql: params.sql,
                filter: { limit: params.limit, offset: params.offset },
                projectId: params.projectId,
            },
        });
        const data = unwrap(response, (msg) => new errors_1.QueryError(msg), 'Failed to execute query');
        const taskId = (_a = data.asyncSqlExecuteQuery) === null || _a === void 0 ? void 0 : _a.id;
        if (!taskId)
            throw new errors_1.QueryError('CloudBeaver returned no task ID');
        return taskId;
    }
    async pollTask(taskId, timeoutMs = 60000) {
        var _a, _b;
        const initialIntervalMs = 50;
        const maxIntervalMs = 500;
        const deadline = Date.now() + timeoutMs;
        let intervalMs = initialIntervalMs;
        while (Date.now() < deadline) {
            const response = await this.request({
                ...queries_1.ASYNC_TASK_INFO,
                variables: { id: taskId },
            });
            const data = unwrap(response, (msg) => new errors_1.QueryError(msg), 'Failed to fetch task info');
            const task = (_a = data.asyncTaskInfo) !== null && _a !== void 0 ? _a : null;
            if ((_b = task === null || task === void 0 ? void 0 : task.error) === null || _b === void 0 ? void 0 : _b.message) {
                throw new errors_1.QueryError(`Task error: ${task.error.message}`);
            }
            if (task && !task.running)
                return;
            await new Promise((resolve) => { globalThis.setTimeout(resolve, intervalMs); });
            intervalMs = Math.min(intervalMs * 2, maxIntervalMs);
        }
        throw new errors_1.TimeoutError(`Query timed out after ${timeoutMs / 1000}s`);
    }
    async getResults(taskId) {
        var _a;
        const response = await this.request({
            ...queries_1.ASYNC_SQL_EXECUTE_RESULTS,
            variables: { taskId },
        });
        const data = unwrap(response, (msg) => new errors_1.QueryError(msg), 'Failed to fetch results');
        return (_a = data.asyncSqlExecuteResults) !== null && _a !== void 0 ? _a : { results: [] };
    }
    async destroyContext(connectionId, contextId, projectId) {
        try {
            await this.request({
                ...queries_1.SQL_CONTEXT_DESTROY,
                variables: { connectionId, contextId, projectId },
            });
        }
        catch {
        }
    }
}
exports.CloudBeaverClient = CloudBeaverClient;
//# sourceMappingURL=CloudBeaverClient.js.map