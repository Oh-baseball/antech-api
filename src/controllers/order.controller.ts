// 간편 결제 시스템 - 주문 및 결제 컨트롤러

import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { OrderService } from '../services/order.service';
import { CreateOrderDto } from '../dto/store.dto';
import { CreatePaymentDto } from '../entities/store.entity';
import { ResponseDto } from '../dto/response.dto';

@ApiTags('📦 orders', '💰 payments', '🎯 points')
@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  /* -------------------------------------------------------------
     주문 관리
  ------------------------------------------------------------- */

  @Post()
  @ApiOperation({
    summary: '주문 생성',
    description: '새로운 주문을 생성합니다.',
  })
  @ApiResponse({
    status: 201,
    description: '주문 생성 성공',
    type: ResponseDto,
  })
  async createOrder(
    @Body() createOrderDto: CreateOrderDto,
  ): Promise<ResponseDto> {
    const order = await this.orderService.createOrder(createOrderDto);

    return {
      success: true,
      data: order,
      message: '주문이 성공적으로 생성되었습니다.',
    };
  }

  @Get(':orderId')
  @ApiOperation({
    summary: '주문 조회',
    description: '주문 상세 정보를 조회합니다.',
  })
  @ApiParam({ name: 'orderId', description: '주문 ID' })
  @ApiResponse({
    status: 200,
    description: '주문 조회 성공',
    type: ResponseDto,
  })
  async getOrderSummary(
    @Param('orderId') orderId: string,
  ): Promise<ResponseDto> {
    const order = await this.orderService.getOrderSummary(orderId);

    return {
      success: true,
      data: order,
      message: '주문 정보를 성공적으로 조회했습니다.',
    };
  }

  @Get('user/:userId')
  @ApiOperation({
    summary: '사용자별 주문 내역',
    description: '사용자의 모든 주문 내역을 조회합니다.',
  })
  @ApiParam({ name: 'userId', description: '사용자 ID' })
  @ApiResponse({
    status: 200,
    description: '사용자별 주문 내역 조회 성공',
    type: ResponseDto,
  })
  async getUserOrders(
    @Param('userId', ParseIntPipe) userId: number,
  ): Promise<ResponseDto> {
    const orders = await this.orderService.getUserOrders(userId);

    return {
      success: true,
      data: orders,
      message: '사용자별 주문 내역을 성공적으로 조회했습니다.',
    };
  }

  @Get('store/:storeId')
  @ApiOperation({
    summary: '매장별 주문 내역',
    description: '매장의 모든 주문 내역을 조회합니다.',
  })
  @ApiParam({ name: 'storeId', description: '매장 ID' })
  @ApiResponse({
    status: 200,
    description: '매장별 주문 내역 조회 성공',
    type: ResponseDto,
  })
  async getStoreOrders(
    @Param('storeId', ParseIntPipe) storeId: number,
  ): Promise<ResponseDto> {
    const orders = await this.orderService.getStoreOrders(storeId);

    return {
      success: true,
      data: orders,
      message: '매장별 주문 내역을 성공적으로 조회했습니다.',
    };
  }

  /* -------------------------------------------------------------
     결제 처리
  ------------------------------------------------------------- */

  @Post('payment')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: '결제 처리',
    description: '주문에 대한 결제를 처리합니다.',
  })
  @ApiResponse({
    status: 200,
    description: '결제 처리 성공',
    type: ResponseDto,
  })
  async processPayment(
    @Body() createPaymentDto: CreatePaymentDto,
  ): Promise<ResponseDto> {
    const paymentResult =
      await this.orderService.processPayment(createPaymentDto);

    return {
      success: true,
      data: paymentResult,
      message: '결제가 성공적으로 처리되었습니다.',
    };
  }

  @Get('payment/history/:userId')
  @ApiOperation({
    summary: '결제 내역 조회',
    description: '사용자의 결제 내역을 조회합니다.',
  })
  @ApiParam({ name: 'userId', description: '사용자 ID' })
  @ApiResponse({
    status: 200,
    description: '결제 내역 조회 성공',
    type: ResponseDto,
  })
  async getPaymentHistory(
    @Param('userId', ParseIntPipe) userId: number,
  ): Promise<ResponseDto> {
    const paymentHistory = await this.orderService.getPaymentHistory(userId);

    return {
      success: true,
      data: paymentHistory,
      message: '결제 내역을 성공적으로 조회했습니다.',
    };
  }

  @Get('points/history/:userId')
  @ApiOperation({
    summary: '포인트 내역 조회',
    description: '사용자의 포인트 내역을 조회합니다.',
  })
  @ApiParam({ name: 'userId', description: '사용자 ID' })
  @ApiResponse({
    status: 200,
    description: '포인트 내역 조회 성공',
    type: ResponseDto,
  })
  async getPointHistory(
    @Param('userId', ParseIntPipe) userId: number,
  ): Promise<ResponseDto> {
    const pointHistory = await this.orderService.getPointHistory(userId);

    return {
      success: true,
      data: pointHistory,
      message: '포인트 내역을 성공적으로 조회했습니다.',
    };
  }
}
