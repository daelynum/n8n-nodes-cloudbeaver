interface CacheEntry {
	promise: Promise<string>;
	expiresAt: number;
}

const cache = new Map<string, CacheEntry>();

export const sessionCache = {
	get(key: string): Promise<string> | undefined {
		const entry = cache.get(key);
		if (!entry) return undefined;
		if (Date.now() > entry.expiresAt) {
			cache.delete(key);
			return undefined;
		}
		return entry.promise;
	},
	set(key: string, promise: Promise<string>): void {
		cache.set(key, { promise, expiresAt: Date.now() + 25 * 60 * 1000 });
	},
	delete(key: string): void {
		cache.delete(key);
	},
};
