# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 프로젝트 개요

Next.js + Supabase 기반의 인증 스타터 키트 실습 프로젝트입니다.

- **핵심 기능**: 이메일/비밀번호 회원가입·로그인, 이메일 OTP 인증, 사용자 프로필 관리, 보호 라우트
- **배포 타겟**: Vercel

## 기술 스택

| 계층       | 기술                                           |
| ---------- | ---------------------------------------------- |
| 프레임워크 | Next.js (latest, App Router)                   |
| 언어       | TypeScript 5                                   |
| UI         | React 19, Radix UI, shadcn/ui (New York style) |
| 스타일링   | Tailwind CSS 3.4                               |
| 백엔드/DB  | Supabase (PostgreSQL)                          |
| 인증       | Supabase Auth (쿠키 기반 SSR)                  |
| 테마       | next-themes (다크모드)                         |

## 개발 명령어

```bash
npm run dev          # 개발 서버 (http://localhost:3000)
npm run build        # 프로덕션 빌드
npm run lint         # ESLint 검사
npm run lint:fix     # ESLint 자동 수정
npm run format       # Prettier 포맷팅
npm run format:check # 포맷팅 검사 (CI용)
npm run typecheck    # TypeScript 타입 체크
```

Pre-commit hook(Husky)이 설정되어 있어 커밋 시 자동으로 lint-staged(ESLint + Prettier) 및 typecheck가 실행됩니다.

테스트 프레임워크는 설정되어 있지 않습니다.

## 환경 변수

`.env.local` 파일 생성 필요:

```
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=eyJxxxxxx
```

`lib/utils.ts`의 `hasEnvVars`로 설정 여부를 런타임에 확인합니다.

## 아키텍처

### Supabase 클라이언트 선택 규칙

| 컨텍스트                             | 사용할 파일              |
| ------------------------------------ | ------------------------ |
| 서버 컴포넌트, Route Handler         | `lib/supabase/server.ts` |
| 클라이언트 컴포넌트 (`"use client"`) | `lib/supabase/client.ts` |
| 미들웨어                             | `lib/supabase/proxy.ts`  |

### 라우트 구조

- `/` — 홈 (공개)
- `/auth/*` — 로그인, 회원가입, 비밀번호 재설정, 이메일 OTP 확인(`/auth/confirm`)
- `/protected/*` — 인증 필수 라우트 (미들웨어가 자동으로 `/auth/login` 리다이렉트)
- `/instruments` — DB 쿼리 예제 페이지

### 미들웨어 (`proxy.ts`)

정적 파일을 제외한 모든 요청을 인터셉트하여 `lib/supabase/proxy.ts`의 `updateSession()`으로 Supabase 세션을 갱신합니다. 미인증 사용자는 `/auth/login`으로 리다이렉트됩니다.

### 인증 흐름

```
/auth/sign-up → 이메일 발송 → /auth/confirm (OTP 검증) → /protected
/auth/login   → signInWithPassword() → /protected
```

## DB 타입 재생성

```bash
npx supabase gen types typescript --project-id <project-id> > types/database.types.ts
```

현재 정의된 테이블: `profiles` (id, email, full_name, username, bio, website, avatar_url, updated_at)

## UI 컴포넌트 추가

```bash
npx shadcn@latest add <component-name>
```
