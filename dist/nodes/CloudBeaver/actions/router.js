"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = router;
const createAuthProvider_1 = require("../transport/auth/createAuthProvider");
const transport_1 = require("../transport");
const database = __importStar(require("./database/Database.resource"));
async function router() {
    const inputItems = this.getInputData();
    const returnData = [];
    const credentials = await this.getCredentials('cloudBeaverApi');
    const serverUrl = String(credentials.serverUrl).replace(/\/$/, '');
    const authProvider = (0, createAuthProvider_1.createAuthProvider)(credentials);
    await (0, transport_1.withSession)(this, serverUrl, authProvider, async (sessionCookie) => {
        const request = async ({ query, variables, operationName, }) => {
            const response = await transport_1.cloudbeaverRequest.call(this, serverUrl, {
                query,
                variables,
                ...(operationName ? { operationName } : {}),
            }, sessionCookie);
            return response;
        };
        const results = await database.executeQuery.execute.call(this, request, inputItems);
        returnData.push(...results);
    });
    return [returnData];
}
//# sourceMappingURL=router.js.map