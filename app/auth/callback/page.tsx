"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useRef } from "react";

import { setToken } from "@/features/auth/infrastructure/tokenStorage";

function CallbackInner() {
  const router = useRouter();
  const params = useSearchParams();
  const handled = useRef(false);

  const token = params.get("token");
  const errorParam = params.get("error");
  const error = errorParam ?? (token ? null : "missing_token");

  useEffect(() => {
    if (handled.current || error || !token) return;
    handled.current = true;

    setToken(token);

    const redirect =
      typeof window !== "undefined"
        ? window.sessionStorage.getItem("auth.postLoginRedirect")
        : null;
    if (typeof window !== "undefined") {
      window.sessionStorage.removeItem("auth.postLoginRedirect");
    }
    router.replace(redirect ?? "/");
  }, [error, token, router]);

  if (error) {
    return (
      <div className="mx-auto max-w-sm space-y-4 p-8 text-center">
        <h1 className="text-xl font-semibold">로그인 실패</h1>
        <p className="text-sm opacity-70">사유: {error}</p>
        <a href="/login" className="inline-block rounded border px-4 py-2 text-sm">
          다시 시도
        </a>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-sm p-8 text-center text-sm opacity-70">
      카카오 인증을 처리 중이에요...
    </div>
  );
}

export default function KakaoCallbackPage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-sm p-8 text-center text-sm opacity-70">
          처리 중...
        </div>
      }
    >
      <CallbackInner />
    </Suspense>
  );
}
