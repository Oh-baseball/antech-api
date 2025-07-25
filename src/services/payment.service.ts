import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { DatabaseConfig } from '../config/database.config';
import {
  Logo,
  PaymentMethod,
  Account,
  Card,
  Toss,
} from '../entities/store.entity';
import {
  CreateLogoDto,
  UpdateLogoDto,
  CreatePaymentMethodDto,
  UpdatePaymentMethodDto,
  CreateAccountDto,
  UpdateAccountDto,
  CreateCardDto,
  UpdateCardDto,
  CreateTossDto,
  UpdateTossDto,
} from '../dto/payment.dto';

@Injectable()
export class PaymentService {
  constructor(private databaseConfig: DatabaseConfig) {}

  private get supabase() {
    return this.databaseConfig.getClient();
  }

  // ===== Logo 관련 =====
  async createLogo(createLogoDto: CreateLogoDto): Promise<Logo> {
    const { data, error } = await this.supabase
      .from('logo')
      .insert([createLogoDto])
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to create logo: ${error.message}`);
    }

    return data;
  }

  async findAllLogos(): Promise<Logo[]> {
    const { data, error } = await this.supabase
      .from('logo')
      .select('*')
      .order('logo_id');

    if (error) {
      throw new Error(`Failed to fetch logos: ${error.message}`);
    }

    return data || [];
  }

  async findLogoById(logoId: string): Promise<Logo> {
    const { data, error } = await this.supabase
      .from('logo')
      .select('*')
      .eq('logo_id', logoId)
      .single();

    if (error || !data) {
      throw new NotFoundException('Logo not found');
    }

    return data;
  }

  async updateLogo(
    logoId: string,
    updateLogoDto: UpdateLogoDto,
  ): Promise<Logo> {
    const { data, error } = await this.supabase
      .from('logo')
      .update(updateLogoDto)
      .eq('logo_id', logoId)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to update logo: ${error.message}`);
    }

    if (!data) {
      throw new NotFoundException('Logo not found');
    }

    return data;
  }

  async deleteLogo(logoId: string): Promise<void> {
    const { error } = await this.supabase
      .from('logo')
      .delete()
      .eq('logo_id', logoId);

    if (error) {
      throw new Error(`Failed to delete logo: ${error.message}`);
    }
  }

  // ===== PaymentMethod 관련 =====
  async createPaymentMethod(
    createPaymentMethodDto: CreatePaymentMethodDto,
  ): Promise<PaymentMethod> {
    const { data, error } = await this.supabase
      .from('payment_method')
      .insert([createPaymentMethodDto])
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to create payment method: ${error.message}`);
    }

    return data;
  }

  async findAllPaymentMethods(): Promise<PaymentMethod[]> {
    const { data, error } = await this.supabase
      .from('payment_method')
      .select('*')
      .order('method_id');

    if (error) {
      throw new Error(`Failed to fetch payment methods: ${error.message}`);
    }

    return data || [];
  }

  async findPaymentMethodById(methodId: string): Promise<PaymentMethod> {
    const { data, error } = await this.supabase
      .from('payment_method')
      .select('*')
      .eq('method_id', methodId)
      .single();

    if (error || !data) {
      throw new NotFoundException('Payment method not found');
    }

    return data;
  }

  async updatePaymentMethod(
    methodId: string,
    updatePaymentMethodDto: UpdatePaymentMethodDto,
  ): Promise<PaymentMethod> {
    const { data, error } = await this.supabase
      .from('payment_method')
      .update(updatePaymentMethodDto)
      .eq('method_id', methodId)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to update payment method: ${error.message}`);
    }

    if (!data) {
      throw new NotFoundException('Payment method not found');
    }

    return data;
  }

  async deletePaymentMethod(methodId: string): Promise<void> {
    const { error } = await this.supabase
      .from('payment_method')
      .delete()
      .eq('method_id', methodId);

    if (error) {
      throw new Error(`Failed to delete payment method: ${error.message}`);
    }
  }

  // ===== Account 관련 =====
  async createAccount(createAccountDto: CreateAccountDto): Promise<Account> {
    const { data, error } = await this.supabase
      .from('account')
      .insert([createAccountDto])
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to create account: ${error.message}`);
    }

    return data;
  }

  async findAllAccounts(): Promise<Account[]> {
    const { data, error } = await this.supabase
      .from('account')
      .select('*')
      .order('account_id');

    if (error) {
      throw new Error(`Failed to fetch accounts: ${error.message}`);
    }

    return data || [];
  }

  async findAccountById(accountId: string): Promise<Account> {
    const { data, error } = await this.supabase
      .from('account')
      .select('*')
      .eq('account_id', accountId)
      .single();

    if (error || !data) {
      throw new NotFoundException('Account not found');
    }

    return data;
  }

  async updateAccount(
    accountId: string,
    updateAccountDto: UpdateAccountDto,
  ): Promise<Account> {
    const { data, error } = await this.supabase
      .from('account')
      .update(updateAccountDto)
      .eq('account_id', accountId)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to update account: ${error.message}`);
    }

    if (!data) {
      throw new NotFoundException('Account not found');
    }

    return data;
  }

  async deleteAccount(accountId: string): Promise<void> {
    const { error } = await this.supabase
      .from('account')
      .delete()
      .eq('account_id', accountId);

    if (error) {
      throw new Error(`Failed to delete account: ${error.message}`);
    }
  }

  // ===== Card 관련 =====
  async createCard(createCardDto: CreateCardDto): Promise<Card> {
    const { data, error } = await this.supabase
      .from('card')
      .insert([createCardDto])
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to create card: ${error.message}`);
    }

    return data;
  }

  async findAllCards(): Promise<Card[]> {
    const { data, error } = await this.supabase
      .from('card')
      .select('*')
      .order('card_id');

    if (error) {
      throw new Error(`Failed to fetch cards: ${error.message}`);
    }

    return data || [];
  }

  async findCardById(cardId: string): Promise<Card> {
    const { data, error } = await this.supabase
      .from('card')
      .select('*')
      .eq('card_id', cardId)
      .single();

    if (error || !data) {
      throw new NotFoundException('Card not found');
    }

    return data;
  }

  async updateCard(
    cardId: string,
    updateCardDto: UpdateCardDto,
  ): Promise<Card> {
    const { data, error } = await this.supabase
      .from('card')
      .update(updateCardDto)
      .eq('card_id', cardId)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to update card: ${error.message}`);
    }

    if (!data) {
      throw new NotFoundException('Card not found');
    }

    return data;
  }

  async deleteCard(cardId: string): Promise<void> {
    const { error } = await this.supabase
      .from('card')
      .delete()
      .eq('card_id', cardId);

    if (error) {
      throw new Error(`Failed to delete card: ${error.message}`);
    }
  }

  // ===== Toss 관련 =====
  async createToss(createTossDto: CreateTossDto): Promise<Toss> {
    const { data, error } = await this.supabase
      .from('toss')
      .insert([createTossDto])
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to create toss: ${error.message}`);
    }

    return data;
  }

  async findAllToss(): Promise<Toss[]> {
    const { data, error } = await this.supabase
      .from('toss')
      .select('*')
      .order('user_id');

    if (error) {
      throw new Error(`Failed to fetch toss records: ${error.message}`);
    }

    return data || [];
  }

  async findTossByUserId(userId: number): Promise<Toss[]> {
    const { data, error } = await this.supabase
      .from('toss')
      .select('*')
      .eq('user_id', userId)
      .order('user_id');

    if (error) {
      throw new Error(`Failed to fetch toss records: ${error.message}`);
    }

    return data || [];
  }

  async updateToss(
    userId: number,
    updateTossDto: UpdateTossDto,
  ): Promise<Toss> {
    const { data, error } = await this.supabase
      .from('toss')
      .update(updateTossDto)
      .eq('user_id', userId)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to update toss: ${error.message}`);
    }

    if (!data) {
      throw new NotFoundException('Toss record not found');
    }

    return data;
  }

  async deleteToss(userId: number): Promise<void> {
    const { error } = await this.supabase
      .from('toss')
      .delete()
      .eq('user_id', userId);

    if (error) {
      throw new Error(`Failed to delete toss: ${error.message}`);
    }
  }
}
