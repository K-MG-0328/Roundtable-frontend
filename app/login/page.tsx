"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

import { useKakaoLogin } from "@/features/auth/application/hooks";

function LoginInner() {
  const startKakao = useKakaoLogin();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect");

  const handleClick = () => {
    if (redirect && typeof window !== "undefined") {
      window.sessionStorage.setItem("auth.postLoginRedirect", redirect);
    }
    startKakao();
  };

  return (
    <div className="mx-auto flex max-w-sm flex-col items-stretch gap-6 p-8">
      <div className="space-y-1 text-center">
        <h1 className="text-2xl font-semibold">로그인</h1>
        <p className="text-sm opacity-70">
          카카오 계정으로 시작하면 세션이 자동 저장돼요.
        </p>
      </div>
      <button
        type="button"
        onClick={handleClick}
        className="flex items-center justify-center gap-2 rounded-lg bg-[#FEE500] px-6 py-3 text-sm font-medium text-black hover:opacity-90"
      >
        카카오로 시작
      </button>
      <p className="text-center text-xs opacity-60">
        로그인하지 않아도 익명으로 브레인스토밍은 사용할 수 있어요.
      </p>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-sm p-8 text-center text-sm opacity-70">
          로딩 중...
        </div>
      }
    >
      <LoginInner />
    </Suspense>
  );
}
