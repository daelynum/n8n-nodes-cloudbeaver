import type { CloudBeaverClient } from '../../transport/CloudBeaverClient';
import type { SQLQueryResults } from '../../helpers/interfaces';
export declare class ExecuteSqlUseCase {
    private readonly client;
    constructor(client: CloudBeaverClient);
    execute(input: {
        connectionId: string;
        query: string;
        limit: number;
        offset: number;
        orderBy?: string;
        where?: string;
        timeoutMs: number;
    }): Promise<SQLQueryResults[]>;
}
