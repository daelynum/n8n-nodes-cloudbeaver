"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cloudBeaverApiTest = cloudBeaverApiTest;
const createAuthProvider_1 = require("../transport/auth/createAuthProvider");
const queries_1 = require("../queries");
async function cloudBeaverApiTest(credential) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j;
    const raw = (_a = credential.data) !== null && _a !== void 0 ? _a : {};
    const data = {
        serverUrl: String((_b = raw.serverUrl) !== null && _b !== void 0 ? _b : ''),
        authType: String((_c = raw.authType) !== null && _c !== void 0 ? _c : ''),
        token: String((_d = raw.token) !== null && _d !== void 0 ? _d : ''),
        user: String((_e = raw.user) !== null && _e !== void 0 ? _e : ''),
        password: String((_f = raw.password) !== null && _f !== void 0 ? _f : ''),
    };
    const url = `${data.serverUrl.replace(/\/$/, '')}/api/gql`;
    try {
        const authProvider = (0, createAuthProvider_1.createAuthProvider)(data);
        const { provider, credentials: authCredentials } = authProvider.getPayload();
        const loginResponse = await this.helpers.request({
            method: 'POST',
            uri: url,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                query: queries_1.AUTH_LOGIN.query,
                operationName: queries_1.AUTH_LOGIN.operationName,
                variables: { provider, credentials: authCredentials },
            }),
            json: true,
            resolveWithFullResponse: true,
        });
        const body = loginResponse.body;
        const authStatus = (_h = (_g = body.data) === null || _g === void 0 ? void 0 : _g.authLogin) === null || _h === void 0 ? void 0 : _h.authStatus;
        if (authStatus !== 'SUCCESS') {
            return { status: 'Error', message: 'Authentication failed' };
        }
        const setCookie = (_j = loginResponse.headers) === null || _j === void 0 ? void 0 : _j['set-cookie'];
        const cookies = Array.isArray(setCookie) ? setCookie : setCookie ? [setCookie] : [];
        const sessionCookie = cookies
            .map((c) => c.split(';')[0])
            .find((c) => c.startsWith('cb-session-id='));
        if (sessionCookie) {
            try {
                await this.helpers.request({
                    method: 'POST',
                    uri: url,
                    headers: { 'Content-Type': 'application/json', Cookie: sessionCookie },
                    body: JSON.stringify({
                        query: queries_1.CLOSE_SESSION.query,
                        operationName: queries_1.CLOSE_SESSION.operationName,
                    }),
                    json: true,
                });
            }
            catch {
            }
        }
        return { status: 'OK', message: 'Connection successful' };
    }
    catch (error) {
        return { status: 'Error', message: error.message };
    }
}
//# sourceMappingURL=credentialTest.js.map