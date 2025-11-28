const CACHE_KEY = 'crypto_cache';
const CACHE_EXPIRY = 3600000;

export function loadCache(): { price: number; currency: string; timestamp: number } | null {
  const raw = localStorage.getItem(CACHE_KEY);
  try {
    const parsed = JSON.parse(atob(raw!));
    return Date.now() - parsed.timestamp < CACHE_EXPIRY ? parsed : null;
  } catch {
    return null;
  }
}

export function saveCache(data: { price: number; currency: string }) {
  const payload = { ...data, timestamp: Date.now() };
  localStorage.setItem(CACHE_KEY, btoa(JSON.stringify(payload)));
}
