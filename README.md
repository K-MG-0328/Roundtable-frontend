# Roundtable — Frontend

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](./LICENSE)
[![Next.js 16](https://img.shields.io/badge/Next.js-16-black.svg)](https://nextjs.org/)
[![React 19](https://img.shields.io/badge/React-19-blue.svg)](https://react.dev/)

Next.js 16 App Router + Jotai + Tailwind 4로 만든 멀티-LLM 브레인스토밍 프론트엔드.

## Roundtable이 뭐야

질문 하나를 던지면 여러 LLM 역할이 각자의 관점으로 답하고 마지막에 종합자가 정리해주는 도구. 이 레포는 그 UI를 담당:

- 질문 입력 → 4-stage 진행 시각화
- 역할별 의견 카드 그리드
- 종합 결과(Synthesis) 카드 + PDF 인쇄 + 공유 링크
- 카카오 로그인 시 **My Crew**: 자기 세션 누적 조회

API/파이프라인은 형제 레포 [`K-MG-0328/Roundtable-backend`](https://github.com/K-MG-0328/Roundtable-backend)이 담당.

## 주요 기능

- 4-stage 진행 표시 + 역할별 카드 그리드
- Synthesis 카드 + PDF 전용 인쇄 레이아웃
- 카카오 로그인 (백엔드 주도 OAuth 흐름)
- My Crew — 로그인 사용자의 세션 페이지네이션
- 비로그인 유저도 풀 기능 사용 가능 — 익명 흐름 보존
- LocalStorage 기반 최근 세션 캐시

## 스택

- **Next.js 16.2** App Router · React 19.2 · TypeScript 5.9 (strict)
- **Tailwind CSS 4** (PostCSS 통합)
- **Jotai 2.19** — 인증 / 입력 상태
- ESLint 9 · `tsc --noEmit` 타입체크

## 아키텍처

4-layer 헥사고날 변형:

```
app/                Next.js 라우팅 (entry point만)
features/<name>/    feature 모듈
  ├── domain/         순수 타입 (외부 의존 0)
  ├── application/    atoms, hooks (UseCase orchestration)
  └── infrastructure/ API 클라이언트, 토큰 저장소
infrastructure/     공통 (httpClient, env)
ui/                 공통 UI (layout, components — Dumb)
```

레이어 의존성: `UI → Application → Domain`, `Infrastructure → Domain`. 전체 규칙은 [`CLAUDE.md`](./CLAUDE.md) 참고.

현재 feature: `auth`, `brainstorm`.

## 빠른 시작

### 사전 요구

- Node.js 20+
- 형제 백엔드(`Roundtable-backend`)가 `http://localhost:8004`에서 떠 있어야 한다

### 실행

```sh
git clone https://github.com/K-MG-0328/Roundtable-frontend.git
cd Roundtable-frontend

npm install
cp .env.example .env.local         # NEXT_PUBLIC_API_BASE_URL 확인
npm run dev                        # http://localhost:3004
```

## 개발

| 명령 | 설명 |
| --- | --- |
| `npm run dev` | 개발 서버 (port 3004) |
| `npm run build` | 프로덕션 빌드 |
| `npm run start` | 프로덕션 실행 |
| `npm run lint` | ESLint |
| `npm run typecheck` | `tsc --noEmit` |

## 라우트

| Path | 설명 |
| --- | --- |
| `/` | 메인 — 질문 입력 + 최근 세션 |
| `/sessions/[id]` | 세션 상세 (4-stage 진행 + 결과 그리드 + PDF) |
| `/login` | 카카오 로그인 진입 |
| `/auth/callback` | OAuth 콜백 처리 |
| `/my-crew` | 로그인 사용자의 세션 목록 |

## 환경 변수

| Key | 설명 |
| --- | --- |
| `NEXT_PUBLIC_API_BASE_URL` | 백엔드 base URL (기본 `http://localhost:8004`) |

## 형제 레포

API/파이프라인은 [`K-MG-0328/Roundtable-backend`](https://github.com/K-MG-0328/Roundtable-backend).

## 라이선스

[MIT](./LICENSE)
