import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  HttpCode,
  HttpStatus,
  ParseIntPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { PayHistoryService } from '../services/pay-history.service';
import { CreatePayHistoryDto } from '../dto/pay-history.dto';
import {
  PayHistoryResponseDto,
  PayHistoriesResponseDto,
  PointBalanceResponseDto,
  MonthlyStatsResponseDto,
  ErrorResponseDto,
} from '../dto/response.dto';

@ApiTags('pay-history')
@Controller('pay-history')
export class PayHistoryController {
  constructor(private readonly payHistoryService: PayHistoryService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: '결제 이력 생성',
    description: '새로운 결제 이력을 생성합니다.',
  })
  @ApiResponse({
    status: 201,
    description: '결제 이력이 성공적으로 생성되었습니다.',
    type: PayHistoryResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: '잘못된 요청 데이터입니다.',
    type: ErrorResponseDto,
  })
  async createPayHistory(@Body() createPayHistoryDto: CreatePayHistoryDto) {
    const payHistory =
      await this.payHistoryService.createPayHistory(createPayHistoryDto);
    return {
      success: true,
      data: payHistory,
      message: '결제 이력이 성공적으로 생성되었습니다.',
    };
  }

  @Get('user/:userId')
  @ApiOperation({
    summary: '사용자 결제 이력 조회',
    description: '특정 사용자의 모든 결제 이력을 조회합니다.',
  })
  @ApiParam({ name: 'userId', description: '사용자 ID (숫자)', example: 1 })
  @ApiResponse({
    status: 200,
    description: '사용자 결제 이력 조회 성공',
    type: PayHistoriesResponseDto,
  })
  async getUserPayHistory(@Param('userId', ParseIntPipe) userId: number) {
    const payHistory = await this.payHistoryService.findByUserId(userId);
    return {
      success: true,
      data: payHistory,
    };
  }

  @Get('store/:storeId')
  @ApiOperation({
    summary: '매장 결제 이력 조회',
    description: '특정 매장의 모든 결제 이력을 조회합니다.',
  })
  @ApiParam({ name: 'storeId', description: '매장 ID (숫자)', example: 1 })
  @ApiResponse({
    status: 200,
    description: '매장 결제 이력 조회 성공',
    type: PayHistoriesResponseDto,
  })
  async getStorePayHistory(@Param('storeId', ParseIntPipe) storeId: number) {
    const payHistory = await this.payHistoryService.findByStoreId(storeId);
    return {
      success: true,
      data: payHistory,
    };
  }

  @Get('pay/:payId')
  @ApiOperation({
    summary: '결제 내역 조회',
    description: '결제 ID로 결제 내역을 조회합니다.',
  })
  @ApiParam({ name: 'payId', description: '결제 ID', example: 'PAY0001' })
  @ApiResponse({
    status: 200,
    description: '결제 내역 조회 성공',
  })
  async getPayHistory(@Param('payId') payId: string) {
    const payHistory = await this.payHistoryService.findByPayId(payId);
    return {
      success: true,
      data: payHistory,
    };
  }

  @Get('user/:userId/balance')
  @ApiOperation({
    summary: '사용자 포인트 잔액 조회',
    description: '사용자의 현재 포인트 잔액을 조회합니다.',
  })
  @ApiParam({ name: 'userId', description: '사용자 ID (숫자)', example: 1 })
  @ApiResponse({
    status: 200,
    description: '포인트 잔액 조회 성공',
    type: PointBalanceResponseDto,
  })
  async getUserPointBalance(@Param('userId', ParseIntPipe) userId: number) {
    const balance = await this.payHistoryService.getUserPointBalance(userId);
    return {
      success: true,
      data: { balance },
      message: `현재 포인트 잔액: ${balance}원`,
    };
  }

  @Get('user/:userId/monthly-stats')
  @ApiOperation({
    summary: '월별 포인트 통계 조회',
    description: '사용자의 특정 월 포인트 사용 통계를 조회합니다.',
  })
  @ApiParam({ name: 'userId', description: '사용자 ID (숫자)', example: 1 })
  @ApiQuery({ name: 'year', description: '연도', example: '2024' })
  @ApiQuery({ name: 'month', description: '월 (1-12)', example: '1' })
  @ApiResponse({
    status: 200,
    description: '월별 통계 조회 성공',
    type: MonthlyStatsResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: '올바른 년도와 월을 입력해주세요.',
    type: ErrorResponseDto,
  })
  async getMonthlyStats(
    @Param('userId', ParseIntPipe) userId: number,
    @Query('year') year: string,
    @Query('month') month: string,
  ) {
    const yearNum = parseInt(year, 10);
    const monthNum = parseInt(month, 10);

    if (isNaN(yearNum) || isNaN(monthNum) || monthNum < 1 || monthNum > 12) {
      return {
        success: false,
        message: '올바른 년도와 월을 입력해주세요.',
      };
    }

    const stats = await this.payHistoryService.getMonthlyStats(
      userId,
      yearNum,
      monthNum,
    );
    return {
      success: true,
      data: stats,
    };
  }

  @Post('earn-points')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: '포인트 적립',
    description: '사용자에게 포인트를 적립합니다.',
  })
  @ApiResponse({
    status: 201,
    description: '포인트가 성공적으로 적립되었습니다.',
    type: PayHistoryResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: '적립할 포인트는 0보다 커야 합니다.',
    type: ErrorResponseDto,
  })
  async earnPoints(@Body() earnPointsDto: CreatePayHistoryDto) {
    // 포인트 적립 (양수)
    if (earnPointsDto.amount <= 0) {
      return {
        success: false,
        message: '적립할 포인트는 0보다 커야 합니다.',
      };
    }

    const payHistory = await this.payHistoryService.earnPoints(
      earnPointsDto.user_id,
      earnPointsDto.store_id,
      earnPointsDto.method_id,
      earnPointsDto.amount,
    );
    return {
      success: true,
      data: payHistory,
      message: `${earnPointsDto.amount}원이 적립되었습니다.`,
    };
  }

  @Post('use-points')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: '포인트 사용',
    description: '사용자의 포인트를 사용합니다.',
  })
  @ApiResponse({
    status: 201,
    description: '포인트가 성공적으로 사용되었습니다.',
    type: PayHistoryResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: '포인트 잔액이 부족합니다.',
    type: ErrorResponseDto,
  })
  async usePoints(@Body() usePointsDto: CreatePayHistoryDto) {
    if (usePointsDto.amount <= 0) {
      return {
        success: false,
        message: '사용할 포인트는 0보다 커야 합니다.',
      };
    }

    try {
      const payHistory = await this.payHistoryService.usePoints(
        usePointsDto.user_id,
        usePointsDto.store_id,
        usePointsDto.method_id,
        usePointsDto.amount,
      );

      return {
        success: true,
        data: payHistory,
        message: `${usePointsDto.amount}원이 사용되었습니다.`,
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  }

  @Get('method/:methodId/stats')
  @ApiOperation({
    summary: '결제 수단별 통계 조회',
    description: '특정 결제 수단의 이용 통계를 조회합니다.',
  })
  @ApiParam({
    name: 'methodId',
    description: '결제 수단 ID',
    example: 'METHOD0001',
  })
  @ApiResponse({
    status: 200,
    description: '결제 수단 통계 조회 성공',
  })
  async getPaymentMethodStats(@Param('methodId') methodId: string) {
    const stats = await this.payHistoryService.getPaymentMethodStats(methodId);
    return {
      success: true,
      data: stats,
    };
  }
}
