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
exports.CloudBeaver = void 0;
const n8n_workflow_1 = require("n8n-workflow");
const router_1 = require("./actions/router");
const database = __importStar(require("./actions/database/Database.resource"));
const methods_1 = require("./methods");
class CloudBeaver {
    constructor() {
        this.description = {
            displayName: 'CloudBeaver',
            name: 'cloudBeaver',
            icon: 'file:cloudbeaver.svg',
            group: ['input'],
            version: 1,
            description: 'Execute SQL queries via CloudBeaver',
            usableAsTool: true,
            defaults: { name: 'CloudBeaver' },
            inputs: [n8n_workflow_1.NodeConnectionTypes.Main],
            outputs: [n8n_workflow_1.NodeConnectionTypes.Main],
            credentials: [
                {
                    name: 'cloudBeaverApi',
                    required: true,
                    testedBy: 'cloudBeaverApiTest',
                },
            ],
            properties: [...database.description],
        };
        this.methods = { credentialTest: methods_1.credentialTest };
    }
    async execute() {
        return await router_1.router.call(this);
    }
}
exports.CloudBeaver = CloudBeaver;
//# sourceMappingURL=CloudBeaver.node.js.map