# 🔥 최적화된 Dockerfile
FROM node:18-alpine AS base

# pnpm을 더 효율적으로 활성화
RUN corepack enable
RUN corepack prepare pnpm@latest --activate

# 의존성 설치 단계 (프로덕션용)
FROM base AS deps
WORKDIR /app

# 🔥 패키지 파일만 먼저 복사 (캐시 최적화)
COPY package.json pnpm-lock.yaml ./

# 🔥 프로덕션 의존성만 설치
RUN pnpm install --prod --frozen-lockfile --ignore-scripts
RUN pnpm store prune

# 빌드 단계에서 캐시 최적화
FROM base AS builder
WORKDIR /app

# 🔥 pnpm store 캐시 활용
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

# 🔥 패키지 파일 복사
COPY package.json pnpm-lock.yaml ./

# 🔥 모든 의존성 설치 (devDependencies 포함)
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile

# 🔥 소스 코드 복사 (의존성 설치 후)
COPY . .

# 🔥 빌드 실행
RUN pnpm run build

# 🔥 불필요한 파일 정리
RUN rm -rf src test *.md

# 프로덕션 실행 단계
FROM node:18-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production

# 🔥 보안을 위한 사용자 생성
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nestjs

# 🔥 필요한 파일들만 복사
COPY --from=deps --chown=nestjs:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=nestjs:nodejs /app/dist ./dist
COPY --from=builder --chown=nestjs:nodejs /app/package.json ./

USER nestjs

EXPOSE 8000

# 🔥 헬스체크 추가
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node --version || exit 1

CMD ["node", "dist/main"]