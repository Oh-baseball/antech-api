// 간편 결제 시스템 - 주문 및 결제 서비스

import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import {
  Order,
  OrderItem,
  PaymentHistory,
  PointHistory,
  CreateOrderDto,
  OrderSummaryDto,
  CreatePaymentDto,
  PaymentResultDto,
} from '../entities/store.entity';
import {
  PaymentType,
  PaymentStatus,
  PointTransactionType,
  AuthType,
} from '../entities/user.entity';
import { UserService } from './user.service';
import {
  AuthenticateAndPayDto,
  AuthenticatedPaymentResultDto,
} from '../dto/store.dto';

@Injectable()
export class OrderService {
  private supabase: SupabaseClient;

  constructor(private readonly userService: UserService) {
    this.supabase = createClient(
      process.env.SUPABASE_URL || '',
      process.env.SUPABASE_ANON_KEY || '',
    );
  }

  /* -------------------------------------------------------------
     인증 후 결제 처리
  ------------------------------------------------------------- */

  // 인증 후 결제 처리
  async authenticateAndPay(
    authenticateAndPayDto: AuthenticateAndPayDto,
  ): Promise<AuthenticatedPaymentResultDto> {
    const {
      // 인증 정보
      user_id,
      auth_type,
      auth_value,
      device_info,
      // 결제 정보
      order_id,
      method_id,
      payment_method,
      payment_amount,
      point_used = 0,
    } = authenticateAndPayDto;

    try {
      // 1단계: 사용자 인증
      const authResult = await this.userService.authenticate({
        user_id,
        auth_type,
        auth_value,
        device_info,
      });

      if (!authResult.is_success) {
        return {
          auth_success: false,
          payment_success: false,
          auth_result: authResult,
          failure_reason: this.getAuthFailureMessage(authResult.failure_reason),
        };
      }

      // 2단계: 결제 처리
      const paymentResult = await this.processPayment({
        order_id,
        user_id,
        method_id,
        payment_method,
        payment_amount,
        point_used,
      });

      return {
        auth_success: true,
        payment_success: true,
        auth_result: authResult,
        payment_result: paymentResult,
      };
    } catch (error) {
      // 인증은 성공했지만 결제에서 실패한 경우
      return {
        auth_success: true,
        payment_success: false,
        auth_result: { is_success: true },
        failure_reason: `결제 처리 실패: ${error.message}`,
      };
    }
  }

  // 인증 실패 메시지 변환
  private getAuthFailureMessage(failureReason?: string): string {
    switch (failureReason) {
      case 'WRONG_PIN':
        return 'PIN 번호가 올바르지 않습니다.';
      case 'WRONG_PATTERN':
        return '패턴이 올바르지 않습니다.';
      case 'BIOMETRIC_NOT_ENABLED':
        return '생체인증이 활성화되지 않았습니다.';
      case 'ACCOUNT_LOCKED':
        return '계정이 잠겨있습니다. 잠시 후 다시 시도해주세요.';
      case 'INVALID_AUTH_TYPE':
        return '지원하지 않는 인증 방식입니다.';
      default:
        return '인증에 실패했습니다.';
    }
  }

  /* -------------------------------------------------------------
     주문 관리
  ------------------------------------------------------------- */

  // 주문 생성
  async createOrder(createOrderDto: CreateOrderDto): Promise<OrderSummaryDto> {
    const { user_id, store_id, items, point_used = 0 } = createOrderDto;

    // 사용자 포인트 잔액 확인
    if (point_used > 0) {
      const userBalance = await this.getUserPointBalance(user_id);
      if (userBalance < point_used) {
        throw new BadRequestException('포인트 잔액이 부족합니다.');
      }
    }

    // 주문 ID 생성 (ORD + YYYYMMDD + 순번)
    const order_id = await this.generateOrderId();

    // 주문 상품들의 총 금액 계산
    let total_amount = 0;
    const orderItemsData: any[] = [];

    for (const item of items) {
      // 메뉴 정보 조회
      const { data: menu, error } = await this.supabase
        .from('menu')
        .select('price, is_available')
        .eq('menu_id', item.menu_id)
        .single();

      if (error || !menu) {
        throw new NotFoundException(
          `메뉴 ID ${item.menu_id}를 찾을 수 없습니다.`,
        );
      }

      if (!menu.is_available) {
        throw new BadRequestException(
          `메뉴 ID ${item.menu_id}는 현재 판매 중지되었습니다.`,
        );
      }

      const item_total = menu.price * item.quantity;
      total_amount += item_total;

      orderItemsData.push({
        order_id,
        menu_id: item.menu_id,
        quantity: item.quantity,
        unit_price: menu.price,
        total_price: item_total,
      });
    }

    // 최종 결제 금액 계산
    const final_amount = Math.max(0, total_amount - point_used);

    // 주문 생성
    const { data: order, error: orderError } = await this.supabase
      .from('orders')
      .insert({
        order_id,
        user_id,
        store_id,
        total_amount,
        discount_amount: 0,
        point_used,
        final_amount,
        order_status: 'PENDING',
      })
      .select()
      .single();

    if (orderError) {
      throw new Error(`주문 생성 실패: ${orderError.message}`);
    }

    // 주문 상품 생성
    const { error: itemsError } = await this.supabase
      .from('order_items')
      .insert(orderItemsData);

    if (itemsError) {
      throw new Error(`주문 상품 생성 실패: ${itemsError.message}`);
    }

    // 주문 상세 정보 조회
    return this.getOrderSummary(order_id);
  }

  // 주문 상세 조회 (기본 정보)
  async getOrder(orderId: string): Promise<Order> {
    const { data: order, error } = await this.supabase
      .from('orders')
      .select('*')
      .eq('order_id', orderId)
      .single();

    if (error || !order) {
      throw new NotFoundException('주문을 찾을 수 없습니다.');
    }

    return order;
  }

  // 주문 상세 조회 (요약 정보 포함)
  async getOrderSummary(orderId: string): Promise<OrderSummaryDto> {
    const order = await this.getOrder(orderId); // getOrder 재사용

    const { data: items, error: itemsError } = await this.supabase
      .from('order_items')
      .select(
        `
        *,
        menu:menu_id(menu_name)
      `,
      )
      .eq('order_id', orderId);

    if (itemsError) {
      throw new Error(`주문 상품 조회 실패: ${itemsError.message}`);
    }

    return {
      order_id: order.order_id,
      total_amount: order.total_amount,
      discount_amount: order.discount_amount,
      point_used: order.point_used,
      final_amount: order.final_amount,
      order_status: order.order_status,
      created_at: order.created_at,
      items:
        items?.map((item) => ({
          menu_id: item.menu_id,
          menu_name: item.menu?.menu_name || '',
          quantity: item.quantity,
          unit_price: item.unit_price,
          total_price: item.total_price,
        })) || [],
    };
  }

  // 사용자별 주문 내역 조회
  async getUserOrders(userId: number): Promise<OrderSummaryDto[]> {
    const { data: orders, error } = await this.supabase
      .from('orders')
      .select('order_id')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(`주문 내역 조회 실패: ${error.message}`);
    }

    const orderSummaries: OrderSummaryDto[] = [];
    for (const order of orders || []) {
      const summary = await this.getOrderSummary(order.order_id);
      orderSummaries.push(summary);
    }

    return orderSummaries;
  }

  // 매장별 주문 내역 조회
  async getStoreOrders(storeId: number): Promise<OrderSummaryDto[]> {
    const { data: orders, error } = await this.supabase
      .from('orders')
      .select('order_id')
      .eq('store_id', storeId)
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(`매장 주문 내역 조회 실패: ${error.message}`);
    }

    const orderSummaries: OrderSummaryDto[] = [];
    for (const order of orders || []) {
      const summary = await this.getOrderSummary(order.order_id);
      orderSummaries.push(summary);
    }

    return orderSummaries;
  }

  /* -------------------------------------------------------------
     결제 처리
  ------------------------------------------------------------- */

  // 결제 처리
  async processPayment(
    createPaymentDto: CreatePaymentDto,
  ): Promise<PaymentResultDto> {
    const {
      order_id,
      user_id,
      method_id,
      payment_method,
      payment_amount,
      point_used = 0,
    } = createPaymentDto;

    console.log('=== 결제 처리 시작 ===');
    console.log('결제 요청 데이터:', {
      order_id,
      user_id,
      payment_amount,
      point_used,
      payment_method,
    });

    // 주문 확인
    const { data: order, error: orderError } = await this.supabase
      .from('orders')
      .select('*')
      .eq('order_id', order_id)
      .single();

    if (orderError || !order) {
      console.error('주문 조회 실패:', orderError);
      throw new NotFoundException('주문을 찾을 수 없습니다.');
    }

    console.log('주문 정보:', {
      order_id: order.order_id,
      final_amount: order.final_amount,
      order_status: order.order_status,
      point_used: order.point_used,
    });

    if (order.order_status !== 'PENDING') {
      console.error('주문 상태 오류:', order.order_status);
      throw new BadRequestException('이미 처리된 주문입니다.');
    }

    // 결제 금액 검증 (total_amount 기준으로 변경)
    if (payment_amount + point_used !== order.total_amount) {
      throw new BadRequestException(
        `결제 금액이 올바르지 않습니다. 요청된 금액: ${payment_amount + point_used}, 주문 총액: ${order.total_amount}`,
      );
    }

    // 포인트 사용 시 잔액 확인 및 자동 지갑 생성
    if (point_used > 0) {
      try {
        const userBalance = await this.getUserPointBalance(user_id);
        console.log('사용자 포인트 잔액:', userBalance);

        if (userBalance < point_used) {
          console.error('포인트 잔액 부족:', {
            available: userBalance,
            requested: point_used,
            shortage: point_used - userBalance,
          });
          throw new BadRequestException(
            `포인트 잔액이 부족합니다. 보유: ${userBalance}원, 사용 요청: ${point_used}원`,
          );
        }
      } catch (error) {
        if (error.message.includes('사용자 지갑을 찾을 수 없습니다')) {
          console.log('사용자 지갑이 없어서 자동 생성합니다.');
          await this.createUserWalletIfNotExists(user_id);

          // 새로 생성된 지갑은 잔액이 0이므로 포인트 사용 불가
          if (point_used > 0) {
            throw new BadRequestException(
              '새로 생성된 지갑에는 포인트가 없습니다. 포인트 사용 없이 다시 시도해주세요.',
            );
          }
        } else {
          throw error;
        }
      }
    }

    // 결제 ID 생성
    const payment_id = await this.generatePaymentId();

    try {
      // 외부 결제 처리 (실제로는 결제 게이트웨이 연동)
      const externalResult = await this.processExternalPayment(
        payment_method,
        payment_amount,
        method_id,
      );

      // 결제 내역 생성
      const { data: payment, error: paymentError } = await this.supabase
        .from('payment_history')
        .insert({
          payment_id,
          order_id,
          user_id,
          method_id,
          payment_amount,
          point_used,
          point_earned: Math.floor(payment_amount * 0.01), // 1% 적립
          payment_status: PaymentStatus.COMPLETED,
          payment_method,
          external_transaction_id: externalResult.transactionId,
          paid_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (paymentError) {
        throw new Error(`결제 내역 생성 실패: ${paymentError.message}`);
      }

      // 포인트 사용 처리
      if (point_used > 0) {
        await this.usePoints(user_id, point_used, payment_id);
      }

      // 포인트 적립 처리
      if (payment.point_earned > 0) {
        await this.earnPoints(user_id, payment.point_earned, payment_id);
      }

      // 주문 상태 업데이트
      await this.supabase
        .from('orders')
        .update({ order_status: 'COMPLETED' })
        .eq('order_id', order_id);

      return {
        payment_id: payment.payment_id,
        payment_status: payment.payment_status,
        payment_amount: payment.payment_amount,
        point_used: payment.point_used,
        point_earned: payment.point_earned,
        external_transaction_id: payment.external_transaction_id,
        paid_at: payment.paid_at,
      };
    } catch (error) {
      console.error('=== 결제 처리 실패 ===');
      console.error('에러 정보:', {
        message: error.message,
        stack: error.stack,
        payment_id,
        order_id,
        user_id,
      });

      // 결제 실패 처리
      try {
        await this.supabase.from('payment_history').insert({
          payment_id,
          order_id,
          user_id,
          method_id,
          payment_amount,
          point_used,
          point_earned: 0,
          payment_status: PaymentStatus.FAILED,
          payment_method,
        });
        console.log('결제 실패 내역이 저장되었습니다.');
      } catch (insertError) {
        console.error('결제 실패 내역 저장 실패:', insertError);
      }

      throw new BadRequestException(`결제 처리 실패: ${error.message}`);
    }
  }

  // 결제 내역 조회
  async getPaymentHistory(userId: number): Promise<PaymentHistory[]> {
    const { data: payments, error } = await this.supabase
      .from('payment_history')
      .select(
        `
        *,
        orders:order_id(
          store_id,
          store:store_id(store_name)
        )
      `,
      )
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(`결제 내역 조회 실패: ${error.message}`);
    }

    return payments || [];
  }

  /* -------------------------------------------------------------
     포인트 관리
  ------------------------------------------------------------- */

  // 포인트 적립
  private async earnPoints(
    userId: number,
    amount: number,
    paymentId: string,
  ): Promise<void> {
    // 현재 잔액 조회
    const currentBalance = await this.getUserPointBalance(userId);
    const newBalance = currentBalance + amount;

    // 지갑 업데이트
    await this.supabase
      .from('user_wallet')
      .update({
        point_balance: newBalance,
        total_earned_points: this.supabase.rpc('increment_total_earned', {
          user_id: userId,
          amount,
        }),
      })
      .eq('user_id', userId);

    // 포인트 내역 생성
    await this.supabase.from('point_history').insert({
      user_id: userId,
      payment_id: paymentId,
      transaction_type: PointTransactionType.EARN,
      amount,
      balance_after: newBalance,
      description: '결제 적립',
      expired_at: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1년 후 만료
    });
  }

  // 포인트 사용
  private async usePoints(
    userId: number,
    amount: number,
    paymentId: string,
  ): Promise<void> {
    // 현재 잔액 조회
    const currentBalance = await this.getUserPointBalance(userId);
    const newBalance = currentBalance - amount;

    if (newBalance < 0) {
      throw new BadRequestException('포인트 잔액이 부족합니다.');
    }

    // 지갑 업데이트
    await this.supabase
      .from('user_wallet')
      .update({
        point_balance: newBalance,
        total_used_points: this.supabase.rpc('increment_total_used', {
          user_id: userId,
          amount,
        }),
      })
      .eq('user_id', userId);

    // 포인트 내역 생성
    await this.supabase.from('point_history').insert({
      user_id: userId,
      payment_id: paymentId,
      transaction_type: PointTransactionType.USE,
      amount: -amount, // 음수로 저장
      balance_after: newBalance,
      description: '결제 사용',
    });
  }

  // 사용자 포인트 잔액 조회
  private async getUserPointBalance(userId: number): Promise<number> {
    const { data: wallet, error } = await this.supabase
      .from('user_wallet')
      .select('point_balance')
      .eq('user_id', userId)
      .single();

    if (error || !wallet) {
      throw new NotFoundException('사용자 지갑을 찾을 수 없습니다.');
    }

    return wallet.point_balance;
  }

  // 포인트 내역 조회
  async getPointHistory(userId: number): Promise<PointHistory[]> {
    const { data: history, error } = await this.supabase
      .from('point_history')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(`포인트 내역 조회 실패: ${error.message}`);
    }

    return history || [];
  }

  /* -------------------------------------------------------------
     유틸리티 메서드
  ------------------------------------------------------------- */

  // 주문 ID 생성
  private async generateOrderId(): Promise<string> {
    const today = new Date();
    const dateStr = today.toISOString().slice(0, 10).replace(/-/g, ''); // YYYYMMDD

    // 오늘 날짜의 주문 수 조회
    const { data: orders, error } = await this.supabase
      .from('orders')
      .select('order_id')
      .like('order_id', `ORD${dateStr}%`);

    const sequence = String((orders?.length || 0) + 1).padStart(3, '0');
    return `ORD${dateStr}${sequence}`;
  }

  // 결제 ID 생성
  private async generatePaymentId(): Promise<string> {
    const timestamp = Date.now().toString();
    const random = Math.random().toString(36).substring(2, 8).toUpperCase();
    return `PAY${timestamp}${random}`;
  }

  // 사용자 지갑 자동 생성
  private async createUserWalletIfNotExists(userId: number): Promise<void> {
    try {
      const { data: existingWallet } = await this.supabase
        .from('user_wallet')
        .select('user_id')
        .eq('user_id', userId)
        .single();

      if (existingWallet) {
        return; // 이미 지갑이 있음
      }
    } catch (error) {
      // 지갑이 없으면 생성
    }

    const { error } = await this.supabase.from('user_wallet').insert({
      user_id: userId,
      point_balance: 0,
      total_earned_points: 0,
      total_used_points: 0,
    });

    if (error) {
      console.error('지갑 생성 실패:', error);
      throw new Error(`지갑 생성 실패: ${error.message}`);
    }

    console.log(`사용자 ${userId}의 지갑이 자동 생성되었습니다.`);
  }

  // 외부 결제 처리 (모의)
  private async processExternalPayment(
    paymentMethod: PaymentType,
    amount: number,
    methodId?: number,
  ): Promise<{ transactionId: string }> {
    console.log('외부 결제 처리 시작:', { paymentMethod, amount, methodId });

    // 실제로는 각 결제사 API 연동
    // 여기서는 모의 처리

    if (paymentMethod === PaymentType.POINT) {
      return { transactionId: 'POINT_' + Date.now() };
    }

    // 결제 처리 시뮬레이션 (1초 대기)
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // 개발 환경에서는 실패 확률을 1%로 낮춤 (운영 환경에서는 5%)
    const failureRate = process.env.NODE_ENV === 'development' ? 0.01 : 0.05;

    if (Math.random() < failureRate) {
      console.error('외부 결제 처리 실패 (시뮬레이션)');
      throw new Error('외부 결제 처리 실패');
    }

    const transactionId = `EXT_${paymentMethod}_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
    console.log('외부 결제 성공:', transactionId);

    return { transactionId };
  }
}
