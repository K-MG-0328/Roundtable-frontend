# frontend-starter

Next.js 16 + React 19 + Tailwind 4 + Jotai 기반의 4-layer(헥사고날 변형) 스타터 템플릿.

## 포함된 것

- **Next.js 16** App Router · **React 19** · **TypeScript 5** (strict)
- **Tailwind CSS 4** (PostCSS 통합)
- **Jotai** Provider shell (`ui/layout/AppLayout.tsx`)
- **httpClient** — credentials/base URL/공통 에러 처리 내장 (`infrastructure/http/httpClient.ts`)
- **env validator** — 필수 환경 변수 검증 (`infrastructure/config/env.ts`)
- **4-layer 디렉토리 구조** — Domain / Application / Infrastructure / UI
- ESLint 9 + Next.js plugin, `tsc --noEmit` 타입체크
- Dockerfile (node:20-alpine 기반 production build)

## 시작하기

### 옵션 A — GitHub Template

1. GitHub repo 페이지에서 **Use this template** 클릭
2. 새로 만든 repo를 clone

### 옵션 B — 직접 clone

```bash
git clone <this-repo-url> my-project
cd my-project
rm -rf .git && git init -b main
```

### 공통 설정

```bash
npm install
cp .env.example .env.local       # 백엔드 URL 등 작성
npm run dev                      # http://localhost:3000
```

## 새 프로젝트로 시작할 때 갈아끼울 것

`CLAUDE.md` 상단의 체크리스트 참고:

- `package.json` `name`
- `app/layout.tsx` `metadata`
- `app/page.tsx`
- `README.md` (이 파일 자체)
- `.env.local` 값

## 디렉토리 구조

```
app/                Next.js 라우팅 (entry point)
features/<name>/    feature 모듈 (domain/application/infrastructure/ui)
infrastructure/     공통 인프라 (httpClient, env)
ui/                 공통 UI (layout, components)
```

레이어 의존성·작성 규칙은 `CLAUDE.md` 참고.

## 스크립트

```bash
npm run dev         # 개발 서버
npm run build       # 프로덕션 빌드
npm run start       # 프로덕션 실행
npm run lint        # ESLint
npm run typecheck   # tsc --noEmit
```
