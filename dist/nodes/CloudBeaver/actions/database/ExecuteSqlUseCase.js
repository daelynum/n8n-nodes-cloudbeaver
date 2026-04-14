"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExecuteSqlUseCase = void 0;
const PROJECT_ID = 'g_GlobalConfiguration';
class ExecuteSqlUseCase {
    constructor(client) {
        this.client = client;
    }
    async execute(input) {
        var _a;
        const { connectionId, query, limit, offset, orderBy, where, timeoutMs } = input;
        let sql = query.trim().replace(/;$/, '');
        if (where)
            sql = `SELECT *
		                  FROM (${sql}) AS _q
		                  WHERE ${where}`;
        if (orderBy)
            sql += ` ORDER BY ${orderBy}`;
        await this.client.initConnection(connectionId, PROJECT_ID);
        const contextId = await this.client.createContext(connectionId, PROJECT_ID);
        try {
            const taskId = await this.client.executeQuery({
                connectionId,
                contextId,
                sql,
                limit,
                offset,
                projectId: PROJECT_ID,
            });
            await this.client.pollTask(taskId, timeoutMs);
            const executeInfo = await this.client.getResults(taskId);
            return (_a = executeInfo.results) !== null && _a !== void 0 ? _a : [];
        }
        finally {
            await this.client.destroyContext(connectionId, contextId, PROJECT_ID);
        }
    }
}
exports.ExecuteSqlUseCase = ExecuteSqlUseCase;
//# sourceMappingURL=ExecuteSqlUseCase.js.map