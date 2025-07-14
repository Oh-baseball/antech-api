import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { DatabaseConfig } from '../config/database.config';
import { User, CreateUserDto, UpdateUserDto } from '../entities/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(private databaseConfig: DatabaseConfig) {}

  private get supabase() {
    return this.databaseConfig.getClient();
  }

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    // 비밀번호 해시화
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

    const { data, error } = await this.supabase
      .from('users') // 테이블명 변경: user -> users
      .insert([
        {
          ...createUserDto,
          password: hashedPassword,
        },
      ])
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to create user: ${error.message}`);
    }

    return data;
  }

  async findByUserId(userId: number): Promise<User> {
    // string -> number
    const { data, error } = await this.supabase
      .from('users') // 테이블명 변경
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error || !data) {
      throw new NotFoundException('User not found');
    }

    return data;
  }

  async findAllUsers(): Promise<User[]> {
    const { data, error } = await this.supabase
      .from('users')
      .select('*')
      .order('user_id');

    if (error) {
      throw new Error(`Failed to fetch users: ${error.message}`);
    }

    return data || [];
  }

  async updateUser(
    userId: number, // string -> number
    updateUserDto: UpdateUserDto,
  ): Promise<User> {
    const updateData = { ...updateUserDto };

    // 비밀번호가 있으면 해시화
    if (updateData.password) {
      updateData.password = await bcrypt.hash(updateData.password, 10);
    }

    const { data, error } = await this.supabase
      .from('users') // 테이블명 변경
      .update(updateData)
      .eq('user_id', userId)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to update user: ${error.message}`);
    }

    if (!data) {
      throw new NotFoundException('User not found');
    }

    return data;
  }

  async deleteUser(userId: number): Promise<void> {
    // string -> number
    const { error } = await this.supabase
      .from('users') // 테이블명 변경
      .delete()
      .eq('user_id', userId);

    if (error) {
      throw new Error(`Failed to delete user: ${error.message}`);
    }
  }

  async verifyPassword(userId: number, password: string): Promise<boolean> {
    // string -> number
    const user = await this.findByUserId(userId);
    return bcrypt.compare(password, user.password);
  }

  // 회사별 사용자 조회
  async findUsersByCompany(companyId: string): Promise<User[]> {
    const { data, error } = await this.supabase
      .from('users')
      .select('*')
      .eq('company_id', companyId)
      .order('user_id');

    if (error) {
      throw new Error(`Failed to fetch users by company: ${error.message}`);
    }

    return data || [];
  }
}
