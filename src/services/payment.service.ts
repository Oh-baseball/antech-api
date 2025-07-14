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

  // ===== LOGO 관리 =====
  async createLogo(createLogoDto: CreateLogoDto): Promise<Logo> {
    const { data: existingLogo } = await this.supabase
      .from('logo')
      .select('logo_id')
      .eq('logo_id', createLogoDto.logo_id)
      .single();

    if (existingLogo) {
      throw new ConflictException('Logo ID already exists');
    }

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

  // ===== PAYMENT METHOD 관리 =====
  async createPaymentMethod(
    createPaymentMethodDto: CreatePaymentMethodDto,
  ): Promise<PaymentMethod> {
    const { data: existingMethod } = await this.supabase
      .from('payment_method')
      .select('method_id')
      .eq('method_id', createPaymentMethodDto.method_id)
      .single();

    if (existingMethod) {
      throw new ConflictException('Payment method ID already exists');
    }

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
      .select(
        `
        *,
        logo:logo_id (image)
      `,
      )
      .order('method_id');

    if (error) {
      throw new Error(`Failed to fetch payment methods: ${error.message}`);
    }

    return data || [];
  }

  async findPaymentMethodById(methodId: string): Promise<PaymentMethod> {
    const { data, error } = await this.supabase
      .from('payment_method')
      .select(
        `
        *,
        logo:logo_id (image)
      `,
      )
      .eq('method_id', methodId)
      .single();

    if (error || !data) {
      throw new NotFoundException('Payment method not found');
    }

    return data;
  }

  async findPaymentMethodsByType(
    type: 'CARD' | 'BANK' | 'MOBILE',
  ): Promise<PaymentMethod[]> {
    const { data, error } = await this.supabase
      .from('payment_method')
      .select(
        `
        *,
        logo:logo_id (image)
      `,
      )
      .eq('type', type)
      .order('name');

    if (error) {
      throw new Error(
        `Failed to fetch payment methods by type: ${error.message}`,
      );
    }

    return data || [];
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

  // ===== ACCOUNT 관리 =====
  async createAccount(createAccountDto: CreateAccountDto): Promise<Account> {
    const { data: existingAccount } = await this.supabase
      .from('account')
      .select('account_id')
      .eq('account_id', createAccountDto.account_id)
      .single();

    if (existingAccount) {
      throw new ConflictException('Account ID already exists');
    }

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

  async findAccountsByUserId(userId: number): Promise<Account[]> {
    const { data, error } = await this.supabase
      .from('account')
      .select(
        `
        *,
        logo:logo_id (image),
        company:company_id (point)
      `,
      )
      .eq('user_id', userId)
      .order('account_id');

    if (error) {
      throw new Error(`Failed to fetch user accounts: ${error.message}`);
    }

    return data || [];
  }

  async findAccountById(accountId: string): Promise<Account> {
    const { data, error } = await this.supabase
      .from('account')
      .select(
        `
        *,
        logo:logo_id (image),
        company:company_id (point)
      `,
      )
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

  // ===== CARD 관리 =====
  async createCard(createCardDto: CreateCardDto): Promise<Card> {
    const { data: existingCard } = await this.supabase
      .from('card')
      .select('card_id')
      .eq('card_id', createCardDto.card_id)
      .single();

    if (existingCard) {
      throw new ConflictException('Card ID already exists');
    }

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

  async findCardsByUserId(userId: number): Promise<Card[]> {
    const { data, error } = await this.supabase
      .from('card')
      .select(
        `
        *,
        company:company_id (point)
      `,
      )
      .eq('user_id', userId)
      .order('card_id');

    if (error) {
      throw new Error(`Failed to fetch user cards: ${error.message}`);
    }

    return data || [];
  }

  async findCardById(cardId: string): Promise<Card> {
    const { data, error } = await this.supabase
      .from('card')
      .select(
        `
        *,
        company:company_id (point)
      `,
      )
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

  // ===== TOSS 관리 =====
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

  async findTossByUserId(userId: number): Promise<Toss[]> {
    const { data, error } = await this.supabase
      .from('toss')
      .select(
        `
        *,
        company:company_id (point)
      `,
      )
      .eq('user_id', userId)
      .order('toss_id', { ascending: false });

    if (error) {
      throw new Error(`Failed to fetch user toss history: ${error.message}`);
    }

    return data || [];
  }

  async findTossById(tossId: number): Promise<Toss> {
    const { data, error } = await this.supabase
      .from('toss')
      .select(
        `
        *,
        company:company_id (point)
      `,
      )
      .eq('toss_id', tossId)
      .single();

    if (error || !data) {
      throw new NotFoundException('Toss transaction not found');
    }

    return data;
  }

  async updateToss(
    tossId: number,
    updateTossDto: UpdateTossDto,
  ): Promise<Toss> {
    const { data, error } = await this.supabase
      .from('toss')
      .update(updateTossDto)
      .eq('toss_id', tossId)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to update toss: ${error.message}`);
    }

    if (!data) {
      throw new NotFoundException('Toss transaction not found');
    }

    return data;
  }

  async deleteToss(tossId: number): Promise<void> {
    const { error } = await this.supabase
      .from('toss')
      .delete()
      .eq('toss_id', tossId);

    if (error) {
      throw new Error(`Failed to delete toss: ${error.message}`);
    }
  }

  // ===== 통계 =====
  async getTossStatsByCompany(companyId: string) {
    const { data, error } = await this.supabase
      .from('toss')
      .select('toss_amount')
      .eq('company_id', companyId);

    if (error) {
      throw new Error(`Failed to fetch toss stats: ${error.message}`);
    }

    const totalAmount =
      data?.reduce((sum, record) => sum + record.toss_amount, 0) || 0;
    const transactionCount = data?.length || 0;

    return {
      totalAmount,
      transactionCount,
      companyId,
    };
  }
}
