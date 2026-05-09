import type { INodeProperties } from 'n8n-workflow';

import * as deleteTable from './deleteTable.operation';
import * as executeQuery from './executeQuery.operation';
import * as insert from './insert.operation';
import * as select from './select.operation';
import * as update from './update.operation';

export { deleteTable, executeQuery, insert, select, update };

export const description: INodeProperties[] = [
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
		description:
			'Use the database connection ID in CloudBeaver. Right-click the database in Database Navigator, select Open, and check the ID in the window.',
		placeholder: 'e.g. postgres-jdbc-19d5ca3a223-2f46e1a321049b15',
	},
	{
		displayName: 'Default Database',
		name: 'defaultDatabase',
		type: 'string',
		default: '',
		placeholder: 'e.g. demo',
		description:
			'Database or catalog to use when executing SQL. Leave empty to use the connection default.',
	},
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		// eslint-disable-next-line n8n-nodes-base/node-param-options-type-unsorted-items
		options: [
			{
				name: 'Execute SQL Query',
				value: 'executeQuery',
				description: 'Execute a raw SQL query',
				action: 'Execute a SQL query',
			},
			{
				name: 'Select Rows',
				value: 'select',
				description: 'Retrieve rows from a table',
				action: 'Select rows from a table',
			},
			{
				name: 'Insert Rows',
				value: 'insert',
				description: 'Insert new rows into a table',
				action: 'Insert rows in a table',
			},
			{
				name: 'Update Rows',
				value: 'update',
				description: 'Update existing rows in a table',
				action: 'Update rows in a table',
			},
			{
				name: 'Delete',
				value: 'deleteTable',
				description: 'Delete rows, truncate, or drop a table',
				action: 'Delete table or rows',
			},
		],
		default: 'executeQuery',
	},
	{
		displayName: 'Database Type',
		name: 'dbType',
		type: 'options',
		options: [
			{
				name: 'PostgreSQL',
				value: 'postgresql',
				description: 'PostgreSQL, SQLite, Oracle, Redshift, Greenplum and other ANSI SQL databases',
			},
			{ name: 'MySQL', value: 'mysql', description: 'MySQL, MariaDB, TiDB' },
			{ name: 'SQL Server', value: 'mssql', description: 'SQL Server, Azure SQL, Sybase' },
		],
		default: 'postgresql',
		description: 'Type of database. Affects identifier quoting style.',
		displayOptions: { show: { operation: ['select', 'insert', 'update', 'deleteTable'] } },
	},
	{
		displayName: 'Schema',
		name: 'schema',
		type: 'string',
		default: '',
		placeholder: 'e.g. public',
		description: 'Database schema containing the table. Leave empty to omit schema prefix.',
		displayOptions: { show: { operation: ['select', 'insert', 'update', 'deleteTable'] } },
	},
	{
		displayName: 'Table',
		name: 'table',
		type: 'string',
		default: '',
		required: true,
		placeholder: 'e.g. users',
		description: 'Name of the table',
		displayOptions: { show: { operation: ['select', 'insert', 'update', 'deleteTable'] } },
	},
	...executeQuery.description,
	...select.description,
	...insert.description,
	...update.description,
	...deleteTable.description,
];
