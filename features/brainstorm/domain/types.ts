export type Provider = "ANTHROPIC" | "OPENAI" | "GOOGLE";

export type Stage = "GENERATION" | "SELF_CRITIQUE" | "REVISION" | "SYNTHESIS";

export type SessionStatus = "PENDING" | "RUNNING" | "COMPLETED" | "FAILED";

export interface Persona {
  id: string;
  name: string;
  description: string;
  suitable_for: string;
  provider: Provider;
  is_default_selected: boolean;
  is_synthesizer: boolean;
}

export interface RoleResponse {
  role_id: string;
  model: string;
  stage: Stage;
  content: Record<string, unknown>;
  is_failed: boolean;
  error_message: string | null;
  created_at: string;
}

export interface Synthesis {
  consensus: string[];
  majority_view: string[];
  open_disputes: string[];
  recommendations: string[];
  summary: string;
}

export interface BrainstormSession {
  id: string;
  question: string;
  selected_role_ids: string[];
  status: SessionStatus;
  current_stage: Stage | null;
  synthesis: Synthesis | null;
  error_message: string | null;
  created_at: string;
  expires_at: string;
  responses: RoleResponse[];
}

export const STAGE_ORDER: Stage[] = [
  "GENERATION",
  "SELF_CRITIQUE",
  "REVISION",
  "SYNTHESIS",
];

export const STAGE_LABELS: Record<Stage, string> = {
  GENERATION: "1. 독립 생성",
  SELF_CRITIQUE: "2. 자기비판",
  REVISION: "4. 응답·수정",
  SYNTHESIS: "5. 종합",
};
