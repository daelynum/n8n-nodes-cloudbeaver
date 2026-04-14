"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LocalAuthProvider = void 0;
const crypto_1 = require("crypto");
class LocalAuthProvider {
    constructor(user, password) {
        this.user = user;
        this.password = password;
    }
    getPayload() {
        const password = (0, crypto_1.createHash)('md5').update(this.password).digest('hex').toUpperCase();
        return {
            provider: 'local',
            credentials: {
                user: this.user,
                password,
            },
        };
    }
}
exports.LocalAuthProvider = LocalAuthProvider;
//# sourceMappingURL=LocalAuthProvider.js.map