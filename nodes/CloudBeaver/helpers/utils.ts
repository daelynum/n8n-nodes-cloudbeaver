import type { IDataObject, IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import { NodeOperationError } from 'n8n-workflow';

import type { SQLExecuteInfo } from './interfaces';

export function transformResults(
	executeInfo: SQLExecuteInfo,
	options: { replaceEmptyStrings?: boolean } = {},
): INodeExecutionData[] {
	const { replaceEmptyStrings = false } = options;
	const items: INodeExecutionData[] = [];

	for (const queryResult of executeInfo.results ?? []) {
		const resultSet = queryResult.resultSet;
		if (!resultSet) continue;

		const columns = resultSet.columns ?? [];
		const rows = resultSet.rowsWithMetaData ?? [];

		for (const row of rows) {
			const json: IDataObject = {};
			columns.forEach((col, i) => {
				const name = col.name ?? `col${i}`;
				const value = row.data[i] ?? null;
				json[name] = replaceEmptyStrings && value === '' ? null : value;
			});
			items.push({ json });
		}
	}

	return items;
}

export function quoteIdentifier(name: string, dbType: string): string {
	switch (dbType) {
		case 'mysql':
			return '`' + name.replace(/`/g, '``') + '`';
		case 'mssql':
			return '[' + name.replace(/]/g, ']]') + ']';
		default:
			return '"' + name.replace(/"/g, '""') + '"';
	}
}

export function escapeValue(value: string): string {
	return value.replace(/'/g, "''");
}

export type ValueType = 'string' | 'number' | 'boolean' | 'null' | 'raw';

export function validateColumns(
	ctx: IExecuteFunctions,
	columnsData: Array<{ column: unknown }>,
	itemIndex: number,
): void {
	if (!columnsData.length) {
		throw new NodeOperationError(ctx.getNode(), 'At least one column is required', { itemIndex });
	}
	if (columnsData.some((c) => !String(c.column ?? '').trim())) {
		throw new NodeOperationError(ctx.getNode(), 'Column name is required', { itemIndex });
	}
}

export function formatSqlValue(value: unknown, type: ValueType, dbType?: string): string {
	if (type === 'null') {
		return 'NULL';
	}

	const stringValue = String(value ?? '');

	if (type === 'number') {
		if (!/^-?\d+(\.\d+)?([eE][+-]?\d+)?$/.test(stringValue.trim())) {
			throw new Error(`Invalid number value: ${stringValue}`);
		}
		return stringValue.trim();
	}

	if (type === 'boolean') {
		const normalized = stringValue.trim().toLowerCase();
		if (normalized === 'true' || normalized === '1') return dbType === 'mssql' ? '1' : 'TRUE';
		if (normalized === 'false' || normalized === '0') return dbType === 'mssql' ? '0' : 'FALSE';
		throw new Error(`Invalid boolean value: ${stringValue}`);
	}

	if (type === 'raw') {
		if (!stringValue.trim()) {
			throw new Error('Raw SQL value cannot be empty');
		}
		return stringValue;
	}

	return `'${escapeValue(stringValue)}'`;
}
