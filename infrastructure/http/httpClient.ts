import { env } from "@/infrastructure/config/env";
import { getToken } from "@/features/auth/infrastructure/tokenStorage";

export class HttpError extends Error {
  constructor(
    public readonly status: number,
    statusText: string,
    public readonly body: unknown = null
  ) {
    super(`HTTP ${status}: ${statusText}`);
    this.name = "HttpError";
  }
}

export async function httpClient<T>(
  path: string,
  options?: RequestInit
): Promise<T> {
  const url = `${env.apiBaseUrl}${path}`;

  const authHeader: Record<string, string> = {};
  const token = getToken();
  if (token) {
    authHeader.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    credentials: "include",
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...authHeader,
      ...options?.headers,
    },
  });

  if (!response.ok) {
    let body: unknown = null;
    try { body = await response.json(); } catch { /* ignore */ }
    throw new HttpError(response.status, response.statusText, body);
  }

  return response.json() as Promise<T>;
}
