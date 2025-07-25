import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './filters/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 글로벌 예외 필터 적용
  app.useGlobalFilters(new AllExceptionsFilter());

  // 글로벌 유효성 검사 파이프 적용
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // CORS 설정
  app.enableCors({
    origin: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  // Swagger 설정 - 전면 개편
  const config = new DocumentBuilder()
    .setTitle('🏪 간편 결제 시스템 API v3.0')
    .setDescription(
      '**Supabase 기반 고급 보안 간편 결제 시스템**\n\n' +
        '---\n\n' +
        '## 🎯 **핵심 기능**\n\n' +
        '### 👤 **사용자 관리**\n' +
        '- 회원가입/로그인 (이메일 + 비밀번호)\n' +
        '- 사용자 프로필 관리\n' +
        '- 지갑 시스템 (포인트 잔액 관리)\n\n' +
        '### 🔐 **고급 보안 인증**\n' +
        '- **PIN 인증**: 6자리 숫자 PIN\n' +
        '- **패턴 인증**: 9개 점 연결 패턴\n' +
        '- **생체 인증**: 지문, Face ID\n' +
        '- **보안 설정**: 시도 횟수 제한, 계정 잠금\n' +
        '- **인증 로그**: 모든 인증 시도 기록\n\n' +
        '### 💳 **결제수단 관리**\n' +
        '- **신용/체크카드**: Luhn 알고리즘 검증\n' +
        '- **계좌이체**: 실명 확인 연동\n' +
        '- **간편결제**: 카카오페이, 네이버페이, 토스페이, 삼성페이\n' +
        '- **포인트 결제**: 적립 포인트 사용\n' +
        '- **토큰화**: 결제 정보 암호화 저장\n\n' +
        '### 🏪 **매장 및 메뉴**\n' +
        '- 매장 정보 관리\n' +
        '- 카테고리별 메뉴 분류\n' +
        '- 메뉴 가격 및 재고 관리\n' +
        '- 매장별 포인트 적립률 설정\n\n' +
        '### 📦 **주문 시스템**\n' +
        '- 장바구니 기능\n' +
        '- 주문 생성 및 관리\n' +
        '- 주문 상태 추적\n' +
        '- 주문 취소/환불\n\n' +
        '### 💰 **포인트 시스템**\n' +
        '- 결제 시 자동 적립\n' +
        '- 포인트 사용 결제\n' +
        '- 포인트 만료 관리\n' +
        '- 포인트 내역 추적\n\n' +
        '---\n\n' +
        '## 🔄 **결제 플로우**\n\n' +
        '### 1️⃣ **사용자 인증**\n' +
        '```\n' +
        'POST /users/register → 회원가입\n' +
        'POST /users/login → 로그인\n' +
        'POST /auth/pin/setup → PIN 설정\n' +
        '```\n\n' +
        '### 2️⃣ **결제수단 등록**\n' +
        '```\n' +
        'GET /payment-methods/providers → 결제업체 목록\n' +
        'POST /payment-methods/card → 카드 등록\n' +
        'POST /payment-methods/mobile-pay → 간편결제 등록\n' +
        '```\n\n' +
        '### 3️⃣ **주문 생성**\n' +
        '```\n' +
        'GET /stores → 매장 목록\n' +
        'GET /stores/{storeId}/menu → 메뉴 조회\n' +
        'POST /orders → 주문 생성\n' +
        '```\n\n' +
        '### 4️⃣ **보안 결제**\n' +
        '```\n' +
        'POST /orders/payment → 결제 요청\n' +
        '↓ (고액 결제 시)\n' +
        'POST /orders/payment/verify-auth → 추가 인증\n' +
        '↓\n' +
        'POST /orders/payment → 최종 결제\n' +
        '```\n\n' +
        '### 5️⃣ **결제 완료**\n' +
        '```\n' +
        'GET /orders/payment/history/{userId} → 결제 내역\n' +
        'GET /orders/points/history/{userId} → 포인트 내역\n' +
        '```\n\n' +
        '---\n\n' +
        '## 🔒 **보안 특징**\n\n' +
        '- **다단계 인증**: 금액별 차등 인증\n' +
        '- **토큰화**: 민감한 결제 정보 암호화\n' +
        '- **실시간 모니터링**: 의심스러운 활동 탐지\n' +
        '- **계정 보호**: 자동 잠금 및 해제\n' +
        '- **감사 로그**: 모든 인증/결제 시도 기록\n\n' +
        '---\n\n' +
        '## 📊 **분석 기능**\n\n' +
        '- **사용자 분석**: 주문 패턴, 선호 매장\n' +
        '- **매장 분석**: 매출 통계, 인기 메뉴\n' +
        '- **보안 분석**: 인증 실패 패턴\n' +
        '- **결제 분석**: 결제수단별 사용 현황\n\n' +
        '---\n\n' +
        '## 🚀 **개발 가이드**\n\n' +
        '### **환경 설정**\n' +
        '```bash\n' +
        '# 서버 실행\n' +
        'pnpm start:dev\n' +
        '\n' +
        '# API 문서\n' +
        'http://localhost:8000/api-docs\n' +
        '\n' +
        '# 테스트 데이터 생성\n' +
        'POST /users/dev/generate-test-user\n' +
        'POST /payment-methods/dev/generate-test-methods/{userId}\n' +
        '```\n\n' +
        '### **인증 테스트**\n' +
        '```json\n' +
        '{\n' +
        '  "testUser": {\n' +
        '    "email": "kim@example.com",\n' +
        '    "pin": "123456",\n' +
        '    "pattern": "147852963"\n' +
        '  }\n' +
        '}\n' +
        '```\n\n' +
        '---\n\n' +
        '**💡 Tip**: 모든 API는 실제 결제사 연동을 시뮬레이션하며, 개발 환경에서는 안전한 테스트 데이터를 사용합니다.',
    )
    .setVersion('3.0.0')
    .setContact(
      '개발팀',
      'https://github.com/your-repo/payment-system',
      'dev@paymentapp.com',
    )
    .setLicense('MIT', 'https://opensource.org/licenses/MIT')

    // 서버 환경별 설정
    .addServer('http://localhost:8000', '🔧 개발 서버')
    .addServer('https://api-staging.paymentapp.com', '🧪 스테이징 서버')
    .addServer('https://api.paymentapp.com', '🚀 운영 서버')

    // API 태그 분류 (새로운 구조)
    .addTag('🏠 system', '시스템 상태 및 헬스체크')
    .addTag('👤 users', '사용자 관리 - 회원가입, 로그인, 프로필')
    .addTag('🔐 auth', '보안 인증 - PIN, 패턴, 생체인증')
    .addTag('💳 payment-methods', '결제수단 - 카드, 계좌, 간편결제 관리')
    .addTag('🏪 stores', '매장 관리 - 매장, 카테고리, 메뉴')
    .addTag('📦 orders', '주문 시스템 - 주문 생성, 상태 관리')
    .addTag('💰 payments', '결제 처리 - 결제 실행, 내역 조회')
    .addTag('🎯 points', '포인트 시스템 - 적립, 사용, 내역')
    .addTag('📊 analytics', '분석 및 통계 - 사용자/매장 분석')
    .addTag('🛠️ admin', '관리자 기능 - 시스템 관리')
    .addTag('🧪 dev', '개발 도구 - 테스트 데이터, 디버깅')

    // 보안 스키마 추가
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: '사용자 인증 토큰',
        in: 'header',
      },
      'JWT-auth',
    )

    // API 키 인증 (관리자용)
    .addApiKey(
      {
        type: 'apiKey',
        name: 'X-API-Key',
        in: 'header',
        description: '관리자 API 키',
      },
      'API-Key',
    )

    .build();

  // Swagger 문서 생성
  const document = SwaggerModule.createDocument(app, config, {
    operationIdFactory: (controllerKey: string, methodKey: string) => methodKey,
    deepScanRoutes: true,
  });

  // 추가 스키마 정의
  document.components = {
    ...document.components,
    schemas: {
      ...document.components?.schemas,

      // 공통 응답 스키마
      SuccessResponse: {
        type: 'object',
        properties: {
          success: { type: 'boolean', example: true },
          data: { type: 'object' },
          message: {
            type: 'string',
            example: '작업이 성공적으로 완료되었습니다.',
          },
          timestamp: { type: 'string', format: 'date-time' },
        },
      },

      ErrorResponse: {
        type: 'object',
        properties: {
          success: { type: 'boolean', example: false },
          error: {
            type: 'object',
            properties: {
              code: { type: 'string', example: 'VALIDATION_ERROR' },
              message: {
                type: 'string',
                example: '입력값이 올바르지 않습니다.',
              },
              details: { type: 'array', items: { type: 'string' } },
            },
          },
          timestamp: { type: 'string', format: 'date-time' },
        },
      },

      // 페이징 스키마
      PaginationMeta: {
        type: 'object',
        properties: {
          page: { type: 'number', example: 1 },
          limit: { type: 'number', example: 10 },
          total: { type: 'number', example: 100 },
          totalPages: { type: 'number', example: 10 },
        },
      },

      // 인증 관련 스키마
      AuthChallenge: {
        type: 'object',
        properties: {
          authRequired: { type: 'boolean', example: true },
          authTypes: {
            type: 'array',
            items: { type: 'string' },
            example: ['PIN', 'FINGERPRINT', 'FACE_ID'],
          },
          requiredAmount: { type: 'number', example: 25000 },
          challengeId: { type: 'string', example: 'auth_challenge_12345' },
        },
      },
    },
  };

  // Swagger UI 설정 (고급 옵션)
  SwaggerModule.setup('api-docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
      displayRequestDuration: true,
      docExpansion: 'none',
      filter: true,
      showExtensions: true,
      showCommonExtensions: true,
      syntaxHighlight: {
        activate: true,
        theme: 'agate',
      },
      tryItOutEnabled: true,
    },
    customSiteTitle: '간편 결제 시스템 API 문서',
    customfavIcon: '/favicon.ico',
  });

  // 포트 설정
  const port = process.env.PORT || 8000;
  await app.listen(port);

  console.log(`🚀 Application is running on: http://localhost:${port}`);
  console.log(`📚 Swagger API Docs: http://localhost:${port}/api-docs`);
  console.log(`📋 API JSON Schema: http://localhost:${port}/api-docs-json`);
  console.log(`🔍 Health Check: http://localhost:${port}/health`);

  // 개발 환경 추가 정보
  if (process.env.NODE_ENV === 'development') {
    console.log(`\n📖 개발 가이드:`);
    console.log(`   • 테스트 사용자: POST /users/dev/generate-test-user`);
    console.log(
      `   • 테스트 결제수단: POST /payment-methods/dev/generate-test-methods/{userId}`,
    );
    console.log(
      `   • 테스트 주문: POST /orders/dev/generate-test-orders/{userId}`,
    );
    console.log(`\n🔐 테스트 인증 정보:`);
    console.log(`   • 이메일: kim@example.com`);
    console.log(`   • PIN: 123456`);
    console.log(`   • 패턴: 147852963`);
  }
}

bootstrap();
