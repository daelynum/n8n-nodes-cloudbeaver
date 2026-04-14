"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TokenAuthProvider = void 0;
class TokenAuthProvider {
    constructor(token) {
        this.token = token;
    }
    getPayload() {
        return {
            provider: 'token',
            credentials: { token: this.token },
        };
    }
}
exports.TokenAuthProvider = TokenAuthProvider;
//# sourceMappingURL=TokenAuthProvider.js.map