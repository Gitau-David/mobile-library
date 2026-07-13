const BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5000';

export async function apiFetch(path, options = {}) {
  const url = path.startsWith('/') ? `${BASE}${path}` : `${BASE}/${path}`;
  return fetch(url, options);
}

export default apiFetch;
