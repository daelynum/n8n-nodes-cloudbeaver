import type { IExecuteFunctions, INodeExecutionData, INodeProperties, JsonObject } from 'n8n-workflow';
import { NodeApiError, NodeOperationError } from 'n8n-workflow';

import type { RequestFn } from '../../helpers/interfaces';
import { transformResults, quoteIdentifier } from '../../helpers/utils';
import { CloudBeaverClient } from '../../transport/CloudBeaverClient';
import { ExecuteSqlUseCase } from './ExecuteSqlUseCase';

export const description: INodeProperties[] = [
	{
		displayName: 'WHERE Clause',
		name: 'selectWhere',
		type: 'string',
		default: '',
		placeholder: "e.g. age > 18 AND status = 'active'",
		description: 'Filter rows. Leave empty to return all rows.',
		displayOptions: { show: { operation: ['select'] } },
	},
	{
		displayName: 'Order By',
		name: 'selectOrderBy',
		type: 'string',
		default: '',
		placeholder: 'e.g. name ASC, created_at DESC',
		description: 'Column(s) to sort results by',
		displayOptions: { show: { operation: ['select'] } },
	},
	{
		displayName: 'Limit',
		name: 'selectLimit',
		type: 'number',
		typeOptions: { minValue: 1 },
		default: 50,
		description: 'Max number of rows to return',
		displayOptions: { show: { operation: ['select'] } },
	},
	{
		displayName: 'Offset',
		name: 'selectOffset',
		type: 'number',
		typeOptions: { minValue: 0 },
		default: 0,
		description: 'Number of rows to skip',
		displayOptions: { show: { operation: ['select'] } },
	},
	{
		displayName: 'Options',
		name: 'selectOptions',
		type: 'collection',
		placeholder: 'Add option',
		default: {},
		displayOptions: { show: { operation: ['select'] } },
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
		const whereClause = (this.getNodeParameter('selectWhere', i) as string).trim();
		const orderBy = (this.getNodeParameter('selectOrderBy', i) as string).trim();
		const limit = this.getNodeParameter('selectLimit', i) as number;
		const offset = this.getNodeParameter('selectOffset', i) as number;
		const defaultDatabase = ((this.getNodeParameter('defaultDatabase', i, '') as string).trim()) || undefined;
		const options = this.getNodeParameter('selectOptions', i, {}) as {
			queryTimeout?: number;
			replaceEmptyStrings?: boolean;
		};
		const timeoutMs = (options.queryTimeout ?? 60) * 1000;
		const replaceEmptyStrings = options.replaceEmptyStrings ?? false;

		if (!table) {
			throw new NodeOperationError(this.getNode(), 'Table name is required', { itemIndex: i });
		}

		const schemaTable = schema
			? `${quoteIdentifier(schema, dbType)}.${quoteIdentifier(table, dbType)}`
			: quoteIdentifier(table, dbType);

		let sql = `SELECT * FROM ${schemaTable}`;
		if (whereClause) sql += ` WHERE ${whereClause}`;
		if (orderBy) sql += ` ORDER BY ${orderBy}`;

		try {
			const raw = await useCase.execute({
				connectionId,
				query: sql,
				limit,
				offset,
				timeoutMs,
				defaultDatabase,
			});
			const rows = transformResults({ results: raw }, { replaceEmptyStrings });
			returnData.push(...rows.map((row) => ({ ...row, pairedItem: { item: i } })));
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
