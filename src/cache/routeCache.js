const cache = new Map();
const TTL = 5 * 60 * 1000; // 5 minutos

export function getCachedRoute(key) {
  const cached = cache.get(key);

  if (!cached) return null;

  const isExpired = Date.now() - cached.timestamp > TTL;

  if (isExpired) {
    cache.delete(key);
    return null;
  }

  return cached.value;
}

export function setCachedRoute(key, value) {
  cache.set(key, {
    value,
    timestamp: Date.now(),
  });
}
