import type {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
} from 'n8n-workflow';
import { NodeConnectionTypes } from 'n8n-workflow';

import { router } from './actions/router';
import * as database from './actions/database/Database.resource';

export class CloudBeaver implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'CloudBeaver',
		name: 'cloudBeaver',
		icon: 'file:cloudbeaver.svg',
		group: ['input'],
		version: 1,
		description: 'Execute SQL queries via CloudBeaver',
		usableAsTool: true,
		defaults: { name: 'CloudBeaver' },
		inputs: [NodeConnectionTypes.Main],
		outputs: [NodeConnectionTypes.Main],
		credentials: [
			{
				name: 'cloudBeaverApi',
				required: true,
			},
		],
		properties: [...database.description],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		return await router.call(this);
	}
}
