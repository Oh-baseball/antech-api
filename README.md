<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

## 프로젝트 설치

```bash
$ pnpm install
```

## 프로젝트 실행 가이드

```bash
# development
$ pnpm run start

# watch mode
$ pnpm run start:dev

# production mode
$ pnpm run start:prod
```

## Run tests

```bash
# unit tests
$ pnpm run test

# e2e tests
$ pnpm run test:e2e

# test coverage
$ pnpm run test:cov
```

# 포인트 적립/사용 시스템 API

> Supabase를 백엔드로 사용하는 NestJS 기반의 포인트 적립 및 사용 시스템

## 🎯 프로젝트 개요

이 프로젝트는 사용자가 매장에서 포인트를 적립하고 사용할 수 있는 시스템의 백엔드 API입니다. NestJS와 TypeScript로 구축되었으며, Supabase(PostgreSQL)를 데이터베이스로 사용합니다.

### 주요 기능

- 👤 **사용자 관리**: 회원가입, 로그인, 프로필 관리
- 🏪 **매장 관리**: 매장 등록, 조회, 수정, 삭제
- 📂 **카테고리 관리**: 매장 카테고리 분류
- 💳 **포인트 시스템**: 포인트 적립, 사용, 잔액 조회, 통계

### 기술 스택

- **Backend**: NestJS, TypeScript
- **Database**: Supabase (PostgreSQL)
- **Documentation**: Swagger/Post API docs
- **Validation**: class-validator, class-transformer
- **Security**: bcrypt (password hashing)

## 🚀 빠른 시작

### 1. 저장소 클론

```bash
git clone <repository-url>
cd the-movie-api
```

### 2. 의존성 설치

```bash
pnpm install
```

### 3. 환경변수 설정

`.env` 파일을 생성하고 다음 내용을 추가하세요:

```env
# Supabase 설정
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-supabase-anon-key

# 서버 설정
PORT=3000
NODE_ENV=development
```

### 4. 서버 실행

```bash
# 개발 모드 (자동 재시작)
pnpm start:dev

# 프로덕션 빌드 후 실행
pnpm build
pnpm start:prod
```

### 5. API 문서 확인

서버가 실행되면 다음 URL에서 API를 확인할 수 있습니다:

- **Swagger UI**: http://localhost:3000/api-docs
- **API 상태**: http://localhost:3000/health
- **데이터베이스 연결**: http://localhost:3000/health/database

## 📚 API 문서

자세한 API 문서는 다음에서 확인하세요:

- **🚀 [POSTMAN_QUICK_START.md](./POSTMAN_QUICK_START.md)** - Postman 빠른 시작 가이드
- **📖 [API_DOCS.md](./API_DOCS.md)** - 상세한 API 사용 가이드
- **📮 [POSTMAN_GUIDE.md](./POSTMAN_GUIDE.md)** - Postman 테스트 가이드
- **🌐 [Swagger UI](http://localhost:3000/api-docs)** - 인터랙티브 API 문서

### 주요 엔드포인트

| 카테고리 | 엔드포인트                          | 설명              |
| -------- | ----------------------------------- | ----------------- |
| 시스템   | `GET /health`                       | 서버 상태 확인    |
| 시스템   | `GET /health/database`              | DB 연결 상태 확인 |
| 사용자   | `POST /users`                       | 사용자 생성       |
| 사용자   | `GET /users/{userId}`               | 사용자 조회       |
| 매장     | `POST /stores`                      | 매장 생성         |
| 매장     | `GET /stores`                       | 매장 목록 조회    |
| 포인트   | `POST /pay-history/earn-points`     | 포인트 적립       |
| 포인트   | `POST /pay-history/use-points`      | 포인트 사용       |
| 포인트   | `GET /pay-history/balance/{userId}` | 포인트 잔액 조회  |

## 🧪 테스트

### Postman Collection 생성

```bash
# 기본 컬렉션 생성
pnpm postman:generate

# 응답 예시 포함 컬렉션 생성 (권장)
pnpm postman:generate-with-responses
```

생성된 JSON 파일을 Postman에서 Import하여 사용하세요:

1. **Postman 앱 열기**
2. **Import** 버튼 클릭
3. `Point-System-API-Collection-with-Responses.postman_collection.json` 파일 선택
4. **Environment 설정**: `baseUrl` = `http://localhost:3000`

### 단위 테스트

```bash
# 테스트 실행
pnpm test

# 테스트 커버리지 확인
pnpm test:cov

# 테스트 감시 모드
pnpm test:watch
```

### E2E 테스트

```bash
pnpm test:e2e
```

## 🛠️ 개발

### 사용 가능한 스크립트

```bash
# 개발 서버 실행 (자동 재시작)
pnpm start:dev

# 디버그 모드로 실행
pnpm start:debug

# 빌드
pnpm build

# 프로덕션 실행
pnpm start:prod

# 린트 검사 및 수정
pnpm lint

# 코드 포맷팅
pnpm format

# 문서 서버 실행 (개발 모드 + 문서 링크)
pnpm docs:serve
```

### 프로젝트 구조

```
src/
├── controllers/          # API 컨트롤러
│   ├── user.controller.ts
│   ├── store.controller.ts
│   └── pay-history.controller.ts
├── services/            # 비즈니스 로직
│   ├── user.service.ts
│   ├── store.service.ts
│   └── pay-history.service.ts
├── dto/                 # 데이터 전송 객체
│   ├── user.dto.ts
│   ├── store.dto.ts
│   ├── pay-history.dto.ts
│   └── response.dto.ts
├── config/              # 설정 파일
│   ├── database.config.ts
│   └── supabase.config.ts
├── filters/             # 예외 필터
│   └── http-exception.filter.ts
├── app.module.ts        # 앱 모듈
└── main.ts             # 진입점
```

## 📊 모니터링

### 헬스체크 엔드포인트

- `GET /health` - API 서버 상태
- `GET /health/database` - Supabase 연결 상태

### 로깅

애플리케이션은 다음과 같은 정보를 로깅합니다:

- API 요청/응답
- 데이터베이스 연결 상태
- 에러 및 예외 상황

## 🤝 기여하기

1. 이 저장소를 포크하세요
2. 기능 브랜치를 생성하세요 (`git checkout -b feature/AmazingFeature`)
3. 변경사항을 커밋하세요 (`git commit -m 'Add some AmazingFeature'`)
4. 브랜치에 푸시하세요 (`git push origin feature/AmazingFeature`)
5. Pull Request를 생성하세요

### 개발 가이드라인

- TypeScript를 사용하여 타입 안정성을 보장하세요
- 새로운 API는 Swagger 문서를 포함해야 합니다
- DTO 클래스에 적절한 validation을 추가하세요
- 일관된 응답 형식을 유지하세요
- 테스트 코드를 작성하세요

---
