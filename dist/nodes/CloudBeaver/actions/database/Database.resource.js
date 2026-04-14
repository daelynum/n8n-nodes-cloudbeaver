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
exports.description = exports.executeQuery = void 0;
const executeQuery = __importStar(require("./executeQuery.operation"));
exports.executeQuery = executeQuery;
exports.description = [
    {
        displayName: 'Only connections from the Shared project are supported.',
        name: 'sharedProjectNotice',
        type: 'notice',
        default: '',
    },
    {
        displayName: 'Connection ID',
        name: 'connectionId',
        type: 'string',
        default: '',
        required: true,
        description: 'Use the database connection ID in CloudBeaver. Right-click the database in Database Navigator, select Open, and check the ID in the window.',
        placeholder: 'e.g. postgres-jdbc-19d5ca3a223-2f46e1a321049b15',
    },
    {
        displayName: 'SQL Query',
        name: 'query',
        type: 'string',
        typeOptions: { editor: 'sqlEditor' },
        default: '',
        required: true,
        description: 'SQL query to execute',
    },
    {
        displayName: 'Limit',
        name: 'limit',
        type: 'number',
        typeOptions: { minValue: 1 },
        default: 50,
        placeholder: 'e.g. 50',
        description: 'Max number of results to return',
    },
    {
        displayName: 'Offset',
        name: 'offset',
        type: 'number',
        typeOptions: { minValue: 0 },
        default: 0,
        placeholder: 'e.g. 50',
        description: 'Number of results to skip before returning rows',
    },
    {
        displayName: 'Order By',
        name: 'orderBy',
        type: 'string',
        default: '',
        placeholder: 'e.g. name ASC, created_at DESC',
        description: 'Column(s) to sort results by, applied on top of the SQL query',
    },
    {
        displayName: 'Where',
        name: 'where',
        type: 'string',
        default: '',
        placeholder: "e.g. age > 18 AND status = 'active'",
        description: 'Additional WHERE condition applied on top of the SQL query',
    },
    {
        displayName: 'Options',
        name: 'options',
        type: 'collection',
        placeholder: 'Add option',
        default: {},
        options: [
            {
                displayName: 'Query Timeout',
                name: 'queryTimeout',
                type: 'number',
                default: 60,
                typeOptions: { minValue: 1 },
                description: 'Max number of seconds to wait for query results',
            },
            {
                displayName: 'Replace Empty Strings with NULL',
                name: 'replaceEmptyStrings',
                type: 'boolean',
                default: false,
                description: 'Whether to replace empty strings with NULL in the query results',
            },
        ],
    },
];
//# sourceMappingURL=Database.resource.js.map