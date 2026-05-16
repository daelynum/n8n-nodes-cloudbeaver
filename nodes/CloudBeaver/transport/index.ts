import type { IExecuteFunctions } from 'n8n-workflow';
import { NodeOperationError } from 'n8n-workflow';

import { AUTH_LOGIN } from '../queries';
import type { GqlResponse, IAuthProvider } from '../helpers/interfaces';
import { sessionCache } from './sessionCache';
import { SessionExpiredError } from '../errors';

export async function createSession(
	this: IExecuteFunctions,
	serverUrl: string,
	authProvider: IAuthProvider,
): Promise<string> {
	const { provider, credentials } = authProvider.getPayload();

	const response = await this.helpers.httpRequest({
		method: 'POST',
		url: `${serverUrl}/api/gql`,
		headers: { 'Content-Type': 'application/json' },
		body: {
			query: AUTH_LOGIN.query,
			operationName: AUTH_LOGIN.operationName,
			variables: { provider, credentials },
		},
		json: true,
		returnFullResponse: true,
	});

	const body = response.body as GqlResponse<{ authLogin?: { authStatus?: string } }>;
	const authStatus = body.data?.authLogin?.authStatus;
	if (authStatus !== 'SUCCESS') {
		throw new NodeOperationError(this.getNode(), 'CloudBeaver authentication failed');
	}

	const setCookie = response.headers['set-cookie'] as string | string[] | undefined;
	if (!setCookie) {
		throw new NodeOperationError(this.getNode(), 'No session cookie received from CloudBeaver');
	}

	const cookies = Array.isArray(setCookie) ? setCookie : [setCookie];
	const cookiePairs = cookies.map((c: string) => c.split(';')[0]);

	const sessionCookie = cookiePairs.find((c) => c.startsWith('cb-session-id='));
	if (!sessionCookie) {
		throw new NodeOperationError(this.getNode(), 'No cb-session-id received from CloudBeaver');
	}

	return sessionCookie;
}

export async function cloudbeaverRequest(
	this: IExecuteFunctions,
	serverUrl: string,
	body: { query: string; operationName?: string; variables?: Record<string, unknown> },
	sessionCookie: string,
): Promise<GqlResponse<unknown>> {
	const response = await this.helpers.httpRequest({
		method: 'POST',
		url: `${serverUrl}/api/gql`,
		headers: {
			'Content-Type': 'application/json',
			Cookie: sessionCookie,
		},
		body,
		json: true,
	});
	return response as GqlResponse<unknown>;
}

export async function withSession<T>(
	ctx: IExecuteFunctions,
	serverUrl: string,
	authProvider: IAuthProvider,
	cacheKey: string,
	fn: (sessionCookie: string) => Promise<T>,
): Promise<T> {
	// Stores the promise synchronously before any await - prevents cache stampede
	// under concurrent executions.
	const createAndCacheSession = (): Promise<string> => {
		const promise = createSession.call(ctx, serverUrl, authProvider);
		sessionCache.set(cacheKey, promise);
		promise.catch(() => {
			// Identity check: only evict if this exact promise is still cached.
			// A newer entry may have replaced ours (e.g. after TTL or explicit refresh).
			if (sessionCache.get(cacheKey) === promise) sessionCache.delete(cacheKey);
		});
		return promise;
	};

	const getOrCreateSession = (): Promise<string> => {
		return sessionCache.get(cacheKey) ?? createAndCacheSession();
	};

	// Capture which promise we used so concurrent retries can collaborate:
	// only the first to detect expiry evicts it; others reuse the new shared session.
	const usedPromise = getOrCreateSession();
	const sessionCookie = await usedPromise;
	try {
		return await fn(sessionCookie);
	} catch (err) {
		if (err instanceof SessionExpiredError) {
			// Atomic test-and-evict (sync - no interleaving with other tasks).
			if (sessionCache.get(cacheKey) === usedPromise) sessionCache.delete(cacheKey);
			const freshCookie = await getOrCreateSession();
			try {
				return await fn(freshCookie);
			} catch (retryErr) {
				if (retryErr instanceof SessionExpiredError) {
					throw new NodeOperationError(
						ctx.getNode(),
						'Failed to initialize connection. The connection may have been removed from CloudBeaver.',
					);
				}
				throw retryErr;
			}
		}
		throw err;
	}
}
