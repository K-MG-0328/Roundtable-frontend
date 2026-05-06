"use client";

import Link from "next/link";
import { useAtomValue } from "jotai";

import {
  authReadyAtom,
  currentUserAtom,
  isAuthenticatedAtom,
} from "@/features/auth/application/atoms";
import { useLogout } from "@/features/auth/application/hooks";

export default function AuthHeader() {
  const ready = useAtomValue(authReadyAtom);
  const isAuth = useAtomValue(isAuthenticatedAtom);
  const user = useAtomValue(currentUserAtom);
  const logout = useLogout();

  if (!ready) {
    return <div className="h-8" />;
  }

  const displayName = user?.nickname ?? user?.email ?? "";

  return (
    <nav className="flex items-center gap-4 text-sm">
      <Link href="/" className="font-semibold opacity-90 hover:opacity-100">
        Roundtable
      </Link>
      <div className="ml-auto flex items-center gap-3">
        {isAuth ? (
          <>
            <Link href="/my-crew" className="opacity-80 hover:opacity-100">
              My Crew
            </Link>
            {displayName && <span className="opacity-60">{displayName}</span>}
            <button
              type="button"
              onClick={() => void logout()}
              className="rounded border border-current px-2 py-1 opacity-80 hover:opacity-100"
            >
              로그아웃
            </button>
          </>
        ) : (
          <Link
            href="/login"
            className="rounded bg-[#FEE500] px-3 py-1 text-black hover:opacity-90"
          >
            카카오로 시작
          </Link>
        )}
      </div>
    </nav>
  );
}
