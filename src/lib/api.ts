// Base URL of the VoltShift backend (e.g. https://voltshift-api.onrender.com).
// Leave VITE_API_URL unset to use same-origin requests (local `npm run dev`).
const API_BASE = (import.meta.env.VITE_API_URL ?? '').replace(/\/+$/, '');

export function apiUrl(path: string): string {
  return `${API_BASE}${path}`;
}

export function wsUrl(path: string): string {
  if (API_BASE) {
    return `${API_BASE.replace(/^http/, 'ws')}${path}`;
  }
  const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
  return `${protocol}//${window.location.host}${path}`;
}
