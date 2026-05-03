import { httpClient } from "@/infrastructure/http/httpClient";
import type { BrainstormSession, Persona } from "@/features/brainstorm/domain/types";

interface ApiEnvelope<T> {
  success: boolean;
  message: string;
  data: T;
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
