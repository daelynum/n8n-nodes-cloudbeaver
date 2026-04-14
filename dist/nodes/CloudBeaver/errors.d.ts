import { OperationalError } from 'n8n-workflow';
export declare class CloudBeaverError extends OperationalError {
}
export declare class QueryError extends CloudBeaverError {
}
export declare class ContextError extends CloudBeaverError {
}
export declare class TimeoutError extends CloudBeaverError {
}
