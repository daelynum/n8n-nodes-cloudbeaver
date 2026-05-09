import type { IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';

import { createAuthProvider } from '../transport/auth/createAuthProvider';
import { withSession, cloudbeaverRequest } from '../transport';
import type { GqlResponse, RequestFn } from '../helpers/interfaces';
import * as database from './database/Database.resource';

type ExecuteOperation = (
	this: IExecuteFunctions,
	request: RequestFn,
	inputItems: INodeExecutionData[],
) => Promise<INodeExecutionData[]>;

type OperationModule = {
	execute?: ExecuteOperation;
};

export async function router(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
	const inputItems = this.getInputData();
	const returnData: INodeExecutionData[] = [];

	const credentials = await this.getCredentials('cloudBeaverApi');
	const serverUrl = String(credentials.serverUrl).replace(/\/$/, '');
	const authProvider = createAuthProvider(credentials);

	await withSession(this, serverUrl, authProvider, async (sessionCookie) => {
		const request: RequestFn = async <T>({
			query,
			variables,
			operationName,
		}: {
			query: string;
			operationName?: string;
			variables?: Record<string, unknown>;
		}): Promise<GqlResponse<T>> => {
			const response = await cloudbeaverRequest.call(
				this,
				serverUrl,
				{
					query,
					variables,
					...(operationName ? { operationName } : {}),
				},
				sessionCookie,
			);
			return response as GqlResponse<T>;
		};

		const operation = this.getNodeParameter('operation', 0) as string;
		const operationModule = database[operation as keyof typeof database] as OperationModule;

		if (!operationModule || typeof operationModule.execute !== 'function') {
			throw new Error(`Unknown operation: ${operation}`);
		}

		const results = await operationModule.execute.call(this, request, inputItems);
		returnData.push(...results);
	});

	return [returnData];
}
