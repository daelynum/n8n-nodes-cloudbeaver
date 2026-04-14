"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createSession = createSession;
exports.cloudbeaverRequest = cloudbeaverRequest;
exports.withSession = withSession;
const n8n_workflow_1 = require("n8n-workflow");
const queries_1 = require("../queries");
async function createSession(serverUrl, authProvider) {
    var _a, _b;
    const { provider, credentials } = authProvider.getPayload();
    const response = await this.helpers.httpRequest({
        method: 'POST',
        url: `${serverUrl}/api/gql`,
        headers: { 'Content-Type': 'application/json' },
        body: {
            query: queries_1.AUTH_LOGIN.query,
            operationName: queries_1.AUTH_LOGIN.operationName,
            variables: { provider, credentials },
        },
        json: true,
        returnFullResponse: true,
    });
    const body = response.body;
    const authStatus = (_b = (_a = body.data) === null || _a === void 0 ? void 0 : _a.authLogin) === null || _b === void 0 ? void 0 : _b.authStatus;
    if (authStatus !== 'SUCCESS') {
        throw new n8n_workflow_1.NodeOperationError(this.getNode(), 'CloudBeaver authentication failed');
    }
    const setCookie = response.headers['set-cookie'];
    if (!setCookie) {
        throw new n8n_workflow_1.NodeOperationError(this.getNode(), 'No session cookie received from CloudBeaver');
    }
    const cookies = Array.isArray(setCookie) ? setCookie : [setCookie];
    const cookiePairs = cookies.map((c) => c.split(';')[0]);
    const sessionCookie = cookiePairs.find((c) => c.startsWith('cb-session-id='));
    if (!sessionCookie) {
        throw new n8n_workflow_1.NodeOperationError(this.getNode(), 'No cb-session-id received from CloudBeaver');
    }
    return sessionCookie;
}
async function cloudbeaverRequest(serverUrl, body, sessionCookie) {
    const response = await this.helpers.httpRequest({
        method: 'POST',
        url: `${serverUrl}/api/gql`,
        headers: {
            'Content-Type': 'application/json',
            Cookie: sessionCookie,
        },
        body,
        json: true,
    });
    return response;
}
async function withSession(ctx, serverUrl, authProvider, fn) {
    const sessionCookie = await createSession.call(ctx, serverUrl, authProvider);
    try {
        return await fn(sessionCookie);
    }
    finally {
        try {
            await cloudbeaverRequest.call(ctx, serverUrl, { query: queries_1.CLOSE_SESSION.query, operationName: queries_1.CLOSE_SESSION.operationName }, sessionCookie);
        }
        catch {
        }
    }
}
//# sourceMappingURL=index.js.map