const BASE_URL = '/api';

export function getToken() {
  return localStorage.getItem('moviehub_token');
}

export function saveToken(token) {
  localStorage.setItem('moviehub_token', token);
}

export function removeToken() {
  localStorage.removeItem('moviehub_token');
}

export function authHeaders() {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function fetchJson(url, options = {}) {
  const { headers: extraHeaders, ...restOptions } = options;
  const response = await fetch(url, {
    ...restOptions,
    headers: {
      'Content-Type': 'application/json',
      ...extraHeaders,
    },
  });

  if (!response.ok) {
    const payload = await response.json().catch(() => ({}));
    throw new Error(payload.message || 'Request failed');
  }

  return response.json();
}
