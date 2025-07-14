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
    .setTitle('포인트 적립/사용 시스템 API')
    .setDescription(
      'Supabase를 백엔드로 사용하는 NestJS 기반의 포인트 적립 및 사용 시스템',
    )
    .setVersion('1.0')
    .addTag('users', '사용자 관리')
    .addTag('stores', '매장 관리')
    .addTag('categories', '카테고리 관리')
    .addTag('pay-history', '포인트 관리')
    .addServer('http://localhost:3000', '개발 서버')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
      displayRequestDuration: true,
    },
  });

  // 포트 설정
  const port = process.env.PORT || 3000;
  await app.listen(port);

  console.log(`🚀 Application is running on: http://localhost:${port}`);
  console.log(`📚 Swagger API Docs: http://localhost:${port}/api-docs`);
  console.log(`📋 Postman Collection: http://localhost:${port}/api-docs-json`);
}

bootstrap();
