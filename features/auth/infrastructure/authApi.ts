import { httpClient } from "@/infrastructure/http/httpClient";
import type { AuthUser } from "@/features/auth/domain/types";

interface ApiEnvelope<T> {
  success: boolean;
  message: string;
  data: T;
}

interface RawUser {
  id: string;
  provider: string;
  email: string | null;
  nickname: string | null;
  created_at: string;
}

function mapUser(raw: RawUser): AuthUser {
  return {
    id: raw.id,
    provider: raw.provider,
    email: raw.email,
    nickname: raw.nickname,
    createdAt: raw.created_at,
  };
}

export async function getMe(): Promise<AuthUser> {
  const res = await httpClient<ApiEnvelope<RawUser>>("/api/v1/auth/me");
  return mapUser(res.data);
}

export async function logout(): Promise<void> {
  await httpClient<ApiEnvelope<null>>("/api/v1/auth/logout", { method: "POST" });
}
