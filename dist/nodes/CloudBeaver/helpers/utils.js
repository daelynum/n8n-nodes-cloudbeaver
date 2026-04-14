"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.transformResults = transformResults;
function transformResults(executeInfo, options = {}) {
    var _a, _b, _c;
    const { replaceEmptyStrings = false } = options;
    const items = [];
    for (const queryResult of (_a = executeInfo.results) !== null && _a !== void 0 ? _a : []) {
        const resultSet = queryResult.resultSet;
        if (!resultSet)
            continue;
        const columns = (_b = resultSet.columns) !== null && _b !== void 0 ? _b : [];
        const rows = (_c = resultSet.rowsWithMetaData) !== null && _c !== void 0 ? _c : [];
        for (const row of rows) {
            const json = {};
            columns.forEach((col, i) => {
                var _a, _b;
                const name = (_a = col.name) !== null && _a !== void 0 ? _a : `col${i}`;
                const value = (_b = row.data[i]) !== null && _b !== void 0 ? _b : null;
                json[name] = replaceEmptyStrings && value === '' ? null : value;
            });
            items.push({ json });
        }
    }
    return items;
}
//# sourceMappingURL=utils.js.map