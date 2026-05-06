const TOKEN_KEY = "roundtable.accessToken";
export const AUTH_TOKEN_CHANGED = "auth:token-changed";

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(TOKEN_KEY, token);
  window.dispatchEvent(new CustomEvent(AUTH_TOKEN_CHANGED));
}

export function clearToken(): void {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(TOKEN_KEY);
  window.dispatchEvent(new CustomEvent(AUTH_TOKEN_CHANGED));
}
