import type { IExecuteFunctions } from 'n8n-workflow';
import type { GqlResponse, IAuthProvider } from '../helpers/interfaces';
export declare function createSession(this: IExecuteFunctions, serverUrl: string, authProvider: IAuthProvider): Promise<string>;
export declare function cloudbeaverRequest(this: IExecuteFunctions, serverUrl: string, body: {
    query: string;
    operationName?: string;
    variables?: Record<string, unknown>;
}, sessionCookie: string): Promise<GqlResponse<unknown>>;
export declare function withSession<T>(ctx: IExecuteFunctions, serverUrl: string, authProvider: IAuthProvider, fn: (sessionCookie: string) => Promise<T>): Promise<T>;
