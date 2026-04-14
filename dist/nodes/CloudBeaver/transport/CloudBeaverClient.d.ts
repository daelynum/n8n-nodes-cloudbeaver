import type { RequestFn, SQLExecuteInfo } from '../helpers/interfaces';
export declare class CloudBeaverClient {
    private readonly request;
    constructor(request: RequestFn);
    initConnection(connectionId: string, projectId: string): Promise<void>;
    createContext(connectionId: string, projectId: string): Promise<string>;
    executeQuery(params: {
        connectionId: string;
        contextId: string;
        sql: string;
        limit: number;
        offset: number;
        projectId: string;
    }): Promise<string>;
    pollTask(taskId: string, timeoutMs?: number): Promise<void>;
    getResults(taskId: string): Promise<SQLExecuteInfo>;
    destroyContext(connectionId: string, contextId: string, projectId: string): Promise<void>;
}
