export type GqlQuery = {
    query: string;
    operationName: string;
};
export declare const AUTH_LOGIN: GqlQuery;
export declare const SQL_CONTEXT_CREATE: GqlQuery;
export declare const SQL_CONTEXT_DESTROY: GqlQuery;
export declare const ASYNC_SQL_EXECUTE_QUERY: GqlQuery;
export declare const ASYNC_SQL_EXECUTE_RESULTS: GqlQuery;
export declare const INIT_CONNECTION: GqlQuery;
export declare const CLOSE_SESSION: GqlQuery;
export declare const ASYNC_TASK_INFO: GqlQuery;
