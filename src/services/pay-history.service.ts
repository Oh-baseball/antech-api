import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseConfig } from '../config/database.config';
import {
  PayHistory,
  CreatePayHistoryDto,
  PayHistoryWithDetails,
} from '../entities/pay-history.entity';

@Injectable()
export class PayHistoryService {
  constructor(private databaseConfig: DatabaseConfig) {}

  private get supabase() {
    return this.databaseConfig.getClient();
  }

  async createPayHistory(
    createPayHistoryDto: CreatePayHistoryDto,
  ): Promise<PayHistory> {
    const { data, error } = await this.supabase
      .from('pay_history')
      .insert([
        {
          ...createPayHistoryDto,
          time: new Date().toISOString(),
        },
      ])
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to create pay history: ${error.message}`);
    }

    return data;
  }

  async findByUserId(userId: number): Promise<PayHistoryWithDetails[]> {
    // string -> number
    const { data, error } = await this.supabase
      .from('pay_history')
      .select(
        `
        *,
        users:user_id (name),
        store:store_id (name),
        payment_method:method_id (type, name)
      `,
      )
      .eq('user_id', userId)
      .order('time', { ascending: false });

    if (error) {
      throw new Error(`Failed to fetch pay history: ${error.message}`);
    }

    return (
      data?.map((item) => ({
        ...item,
        user_name: item.users?.name,
        store_name: item.store?.name,
        method_type: item.payment_method?.type,
        method_name: item.payment_method?.name,
      })) || []
    );
  }

  async findByStoreId(storeId: number): Promise<PayHistoryWithDetails[]> {
    // string -> number
    const { data, error } = await this.supabase
      .from('pay_history')
      .select(
        `
        *,
        users:user_id (name),
        store:store_id (name),
        payment_method:method_id (type, name)
      `,
      )
      .eq('store_id', storeId)
      .order('time', { ascending: false });

    if (error) {
      throw new Error(`Failed to fetch pay history: ${error.message}`);
    }

    return (
      data?.map((item) => ({
        ...item,
        user_name: item.users?.name,
        store_name: item.store?.name,
        method_type: item.payment_method?.type,
        method_name: item.payment_method?.name,
      })) || []
    );
  }

  async getUserPointBalance(userId: number): Promise<number> {
    // string -> number
    const { data, error } = await this.supabase
      .from('pay_history')
      .select('amount')
      .eq('user_id', userId);

    if (error) {
      throw new Error(`Failed to calculate point balance: ${error.message}`);
    }

    return data?.reduce((total, record) => total + record.amount, 0) || 0;
  }

  async getMonthlyStats(userId: number, year: number, month: number) {
    // string -> number
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0);

    const { data, error } = await this.supabase
      .from('pay_history')
      .select('amount, time')
      .eq('user_id', userId)
      .gte('time', startDate.toISOString())
      .lte('time', endDate.toISOString());

    if (error) {
      throw new Error(`Failed to fetch monthly stats: ${error.message}`);
    }

    const totalAmount =
      data?.reduce((sum, record) => sum + record.amount, 0) || 0;
    const transactionCount = data?.length || 0;

    return {
      totalAmount,
      transactionCount,
      month: `${year}-${month.toString().padStart(2, '0')}`,
    };
  }

  // 포인트 적립
  async earnPoints(
    userId: number,
    storeId: number,
    methodId: string,
    amount: number,
  ): Promise<PayHistory> {
    return this.createPayHistory({
      user_id: userId,
      store_id: storeId,
      method_id: methodId,
      amount: Math.abs(amount), // 적립은 항상 양수
    });
  }

  // 포인트 사용
  async usePoints(
    userId: number,
    storeId: number,
    methodId: string,
    amount: number,
  ): Promise<PayHistory> {
    const balance = await this.getUserPointBalance(userId);

    if (balance < amount) {
      throw new Error('Insufficient points balance');
    }

    return this.createPayHistory({
      user_id: userId,
      store_id: storeId,
      method_id: methodId,
      amount: -Math.abs(amount), // 사용은 항상 음수
    });
  }

  // 특정 결제 내역 조회
  async findByPayId(payId: string): Promise<PayHistoryWithDetails> {
    const { data, error } = await this.supabase
      .from('pay_history')
      .select(
        `
        *,
        users:user_id (name),
        store:store_id (name),
        payment_method:method_id (type, name)
      `,
      )
      .eq('pay_id', payId)
      .single();

    if (error || !data) {
      throw new NotFoundException('Payment history not found');
    }

    return {
      ...data,
      user_name: data.users?.name,
      store_name: data.store?.name,
      method_type: data.payment_method?.type,
      method_name: data.payment_method?.name,
    };
  }

  // 결제 수단별 통계
  async getPaymentMethodStats(methodId: string) {
    const { data, error } = await this.supabase
      .from('pay_history')
      .select('amount, time')
      .eq('method_id', methodId)
      .order('time', { ascending: false });

    if (error) {
      throw new Error(`Failed to fetch payment method stats: ${error.message}`);
    }

    const totalAmount =
      data?.reduce((sum, record) => sum + record.amount, 0) || 0;
    const transactionCount = data?.length || 0;

    return {
      totalAmount,
      transactionCount,
      methodId,
    };
  }
}
