import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';

// Configuration
import { DatabaseConfig } from './config/database.config';

// Controllers
import { UserController } from './controllers/user.controller';
import { PayHistoryController } from './controllers/pay-history.controller';
import { CompanyController } from './controllers/company.controller';
import {
  StoreController,
  CategoryController,
} from './controllers/store.controller';
import {
  LogoController,
  PaymentMethodController,
  AccountController,
  CardController,
  TossController,
} from './controllers/payment.controller';

// Services
import { UserService } from './services/user.service';
import { PayHistoryService } from './services/pay-history.service';
import { StoreService } from './services/store.service';
import { CompanyService } from './services/company.service';
import { PaymentService } from './services/payment.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
  ],
  controllers: [
    AppController,
    UserController,
    PayHistoryController,
    StoreController,
    CategoryController,
    CompanyController,
    LogoController,
    PaymentMethodController,
    AccountController,
    CardController,
    TossController,
  ],
  providers: [
    AppService,
    DatabaseConfig,
    UserService,
    PayHistoryService,
    StoreService,
    CompanyService,
    PaymentService,
  ],
})
export class AppModule {}
