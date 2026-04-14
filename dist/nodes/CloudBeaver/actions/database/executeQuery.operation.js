"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.execute = execute;
const n8n_workflow_1 = require("n8n-workflow");
const CloudBeaverClient_1 = require("../../transport/CloudBeaverClient");
const errors_1 = require("../../errors");
const utils_1 = require("../../helpers/utils");
const ExecuteSqlUseCase_1 = require("./ExecuteSqlUseCase");
async function execute(request, items) {
    var _a, _b;
    const returnData = [];
    const client = new CloudBeaverClient_1.CloudBeaverClient(request);
    const useCase = new ExecuteSqlUseCase_1.ExecuteSqlUseCase(client);
    for (let i = 0; i < items.length; i++) {
        const connectionId = this.getNodeParameter('connectionId', i);
        const query = this.getNodeParameter('query', i);
        const limit = this.getNodeParameter('limit', i);
        const offset = this.getNodeParameter('offset', i);
        const orderBy = this.getNodeParameter('orderBy', i).trim() || undefined;
        const where = this.getNodeParameter('where', i).trim() || undefined;
        if (!connectionId) {
            throw new n8n_workflow_1.NodeOperationError(this.getNode(), 'Connection ID is required', {
                itemIndex: i,
            });
        }
        if (!(query === null || query === void 0 ? void 0 : query.trim())) {
            throw new n8n_workflow_1.NodeOperationError(this.getNode(), 'SQL query is empty', { itemIndex: i });
        }
        if (!Number.isInteger(limit) || limit < 1) {
            throw new n8n_workflow_1.NodeOperationError(this.getNode(), 'Limit must be a positive integer', {
                itemIndex: i,
            });
        }
        if (!Number.isInteger(offset) || offset < 0) {
            throw new n8n_workflow_1.NodeOperationError(this.getNode(), 'Offset must be a non-negative integer', {
                itemIndex: i,
            });
        }
        const options = this.getNodeParameter('options', i, {});
        const timeoutMs = ((_a = options.queryTimeout) !== null && _a !== void 0 ? _a : 60) * 1000;
        const replaceEmptyStrings = (_b = options.replaceEmptyStrings) !== null && _b !== void 0 ? _b : false;
        try {
            const raw = await useCase.execute({
                connectionId,
                query,
                limit,
                offset,
                orderBy,
                where,
                timeoutMs,
            });
            const rows = (0, utils_1.transformResults)({ results: raw }, { replaceEmptyStrings });
            returnData.push(...rows.map((row) => ({ ...row, pairedItem: { item: i } })));
        }
        catch (error) {
            if (this.continueOnFail()) {
                returnData.push({
                    json: { ...items[i].json, error: error.message },
                    pairedItem: { item: i },
                });
                continue;
            }
            if (error instanceof errors_1.TimeoutError) {
                throw new n8n_workflow_1.NodeOperationError(this.getNode(), error.message, { itemIndex: i });
            }
            if (error instanceof errors_1.QueryError) {
                throw new n8n_workflow_1.NodeApiError(this.getNode(), { message: error.message });
            }
            throw new n8n_workflow_1.NodeApiError(this.getNode(), error);
        }
    }
    return returnData;
}
//# sourceMappingURL=executeQuery.operation.js.map