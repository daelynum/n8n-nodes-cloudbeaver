import type { IExecuteFunctions, INodeExecutionData, INodeProperties, JsonObject } from 'n8n-workflow';
import { NodeApiError, NodeOperationError } from 'n8n-workflow';

import type { RequestFn } from '../../helpers/interfaces';
import { quoteIdentifier } from '../../helpers/utils';
import { CloudBeaverClient } from '../../transport/CloudBeaverClient';
import { ExecuteSqlUseCase } from './ExecuteSqlUseCase';

export const description: INodeProperties[] = [
	{
		displayName: 'Command',
		name: 'deleteCommand',
		type: 'options',
		options: [
			{
				name: 'Delete Rows',
				value: 'delete',
				description: 'Delete rows matching the WHERE clause (or all rows if no WHERE)',
			},
			{
				name: 'Truncate Table',
				value: 'truncate',
				description: 'Remove all rows quickly without logging individual deletions',
			},
			{
				name: 'Drop Table',
				value: 'drop',
				description: 'Permanently remove the table and all its data',
			},
		],
		default: 'delete',
		displayOptions: { show: { operation: ['deleteTable'] } },
	},
	{
		displayName: 'WHERE Clause',
		name: 'deleteWhere',
		type: 'string',
		default: '',
		placeholder: 'e.g. ID = \'42\'',
		description: 'Condition to identify which rows to delete. Leave empty to delete all rows.',
		displayOptions: { show: { operation: ['deleteTable'], deleteCommand: ['delete'] } },
	},
	{
		displayName: 'Options',
		name: 'deleteOptions',
		type: 'collection',
		placeholder: 'Add option',
		default: {},
		displayOptions: { show: { operation: ['deleteTable'] } },
		options: [
			{
				displayName: 'Query Timeout',
				name: 'queryTimeout',
				type: 'number',
				default: 60,
				typeOptions: { minValue: 1 },
				description: 'Max number of seconds to wait for query results',
			},
		],
	},
];

export async function execute(
	this: IExecuteFunctions,
	request: RequestFn,
	items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
	const returnData: INodeExecutionData[] = [];
	const client = new CloudBeaverClient(request);
	const useCase = new ExecuteSqlUseCase(client);

	for (let i = 0; i < items.length; i++) {
		const connectionId = this.getNodeParameter('connectionId', i) as string;
		if (!connectionId) {
			throw new NodeOperationError(this.getNode(), 'Connection ID is required', { itemIndex: i });
		}
		const dbType = this.getNodeParameter('dbType', i) as string;
		const schema = (this.getNodeParameter('schema', i) as string).trim();
		const table = (this.getNodeParameter('table', i) as string).trim();
		const deleteCommand = this.getNodeParameter('deleteCommand', i) as string;
		const whereClause = deleteCommand === 'delete'
			? (this.getNodeParameter('deleteWhere', i) as string).trim()
			: '';
		const defaultDatabase = ((this.getNodeParameter('defaultDatabase', i, '') as string).trim()) || undefined;
		const options = this.getNodeParameter('deleteOptions', i, {}) as { queryTimeout?: number };
		const timeoutMs = (options.queryTimeout ?? 60) * 1000;

		if (!table) {
			throw new NodeOperationError(this.getNode(), 'Table name is required', { itemIndex: i });
		}

		const schemaTable = schema
			? `${quoteIdentifier(schema, dbType)}.${quoteIdentifier(table, dbType)}`
			: quoteIdentifier(table, dbType);

		let sql: string;
		if (deleteCommand === 'truncate') {
			sql = `TRUNCATE TABLE ${schemaTable}`;
		} else if (deleteCommand === 'drop') {
			sql = `DROP TABLE ${schemaTable}`;
		} else {
			sql = `DELETE FROM ${schemaTable}`;
			if (whereClause) sql += ` WHERE ${whereClause}`;
		}

		try {
			await useCase.execute({
				connectionId,
				query: sql,
				limit: 1,
				offset: 0,
				timeoutMs,
				defaultDatabase,
			});
			returnData.push({ json: { success: true }, pairedItem: { item: i } });
		} catch (error) {
			if (this.continueOnFail()) {
				returnData.push({ json: { error: (error as Error).message }, pairedItem: { item: i } });
				continue;
			}
			if (error instanceof NodeOperationError) throw error;
			throw new NodeApiError(this.getNode(), error as JsonObject);
		}
	}

	return returnData;
}
