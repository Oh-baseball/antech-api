import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './filters/http-exception.filter';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // 프록시 서버 헤더 신뢰 설정
  app.set('trust proxy', true);

  app.setGlobalPrefix('api');

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

  // CORS 설정 - 환경별 분기 처리
  if (process.env.NODE_ENV === 'development') {
    // 로컬 개발 환경
    app.enableCors({
      origin: [
        'https://anpay.store',
        'https://www.anpay.store',
        'https://dh2ep87gva43g.cloudfront.net',
        'https://heroic-peony-7b58ca.netlify.app',
        'http://localhost:3000',
        'https://localhost:3000',
      ],
      methods: 'GET,PUT,PATCH,POST,DELETE,OPTIONS',
      credentials: false,
      allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
      optionsSuccessStatus: 200,
    });
    console.log('개발 환경: NestJS에서 CORS 처리');
  } else {
    // 프로덕션 환경
    app.enableCors({
      origin: [
        'https://anpay.store',
        'https://www.anpay.store',
        'https://dh2ep87gva43g.cloudfront.net',
        'https://heroic-peony-7b58ca.netlify.app',
        'http://localhost:3000',
        'https://localhost:3000',
      ],
      methods: 'GET,PUT,PATCH,POST,DELETE,OPTIONS',
      credentials: false,
      allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
      optionsSuccessStatus: 200,
    });
    console.log('프로덕션 환경: NestJS에서 CORS 처리 (www.anpay.store 허용)');
  }

  // Swagger 설정 - 전면 개편
  const config = new DocumentBuilder()
    .setTitle('🎬 The Movie API - 간편 결제 시스템')
    .setDescription(
      '**영화관 간편 결제 시스템**\n\n' +
        '---\n\n' +
        '### 🎯 **주요 기능**\n' +
        '- **회원 관리**: 회원가입, 로그인, 프로필 관리\n' +
        '- **보안 인증**: PIN, 패턴, 생체인증 (지문, Face ID)\n' +
        '- **매장 관리**: 매장 등록, 메뉴 관리, 카테고리 분류\n' +
        '- **주문 처리**: 메뉴 주문, 장바구니, 주문 내역\n' +
        '- **포인트 시스템**: 적립, 사용, 잔액 조회\n' +
        '### 💳 **결제수단 관리**\n' +
        '- **카드 등록**: 신용카드, 체크카드 등록 및 관리\n' +
        '- **간편결제**: 카카오페이, 네이버페이, 토스페이 연동\n' +
        '- **계좌이체**: 은행 계좌 등록 및 이체\n' +
        '- **포인트 결제**: 적립 포인트로 결제\n' +
        '- **기본 결제수단**: 사용자별 기본 결제수단 설정\n' +
        '---\n\n' +
        '### 📖 **API 사용 가이드**\n\n' +
        '#### 1️⃣ **회원가입 & 로그인**\n' +
        '```\n' +
        'POST /users → 회원가입\n' +
        'POST /users/login → 로그인\n' +
        'POST /users/{id}/auth-settings → 보안 설정\n' +
        '```\n\n' +
        '#### 2️⃣ **결제수단 등록**\n' +
        '```\n' +
        'GET /payment-methods/providers → 결제업체 목록\n' +
        'POST /payment-methods/users/{userId} → 결제수단 등록\n' +
        'GET /payment-methods/users/{userId} → 내 결제수단 목록\n' +
        'PUT /payment-methods/users/{userId}/methods/{methodId}/default → 기본 결제수단 설정\n' +
        '```\n\n' +
        '#### 3️⃣ **매장 & 메뉴**\n' +
        '```\n' +
        'GET /stores → 매장 목록\n' +
        'GET /stores/{id}/menus → 매장 메뉴\n' +
        'GET /stores/{id}/categories → 메뉴 카테고리\n' +
        '```\n\n' +
        '#### 4️⃣ **주문 & 결제**\n' +
        '```\n' +
        'POST /orders → 주문 생성\n' +
        'POST /orders/payment → 결제 처리\n' +
        'POST /orders/authenticate-and-pay → 인증 후 결제 처리 (PIN/패턴/생체인증)\n' +
        'GET /orders/users/{userId} → 주문 내역\n' +
        'GET /orders/payment/user/{userId} → 결제 내역\n' +
        '```\n\n' +
        '#### 5️⃣ **포인트 관리**\n' +
        '```\n' +
        'GET /users/{id}/wallet → 포인트 잔액\n' +
        'GET /orders/users/{userId}/point-history → 포인트 내역\n' +
        '```\n\n' +
        '---\n\n' +
        '### 🔐 **보안 인증**\n' +
        '- **PIN 인증**: 6자리 숫자 PIN\n' +
        '- **패턴 인증**: 9점 패턴 락\n' +
        '- **생체 인증**: 지문, Face ID\n' +
        '- **인증 실패 제한**: 5회 실패 시 계정 잠금\n\n' +
        '### 📊 **분석 & 통계**\n' +
        '- **매출 분석**: 일/월별 매출 현황\n' +
        '- **인기 메뉴**: 베스트셀러 메뉴 순위\n' +
        '- **결제 분석**: 결제수단별 사용 현황\n\n' +
        '---\n\n' +
        '### 🛠️ **개발자 도구**\n' +
        '```\n' +
        '# 테스트 데이터 생성\n' +
        'POST /stores/dev/generate-test-stores\n' +
        'POST /stores/{storeId}/dev/generate-test-menus\n' +
        'POST /payment-methods/dev/generate-test-methods/{userId}\n' +
        '```\n\n' +
        '### 🚀 **시작하기**\n' +
        '1. 회원가입 후 보안 설정 완료\n' +
        '2. 결제수단 등록 (카드, 간편결제 등)\n' +
        '3. 매장 선택 후 메뉴 주문\n' +
        '4. 포인트 적립 및 할인 혜택 활용\n\n',
    )
    .setVersion('1.0.0')
    .addTag('👤 users', '사용자 - 회원가입, 로그인, 프로필, 보안 설정')
    .addTag('🏪 stores', '매장 - 매장 관리, 메뉴, 카테고리')
    .addTag('📦 orders', '주문 - 주문 생성, 주문 내역')
    .addTag('💰 payments', '결제 - 결제 처리, 결제 내역')
    .addTag('🎯 points', '포인트 - 적립, 사용, 잔액 조회')
    .addTag('💳 payment-methods', '결제수단 - 카드, 계좌, 간편결제 관리')
    .addServer('http://localhost:8000', '로컬 개발 서버')
    .addServer(`${process.env.API_URL}`, 'EC2 서버 (Nginx 프록시)');

  // Swagger 문서 생성
  const document = SwaggerModule.createDocument(app, config.build(), {
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

  console.log('='.repeat(80));
  console.log('🎬 THE MOVIE API - 간편 결제 시스템');
  console.log('='.repeat(80));
  console.log(`🚀 서버가 포트 ${port}에서 실행 중입니다!`);
  console.log(`📚 API 문서: http://localhost:${port}/api-docs`);
  console.log(`🔍 헬스체크: http://localhost:${port}/health`);
  console.log('');
  console.log('📖 **주요 API Endpoints**:');
  console.log(`   • 회원가입: POST /users`);
  console.log(`   • 로그인: POST /users/login`);
  console.log(`   • 보안 설정: POST /users/{id}/auth-settings`);
  console.log(`   • 패턴 인증: POST /users/authenticate`);
  console.log(`   • 결제업체 목록: GET /payment-methods/providers`);
  console.log(`   • 결제수단 등록: POST /payment-methods/users/{userId}`);
  console.log(`   • 내 결제수단: GET /payment-methods/users/{userId}`);
  console.log(
    `   • 기본 결제수단 설정: PUT /payment-methods/users/{userId}/methods/{methodId}/default`,
  );
  console.log(`   • 매장 목록: GET /stores`);
  console.log(`   • 주문 생성: POST /orders`);
  console.log(`   • 결제 처리: POST /orders/payment`);
  console.log(`   • 인증 후 결제: POST /orders/authenticate-and-pay`);
  console.log('');
  console.log('🛠️ **개발용 테스트 API**:');
  console.log(`   • 테스트 매장: POST /stores/dev/generate-test-stores`);
  console.log(
    `   • 테스트 메뉴: POST /stores/{storeId}/dev/generate-test-menus`,
  );
  console.log(
    `   • 테스트 결제수단: POST /payment-methods/dev/generate-test-methods/{userId}`,
  );
  console.log('');
  console.log('💡 **팁**: 먼저 회원가입 후 테스트 결제수단을 생성하세요!');
  console.log('='.repeat(80));

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
