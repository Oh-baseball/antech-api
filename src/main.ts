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

  // Swagger 설정
  const config = new DocumentBuilder()
    .setTitle('간편 결제 시스템 API')
    .setDescription(
      'Supabase를 백엔드로 사용하는 NestJS 기반의 개인 사용자 간편 결제 시스템\n\n' +
        '## 🎯 주요 기능\n' +
        '- 👤 **사용자 관리**: 회원가입, 로그인, 프로필 관리\n' +
        '- 🔐 **고급 인증**: PIN, 패턴, 생체인증 (지문, Face ID)\n' +
        '- 💰 **지갑 시스템**: 포인트 적립, 사용, 잔액 관리\n' +
        '- 🏪 **매장 관리**: 매장, 카테고리, 메뉴 관리\n' +
        '- 📦 **주문 시스템**: 주문 생성, 상품 관리\n' +
        '- 💳 **결제 시스템**: 카드, 계좌이체, 모바일페이, 포인트 결제\n' +
        '- 📊 **내역 관리**: 결제 내역, 포인트 내역 조회\n\n' +
        '## 🔄 결제 플로우\n' +
        '1. 사용자 로그인 및 인증 설정\n' +
        '2. 매장 선택 및 메뉴 주문\n' +
        '3. 결제수단 선택 (카드/계좌/모바일페이/포인트)\n' +
        '4. 보안 인증 (PIN/패턴/생체인증)\n' +
        '5. 결제 처리 및 포인트 적립\n' +
        '6. 결제 완료 및 내역 저장',
    )
    .setVersion('2.0')
    .addTag('system', '시스템 상태 확인')
    .addTag('users', '사용자 관리 - 회원가입, 로그인, 프로필')
    .addTag('stores', '매장 관리 - 매장, 카테고리, 메뉴')
    .addTag('orders', '주문 및 결제 - 주문 생성, 결제 처리, 내역 조회')
    .addServer('http://localhost:8000', '개발 서버')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
      displayRequestDuration: true,
    },
  });

  // 포트 설정
  const port = process.env.PORT || 8000;
  await app.listen(port);

  console.log(`🚀 Application is running on: http://localhost:${port}`);
  console.log(`📚 Swagger API Docs: http://localhost:${port}/api-docs`);
  console.log(`📋 API JSON: http://localhost:${port}/api-docs-json`);
}

bootstrap();
