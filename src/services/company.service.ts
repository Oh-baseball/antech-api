import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { DatabaseConfig } from '../config/database.config';
import { Company } from '../entities/store.entity';
import { CreateCompanyDto, UpdateCompanyDto } from '../dto/company.dto';

@Injectable()
export class CompanyService {
  constructor(private databaseConfig: DatabaseConfig) {}

  private get supabase() {
    return this.databaseConfig.getClient();
  }

  async createCompany(createCompanyDto: CreateCompanyDto): Promise<Company> {
    // 회사 ID 중복 체크
    const { data: existingCompany } = await this.supabase
      .from('company')
      .select('company_id')
      .eq('company_id', createCompanyDto.company_id)
      .single();

    if (existingCompany) {
      throw new ConflictException('Company ID already exists');
    }

    const { data, error } = await this.supabase
      .from('company')
      .insert([createCompanyDto])
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to create company: ${error.message}`);
    }

    return data;
  }

  async findAllCompanies(): Promise<Company[]> {
    const { data, error } = await this.supabase
      .from('company')
      .select('*')
      .order('company_id');

    if (error) {
      throw new Error(`Failed to fetch companies: ${error.message}`);
    }

    return data || [];
  }

  async findCompanyById(companyId: string): Promise<Company> {
    const { data, error } = await this.supabase
      .from('company')
      .select('*')
      .eq('company_id', companyId)
      .single();

    if (error || !data) {
      throw new NotFoundException('Company not found');
    }

    return data;
  }

  async updateCompany(
    companyId: string,
    updateCompanyDto: UpdateCompanyDto,
  ): Promise<Company> {
    const { data, error } = await this.supabase
      .from('company')
      .update(updateCompanyDto)
      .eq('company_id', companyId)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to update company: ${error.message}`);
    }

    if (!data) {
      throw new NotFoundException('Company not found');
    }

    return data;
  }

  async deleteCompany(companyId: string): Promise<void> {
    const { error } = await this.supabase
      .from('company')
      .delete()
      .eq('company_id', companyId);

    if (error) {
      throw new Error(`Failed to delete company: ${error.message}`);
    }
  }

  // 포인트 차감
  async deductPoints(companyId: string, amount: number): Promise<Company> {
    const company = await this.findCompanyById(companyId);

    if (company.point < amount) {
      throw new Error('Insufficient company points');
    }

    return this.updateCompany(companyId, {
      point: company.point - amount,
    });
  }

  // 포인트 추가
  async addPoints(companyId: string, amount: number): Promise<Company> {
    const company = await this.findCompanyById(companyId);

    return this.updateCompany(companyId, {
      point: company.point + amount,
    });
  }

  // 회사별 통계
  async getCompanyStats(companyId: string) {
    const { data: userCount, error: userError } = await this.supabase
      .from('users')
      .select('user_id', { count: 'exact' })
      .eq('company_id', companyId);

    const { data: tossData, error: tossError } = await this.supabase
      .from('toss')
      .select('toss_amount')
      .eq('company_id', companyId);

    if (userError || tossError) {
      throw new Error('Failed to fetch company statistics');
    }

    const totalTossAmount =
      tossData?.reduce((sum, record) => sum + record.toss_amount, 0) || 0;

    return {
      userCount: userCount?.length || 0,
      totalTossAmount,
      tossCount: tossData?.length || 0,
    };
  }
}
