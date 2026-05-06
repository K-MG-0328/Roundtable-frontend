"use client";

import { useAtom, useSetAtom } from "jotai";
import { useCallback, useEffect } from "react";

import {
  accessTokenAtom,
  authReadyAtom,
  currentUserAtom,
} from "@/features/auth/application/atoms";
import { getMe, logout as apiLogout } from "@/features/auth/infrastructure/authApi";
import {
  AUTH_TOKEN_CHANGED,
  clearToken,
  getToken,
} from "@/features/auth/infrastructure/tokenStorage";
import { env } from "@/infrastructure/config/env";

/**
 * 앱 진입 시 한 번 호출. localStorage 토큰을 jotai로 hydrate하고
 * 토큰이 있으면 /auth/me로 사용자 정보를 가져온다.
 */
export function useAuthBootstrap(): void {
  const [, setToken_] = useAtom(accessTokenAtom);
  const [, setUser] = useAtom(currentUserAtom);
  const [, setReady] = useAtom(authReadyAtom);

  useEffect(() => {
    let cancelled = false;

    const sync = async () => {
      const token = getToken();
      setToken_(token);
      if (!token) {
        setUser(null);
        setReady(true);
        return;
      }
      try {
        const user = await getMe();
        if (!cancelled) setUser(user);
      } catch {
        if (!cancelled) {
          clearToken();
          setToken_(null);
          setUser(null);
        }
      } finally {
        if (!cancelled) setReady(true);
      }
    };

    void sync();

    const onChange = () => {
      void sync();
    };
    window.addEventListener(AUTH_TOKEN_CHANGED, onChange);
    return () => {
      cancelled = true;
      window.removeEventListener(AUTH_TOKEN_CHANGED, onChange);
    };
  }, [setToken_, setUser, setReady]);
}

/**
 * 카카오 로그인 시작 — 백엔드의 /auth/kakao/login으로 풀 페이지 이동.
 * (브라우저 → 백엔드 → 카카오 → 백엔드 callback → 프론트 /auth/callback)
 */
export function useKakaoLogin() {
  return useCallback(() => {
    if (typeof window === "undefined") return;
    window.location.href = `${env.apiBaseUrl}/api/v1/auth/kakao/login`;
  }, []);
}

export function useLogout() {
  const setTokenAtom = useSetAtom(accessTokenAtom);
  const setUser = useSetAtom(currentUserAtom);
  return useCallback(async () => {
    try {
      await apiLogout();
    } catch {
      // 서버 측 stateless라 실패해도 클라이언트 정리 진행
    }
    clearToken();
    setTokenAtom(null);
    setUser(null);
  }, [setTokenAtom, setUser]);
}
