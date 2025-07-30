// 간편 결제 시스템 - 주문 및 결제 컨트롤러

import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  ParseIntPipe,
  HttpStatus,
  HttpCode,
  NotFoundException,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody } from '@nestjs/swagger';
import { OrderService } from '../services/order.service';
import {
  CreateOrderDto,
  CreatePaymentDto,
  AuthenticateAndPayDto,
  CancelOrderDto,
  CancelOrderResultDto,
} from '../dto/store.dto';
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
    description: '특정 주문의 상세 정보를 조회합니다.',
  })
  @ApiParam({ name: 'orderId', description: '주문 ID' })
  @ApiResponse({
    status: 200,
    description: '주문 조회 성공',
    type: ResponseDto,
  })
  async getOrder(@Param('orderId') orderId: string): Promise<ResponseDto> {
    const order = await this.orderService.getOrderSummary(orderId);

    return {
      success: true,
      data: order,
      message: '주문 정보를 성공적으로 조회했습니다.',
    };
  }

  @Get('user/:userId')
  @ApiOperation({
    summary: '사용자 주문 내역 조회',
    description: '특정 사용자의 주문 내역을 조회합니다.',
  })
  @ApiParam({ name: 'userId', description: '사용자 ID' })
  @ApiResponse({
    status: 200,
    description: '사용자 주문 내역 조회 성공',
    type: ResponseDto,
  })
  async getUserOrders(
    @Param('userId', ParseIntPipe) userId: number,
  ): Promise<ResponseDto> {
    const orders = await this.orderService.getUserOrders(userId);

    return {
      success: true,
      data: orders,
      message: '사용자 주문 내역을 성공적으로 조회했습니다.',
    };
  }

  /* -------------------------------------------------------------
     결제 처리
  ------------------------------------------------------------- */

  @Post('payment')
  // @HttpCode(HttpStatus.CREATED)
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

  @Post('authenticate-and-pay')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: '인증 후 결제 처리',
    description:
      '사용자 인증(PIN, 패턴, 생체인증) 성공 시 바로 결제를 처리합니다. 보안이 중요한 결제에서 사용됩니다.',
  })
  @ApiResponse({
    status: 200,
    description: '인증 및 결제 처리 완료',
    type: ResponseDto,
    examples: {
      success: {
        summary: '인증 및 결제 성공',
        value: {
          success: true,
          data: {
            auth_success: true,
            payment_success: true,
            auth_result: {
              is_success: true,
              is_locked: false,
            },
            payment_result: {
              payment_id: 'PAY_20241201_123456',
              payment_status: 'COMPLETED',
              payment_amount: 15000,
              point_used: 1000,
              point_earned: 150,
              external_transaction_id: 'EXT_CARD_1733123456789_abc123',
              paid_at: '2024-12-01T10:30:00.000Z',
            },
          },
          message: '인증 및 결제가 성공적으로 완료되었습니다.',
        },
      },
      auth_fail: {
        summary: '인증 실패',
        value: {
          success: false,
          data: {
            auth_success: false,
            payment_success: false,
            auth_result: {
              is_success: false,
              failure_reason: 'WRONG_PIN',
              remaining_attempts: 2,
              is_locked: false,
            },
            failure_reason: 'PIN 번호가 올바르지 않습니다.',
          },
          message: '인증 또는 결제에 실패했습니다.',
        },
      },
      payment_fail: {
        summary: '인증 성공, 결제 실패',
        value: {
          success: false,
          data: {
            auth_success: true,
            payment_success: false,
            auth_result: {
              is_success: true,
              is_locked: false,
            },
            failure_reason: '결제 처리 실패: 포인트 잔액이 부족합니다.',
          },
          message: '인증 또는 결제에 실패했습니다.',
        },
      },
    },
  })
  async authenticateAndPay(
    @Body() authenticateAndPayDto: AuthenticateAndPayDto,
  ): Promise<ResponseDto> {
    const result = await this.orderService.authenticateAndPay(
      authenticateAndPayDto,
    );

    return {
      success: result.auth_success && result.payment_success,
      data: result,
      message:
        result.auth_success && result.payment_success
          ? '인증 및 결제가 성공적으로 완료되었습니다.'
          : '인증 또는 결제에 실패했습니다.',
    };
  }

  /* -------------------------------------------------------------
     결제 내역 조회
  ------------------------------------------------------------- */

  @Get('payment/:paymentId')
  @ApiOperation({
    summary: '결제 내역 조회',
    description: '특정 결제의 상세 내역을 조회합니다.',
  })
  @ApiParam({ name: 'paymentId', description: '결제 ID' })
  @ApiResponse({
    status: 200,
    description: '결제 내역 조회 성공',
    type: ResponseDto,
  })
  async getPaymentHistory(
    @Param('paymentId') paymentId: string,
  ): Promise<ResponseDto> {
    // paymentId를 이용해 특정 결제 내역을 조회하는 로직이 필요
    // 현재는 사용자 ID로만 조회 가능하므로 임시로 에러 처리
    throw new NotFoundException('특정 결제 내역 조회 기능은 구현 중입니다.');

    // 이 부분은 실제로 실행되지 않음 (위에서 예외 발생)
    return {
      success: false,
      data: null,
      message: '특정 결제 내역 조회 기능은 구현 중입니다.',
    };
  }

  @Get('payment/user/:userId')
  @ApiOperation({
    summary: '사용자 결제 내역 조회',
    description: '특정 사용자의 모든 결제 내역을 조회합니다.',
  })
  @ApiParam({ name: 'userId', description: '사용자 ID' })
  @ApiResponse({
    status: 200,
    description: '사용자 결제 내역 조회 성공',
    type: ResponseDto,
  })
  async getUserPaymentHistory(
    @Param('userId', ParseIntPipe) userId: number,
  ): Promise<ResponseDto> {
    const payments = await this.orderService.getPaymentHistory(userId);

    return {
      success: true,
      data: payments,
      message: '사용자 결제 내역을 성공적으로 조회했습니다.',
    };
  }

  /* -------------------------------------------------------------
     주문 취소
  ------------------------------------------------------------- */

  @Post(':orderId/cancel')
  @ApiOperation({
    summary: '주문 취소',
    description: '주문을 취소하고 결제 금액을 환불 처리합니다. 카드/계좌 결제는 3-5일, 포인트는 즉시 환불됩니다.',
  })
  @ApiParam({ 
    name: 'orderId', 
    description: '취소할 주문 ID',
    example: 'ORD_20241201_123456'
  })
  @ApiBody({
    type: CancelOrderDto,
    description: '주문 취소 요청 정보',
  })
  @ApiResponse({
    status: 200,
    description: '주문 취소 성공',
    type: CancelOrderResultDto,
  })
  @ApiResponse({
    status: 400,
    description: '잘못된 요청 (이미 취소된 주문, 권한 없음 등)',
  })
  @ApiResponse({
    status: 404,
    description: '주문을 찾을 수 없음',
  })
  async cancelOrder(
    @Param('orderId') orderId: string,
    @Body() cancelOrderDto: CancelOrderDto,
  ): Promise<ResponseDto> {
    const result = await this.orderService.cancelOrder(orderId, cancelOrderDto);

    return {
      success: true,
      data: result,
      message: '주문이 성공적으로 취소되었습니다.',
    };
  }
}
