"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ASYNC_TASK_INFO = exports.CLOSE_SESSION = exports.INIT_CONNECTION = exports.ASYNC_SQL_EXECUTE_RESULTS = exports.ASYNC_SQL_EXECUTE_QUERY = exports.SQL_CONTEXT_DESTROY = exports.SQL_CONTEXT_CREATE = exports.AUTH_LOGIN = void 0;
exports.AUTH_LOGIN = {
    operationName: 'authLogin',
    query: `
query authLogin($provider: ID!, $credentials: Object) {
  authLogin(provider: $provider, credentials: $credentials) {
    authStatus
  }
}`,
};
exports.SQL_CONTEXT_CREATE = {
    operationName: 'sqlContextCreate',
    query: `
mutation sqlContextCreate($connectionId: ID!, $projectId: ID) {
  sqlContextCreate(connectionId: $connectionId, projectId: $projectId) {
    id
  }
}`,
};
exports.SQL_CONTEXT_DESTROY = {
    operationName: 'sqlContextDestroy',
    query: `
mutation sqlContextDestroy($connectionId: ID!, $contextId: ID!, $projectId: ID) {
  sqlContextDestroy(connectionId: $connectionId, contextId: $contextId, projectId: $projectId)
}`,
};
exports.ASYNC_SQL_EXECUTE_QUERY = {
    operationName: 'asyncSqlExecuteQuery',
    query: `
mutation asyncSqlExecuteQuery(
  $connectionId: ID!,
  $contextId: ID!,
  $sql: String!,
  $filter: SQLDataFilter,
  $projectId: ID
) {
  asyncSqlExecuteQuery(
    connectionId: $connectionId,
    contextId: $contextId,
    sql: $sql,
    filter: $filter,
    projectId: $projectId
  ) {
    id
    running
  }
}`,
};
exports.ASYNC_SQL_EXECUTE_RESULTS = {
    operationName: 'asyncSqlExecuteResults',
    query: `
mutation asyncSqlExecuteResults($taskId: ID!) {
  asyncSqlExecuteResults(taskId: $taskId) {
    results {
      resultSet {
        columns { name }
        rowsWithMetaData { data }
      }
    }
  }
}`,
};
exports.INIT_CONNECTION = {
    operationName: 'initConnection',
    query: `
mutation initConnection($id: ID!, $projectId: ID!) {
  initConnection(id: $id, projectId: $projectId) {
    id
  }
}`,
};
exports.CLOSE_SESSION = {
    operationName: 'closeSession',
    query: `
mutation closeSession {
  closeSession
}`,
};
exports.ASYNC_TASK_INFO = {
    operationName: 'asyncTaskInfo',
    query: `
mutation asyncTaskInfo($id: String!) {
  asyncTaskInfo(id: $id, removeOnFinish: false) {
    id
    running
    status
    error { message errorCode stackTrace }
  }
}`,
};
//# sourceMappingURL=queries.js.map