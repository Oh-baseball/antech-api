// 간편 결제 시스템 - 애플리케이션 모듈

import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';

// 설정
import { DatabaseConfig } from './config/database.config';

// 컨트롤러
import { UserController } from './controllers/user.controller';
import { StoreController } from './controllers/store.controller';
import { OrderController } from './controllers/order.controller';

// 서비스
import { UserService } from './services/user.service';
import { StoreService } from './services/store.service';
import { OrderService } from './services/order.service';

// 필터
import { AllExceptionsFilter } from './filters/http-exception.filter';

@Module({
  imports: [
    // 환경변수 설정 추가
    ConfigModule.forRoot({
      isGlobal: true, // 전역에서 사용 가능
      envFilePath: '.env', // .env 파일 경로
      cache: true, // 성능 최적화를 위한 캐시
    }),
  ],
  controllers: [
    AppController,
    UserController,
    StoreController,
    OrderController,
  ],
  providers: [
    AppService,
    DatabaseConfig,
    UserService,
    StoreService,
    OrderService,
    {
      provide: 'APP_FILTER',
      useClass: AllExceptionsFilter,
    },
  ],
})
export class AppModule {}
