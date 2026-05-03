import { HttpError } from "@/infrastructure/http/httpClient";

export type SessionErrorKind = "not_found" | "expired" | "network" | "unknown";

export interface SessionError {
  kind: SessionErrorKind;
  message: string;
}

const KIND_DEFAULT_MESSAGE: Record<SessionErrorKind, string> = {
  not_found: "세션을 찾을 수 없어요. 새 질문으로 시작해 주세요.",
  expired: "세션이 만료되었어요 (24시간). 새 질문으로 다시 진행해 주세요.",
  network: "백엔드와 연결이 끊겼어요. 잠시 후 다시 시도해 주세요.",
  unknown: "예상치 못한 오류가 발생했어요.",
};

function extractServerMessage(body: unknown): string | null {
  if (
    body &&
    typeof body === "object" &&
    "message" in body &&
    typeof (body as { message: unknown }).message === "string"
  ) {
    return (body as { message: string }).message;
  }
  return null;
}

export function classifyError(err: unknown): SessionError {
  if (err instanceof HttpError) {
    const serverMsg = extractServerMessage(err.body);
    if (err.status === 404) {
      return { kind: "not_found", message: serverMsg ?? KIND_DEFAULT_MESSAGE.not_found };
    }
    if (err.status === 410) {
      return { kind: "expired", message: serverMsg ?? KIND_DEFAULT_MESSAGE.expired };
    }
    return {
      kind: "unknown",
      message: serverMsg ?? `요청 실패 (HTTP ${err.status})`,
    };
  }
  if (err instanceof TypeError) {
    // fetch가 네트워크 단계에서 실패하면 TypeError를 던진다
    return { kind: "network", message: KIND_DEFAULT_MESSAGE.network };
  }
  if (err instanceof Error) {
    return { kind: "unknown", message: err.message };
  }
  return { kind: "unknown", message: KIND_DEFAULT_MESSAGE.unknown };
}
