import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AppService } from './app.service';
import { DatabaseConfig } from './config/database.config';

@ApiTags('🏠 system')
@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly databaseConfig: DatabaseConfig,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('health')
  @ApiOperation({
    summary: '헬스체크',
    description: 'API 서버 상태를 확인합니다.',
  })
  @ApiResponse({ status: 200, description: 'API 서버가 정상 작동 중입니다.' })
  getHealth() {
    return {
      success: true,
      message: 'API is running successfully',
      timestamp: new Date().toISOString(),
      version: '1.0.0',
    };
  }

  @Get('health/database')
  @ApiOperation({
    summary: 'Supabase 연결 테스트',
    description: 'Supabase 데이터베이스 연결 상태를 확인합니다.',
  })
  @ApiResponse({ status: 200, description: 'Supabase 연결이 정상입니다.' })
  @ApiResponse({ status: 500, description: 'Supabase 연결에 실패했습니다.' })
  async getDatabaseHealth() {
    try {
      const isConnected = await this.databaseConfig.testConnection();

      return {
        success: isConnected,
        message: isConnected
          ? '✅ Supabase 연결이 정상입니다.'
          : '❌ Supabase 연결에 실패했습니다.',
        timestamp: new Date().toISOString(),
        database: 'Supabase',
        status: isConnected ? 'connected' : 'disconnected',
      };
    } catch (error) {
      return {
        success: false,
        message: `❌ Supabase 연결 오류: ${error.message}`,
        timestamp: new Date().toISOString(),
        database: 'Supabase',
        status: 'error',
        error: error.message,
      };
    }
  }

  @Get('api/info')
  @ApiOperation({
    summary: 'API 정보 조회',
    description: 'API의 기본 정보와 사용 가능한 엔드포인트를 조회합니다.',
  })
  @ApiResponse({ status: 200, description: 'API 정보 조회 성공' })
  getApiInfo() {
    return {
      success: true,
      data: {
        name: '포인트 적립/사용 시스템 API',
        version: '1.0.0',
        description:
          'Supabase를 백엔드로 사용하는 NestJS 기반의 포인트 적립 및 사용 시스템',
        endpoints: {
          users: '/users',
          stores: '/stores',
          categories: '/categories',
          payHistory: '/pay-history',
        },
        documentation: 'README.md 파일을 참조하세요.',
      },
    };
  }
}
