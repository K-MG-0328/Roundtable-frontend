import { httpClient } from "@/infrastructure/http/httpClient";
import type {
  BrainstormSession,
  Persona,
  SessionListPage,
  SessionStatus,
} from "@/features/brainstorm/domain/types";

interface ApiEnvelope<T> {
  success: boolean;
  message: string;
  data: T;
}

interface RawSessionSummary {
  id: string;
  question: string;
  status: SessionStatus;
  created_at: string;
  synthesis_present: boolean;
}

interface RawSessionListResponse {
  items: RawSessionSummary[];
  next_cursor: string | null;
}

export async function listPersonas(): Promise<Persona[]> {
  const res = await httpClient<ApiEnvelope<Persona[]>>("/api/v1/brainstorm/personas");
  return res.data;
}

export async function createSession(
  question: string,
  selectedRoleIds: string[],
): Promise<{ session_id: string }> {
  const res = await httpClient<ApiEnvelope<{ session_id: string }>>(
    "/api/v1/brainstorm/sessions",
    {
      method: "POST",
      body: JSON.stringify({
        question,
        selected_role_ids: selectedRoleIds,
      }),
    },
  );
  return res.data;
}

export async function getSession(id: string): Promise<BrainstormSession> {
  const res = await httpClient<ApiEnvelope<BrainstormSession>>(
    `/api/v1/brainstorm/sessions/${id}`,
  );
  return res.data;
}

export async function listMySessions(
  cursor?: string | null,
  limit = 20,
): Promise<SessionListPage> {
  const params = new URLSearchParams({ limit: String(limit) });
  if (cursor) params.set("cursor", cursor);
  const res = await httpClient<ApiEnvelope<RawSessionListResponse>>(
    `/api/v1/brainstorm/sessions?${params.toString()}`,
  );
  return {
    items: res.data.items.map((it) => ({
      id: it.id,
      question: it.question,
      status: it.status,
      createdAt: it.created_at,
      synthesisPresent: it.synthesis_present,
    })),
    nextCursor: res.data.next_cursor,
  };
}
