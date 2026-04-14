import type { INodeExecutionData } from 'n8n-workflow';
import type { SQLExecuteInfo } from './interfaces';
export declare function transformResults(executeInfo: SQLExecuteInfo, options?: {
    replaceEmptyStrings?: boolean;
}): INodeExecutionData[];
