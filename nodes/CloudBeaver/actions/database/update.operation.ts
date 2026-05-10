import type {
	IExecuteFunctions,
	INodeExecutionData,
	INodeProperties,
	JsonObject,
} from 'n8n-workflow';
import { NodeApiError, NodeOperationError } from 'n8n-workflow';

import type { RequestFn } from '../../helpers/interfaces';
import { quoteIdentifier, formatSqlValue, validateColumns, type ValueType } from '../../helpers/utils';
import { CloudBeaverClient } from '../../transport/CloudBeaverClient';
import { ExecuteSqlUseCase } from './ExecuteSqlUseCase';

export const description: INodeProperties[] = [
	{
		displayName: 'Update Fields',
		name: 'columns',
		type: 'fixedCollection',
		typeOptions: { multipleValues: true },
		default: {},
		required: true,
		placeholder: 'Add Column',
		displayOptions: { show: { operation: ['update'] } },
		options: [
			{
				name: 'values',
				displayName: 'Column',
				values: [
					{
						displayName: 'Column Name',
						name: 'column',
						type: 'string',
						default: '',
						placeholder: 'e.g. name',
					},
					{
						displayName: 'Value',
						name: 'value',
						type: 'string',
						default: '',
						placeholder: 'e.g. Alice',
					},
					{
						displayName: 'Value Type',
						name: 'valueType',
						type: 'options',
						default: 'string',
						description:
							'How to format the value in the generated SQL. Use Raw SQL only with trusted input for expressions like NOW() or CAST(...).',
						options: [
							{ name: 'Boolean', value: 'boolean' },
							{ name: 'Null', value: 'null' },
							{ name: 'Number', value: 'number' },
							{ name: 'Raw SQL', value: 'raw' },
							{ name: 'String', value: 'string' },
						],
					},
				],
			},
		],
	},
	{
		displayName: 'WHERE Clause',
		name: 'updateWhere',
		type: 'string',
		default: '',
		placeholder: "e.g. ID = '42'",
		description: 'Condition to identify which rows to update. Leave empty to update all rows.',
		displayOptions: { show: { operation: ['update'] } },
	},
	{
		displayName: 'Update Fields',
		name: 'updateOptions',
		type: 'collection',
		placeholder: 'Add option',
		default: {},
		displayOptions: { show: { operation: ['update'] } },
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
		const columnsData = this.getNodeParameter('columns.values', i, []) as Array<{
			column: string;
			value: unknown;
			valueType?: ValueType;
		}>;
		const whereClause = (this.getNodeParameter('updateWhere', i) as string).trim();
		const defaultDatabase =
			(this.getNodeParameter('defaultDatabase', i, '') as string).trim() || undefined;
		const options = this.getNodeParameter('updateOptions', i, {}) as { queryTimeout?: number };
		const timeoutMs = (options.queryTimeout ?? 60) * 1000;

		if (!table) {
			throw new NodeOperationError(this.getNode(), 'Table name is required', { itemIndex: i });
		}
		validateColumns(this, columnsData, i);

		const schemaTable = schema
			? `${quoteIdentifier(schema, dbType)}.${quoteIdentifier(table, dbType)}`
			: quoteIdentifier(table, dbType);

		let setClauses: string;
		try {
			setClauses = columnsData
				.map((c) => {
					const column = quoteIdentifier(c.column.trim(), dbType);
					const value = formatSqlValue(c.value, c.valueType ?? 'string', dbType);
					return `${column} = ${value}`;
				})
				.join(', ');
		} catch (error) {
			throw new NodeOperationError(this.getNode(), (error as Error).message, { itemIndex: i });
		}

		let sql = `UPDATE ${schemaTable} SET ${setClauses}`;
		if (whereClause) sql += ` WHERE ${whereClause}`;

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
