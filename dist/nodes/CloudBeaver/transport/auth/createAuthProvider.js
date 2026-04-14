"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createAuthProvider = createAuthProvider;
const n8n_workflow_1 = require("n8n-workflow");
const LocalAuthProvider_1 = require("./LocalAuthProvider");
const TokenAuthProvider_1 = require("./TokenAuthProvider");
function createAuthProvider(credentials) {
    const { authType, user, password, token } = credentials;
    switch (authType) {
        case 'local':
            return new LocalAuthProvider_1.LocalAuthProvider(String(user), String(password));
        case 'token':
            return new TokenAuthProvider_1.TokenAuthProvider(String(token));
        default:
            throw new n8n_workflow_1.UserError(`Unsupported auth type: ${String(authType)}`);
    }
}
//# sourceMappingURL=createAuthProvider.js.map