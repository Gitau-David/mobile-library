const rawBase = import.meta.env.VITE_API_BASE;
const normalizedBase = typeof rawBase === 'string'
  ? rawBase.replace(/^VITE_API_BASE=/, '').trim()
  : rawBase;
const BASE = normalizedBase || 'https://mobile-library-production.up.railway.app';

export async function apiFetch(path, options = {}) {
  const url = path.startsWith('/')
    ? `${BASE.replace(/\/$/, '')}${path}`
    : `${BASE.replace(/\/$/, '')}/${path}`;
  return fetch(url, options);
}

export default apiFetch;
