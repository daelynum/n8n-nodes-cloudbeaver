import type { IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import type { RequestFn } from '../../helpers/interfaces';
export declare function execute(this: IExecuteFunctions, request: RequestFn, items: INodeExecutionData[]): Promise<INodeExecutionData[]>;
