// 간편 결제 시스템 - 사용자 서비스

import {
  Injectable,
  ConflictException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import * as bcrypt from 'bcrypt';
import {
  User,
  UserWallet,
  UserAuthSettings,
  AuthAttempt,
  CreateUserDto,
  UpdateUserDto,
  CreateAuthSettingsDto,
  UpdateAuthSettingsDto,
  AuthenticateDto,
  AuthResultDto,
  WalletInfoDto,
} from '../entities/user.entity';

@Injectable()
export class UserService {
  private supabase: SupabaseClient;

  constructor() {
    this.supabase = createClient(
      process.env.SUPABASE_URL || '',
      process.env.SUPABASE_ANON_KEY || '',
    );
  }

  /* -------------------------------------------------------------
     사용자 기본 관리
  ------------------------------------------------------------- */

  // 사용자 생성 (회원가입)
  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const { email, password, name, phone } = createUserDto;

    // 이메일 중복 확인
    const { data: existingUser } = await this.supabase
      .from('users')
      .select('email')
      .eq('email', email)
      .single();

    if (existingUser) {
      throw new ConflictException('이미 사용 중인 이메일입니다.');
    }

    // 비밀번호 해시화
    const saltRounds = 10;
    const password_hash = await bcrypt.hash(password, saltRounds);

    // 사용자 생성
    const { data: user, error } = await this.supabase
      .from('users')
      .insert({
        email,
        password_hash,
        name,
        phone,
      })
      .select()
      .single();

    if (error) {
      throw new Error(`사용자 생성 실패: ${error.message}`);
    }

    // 사용자 지갑 초기화
    await this.initializeUserWallet(user.user_id);

    return user;
  }

  // 사용자 조회 (ID)
  async findUserById(userId: number): Promise<User> {
    const { data: user, error } = await this.supabase
      .from('users')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error || !user) {
      throw new NotFoundException('사용자를 찾을 수 없습니다.');
    }

    return user;
  }

  // 사용자 조회 (이메일)
  async findUserByEmail(email: string): Promise<User> {
    const { data: user, error } = await this.supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();

    if (error || !user) {
      throw new NotFoundException('사용자를 찾을 수 없습니다.');
    }

    return user;
  }

  // 모든 사용자 조회
  async findAllUsers(): Promise<User[]> {
    const { data: users, error } = await this.supabase
      .from('users')
      .select('*')
      .order('user_id');

    if (error) {
      throw new Error(`사용자 목록 조회 실패: ${error.message}`);
    }

    return users || [];
  }

  // 사용자 정보 수정
  async updateUser(
    userId: number,
    updateUserDto: UpdateUserDto,
  ): Promise<User> {
    const updateData: any = { ...updateUserDto };

    // 비밀번호가 있으면 해시화
    if (updateUserDto.password) {
      const saltRounds = 10;
      updateData.password_hash = await bcrypt.hash(
        updateUserDto.password,
        saltRounds,
      );
      delete updateData.password;
    }

    // 이메일 중복 확인
    if (updateUserDto.email) {
      const { data: existingUser } = await this.supabase
        .from('users')
        .select('user_id')
        .eq('email', updateUserDto.email)
        .neq('user_id', userId)
        .single();

      if (existingUser) {
        throw new ConflictException('이미 사용 중인 이메일입니다.');
      }
    }

    const { data: user, error } = await this.supabase
      .from('users')
      .update(updateData)
      .eq('user_id', userId)
      .select()
      .single();

    if (error) {
      throw new Error(`사용자 정보 수정 실패: ${error.message}`);
    }

    if (!user) {
      throw new NotFoundException('사용자를 찾을 수 없습니다.');
    }

    return user;
  }

  // 사용자 삭제
  async deleteUser(userId: number): Promise<void> {
    const { error } = await this.supabase
      .from('users')
      .delete()
      .eq('user_id', userId);

    if (error) {
      throw new Error(`사용자 삭제 실패: ${error.message}`);
    }
  }

  // 로그인 (이메일 + 비밀번호)
  async login(email: string, password: string): Promise<User> {
    const user = await this.findUserByEmail(email);

    const isValidPassword = await bcrypt.compare(password, user.password_hash);
    if (!isValidPassword) {
      throw new UnauthorizedException(
        '이메일 또는 비밀번호가 올바르지 않습니다.',
      );
    }

    return user;
  }

  // 비밀번호 확인
  async verifyPassword(userId: number, password: string): Promise<boolean> {
    const user = await this.findUserById(userId);
    return bcrypt.compare(password, user.password_hash);
  }

  /* -------------------------------------------------------------
     지갑 관리
  ------------------------------------------------------------- */

  // 사용자 지갑 초기화
  private async initializeUserWallet(userId: number): Promise<UserWallet> {
    const { data: wallet, error } = await this.supabase
      .from('user_wallet')
      .insert({
        user_id: userId,
        point_balance: 0,
        total_earned_points: 0,
        total_used_points: 0,
      })
      .select()
      .single();

    if (error) {
      throw new Error(`지갑 초기화 실패: ${error.message}`);
    }

    return wallet;
  }

  // 사용자 지갑 조회
  async getUserWallet(userId: number): Promise<WalletInfoDto> {
    const { data: wallet, error } = await this.supabase
      .from('user_wallet')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error || !wallet) {
      throw new NotFoundException('지갑 정보를 찾을 수 없습니다.');
    }

    return wallet;
  }

  // 포인트 잔액 조회
  async getPointBalance(userId: number): Promise<number> {
    const wallet = await this.getUserWallet(userId);
    return wallet.point_balance;
  }

  /* -------------------------------------------------------------
     인증 설정 관리
  ------------------------------------------------------------- */

  // 인증 설정 생성
  async createAuthSettings(
    createAuthSettingsDto: CreateAuthSettingsDto,
  ): Promise<UserAuthSettings> {
    const { data: authSettings, error } = await this.supabase
      .from('user_auth_settings')
      .insert(createAuthSettingsDto)
      .select()
      .single();

    if (error) {
      throw new Error(`인증 설정 생성 실패: ${error.message}`);
    }

    return authSettings;
  }

  // 인증 설정 조회
  async getAuthSettings(userId: number): Promise<UserAuthSettings> {
    const { data: authSettings, error } = await this.supabase
      .from('user_auth_settings')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error || !authSettings) {
      throw new NotFoundException('인증 설정을 찾을 수 없습니다.');
    }

    return authSettings;
  }

  // 인증 설정 수정
  async updateAuthSettings(
    userId: number,
    updateAuthSettingsDto: UpdateAuthSettingsDto,
  ): Promise<UserAuthSettings> {
    const { data: authSettings, error } = await this.supabase
      .from('user_auth_settings')
      .update(updateAuthSettingsDto)
      .eq('user_id', userId)
      .select()
      .single();

    if (error) {
      throw new Error(`인증 설정 수정 실패: ${error.message}`);
    }

    if (!authSettings) {
      throw new NotFoundException('인증 설정을 찾을 수 없습니다.');
    }

    return authSettings;
  }

  /* -------------------------------------------------------------
     인증 처리
  ------------------------------------------------------------- */

  // 사용자 인증 (PIN, 패턴, 생체인증)
  async authenticate(authenticateDto: AuthenticateDto): Promise<AuthResultDto> {
    const { user_id, auth_type, auth_value, device_info } = authenticateDto;

    // 인증 설정 조회
    const authSettings = await this.getAuthSettings(user_id);

    // 계정 잠금 확인
    if (
      authSettings.is_locked &&
      authSettings.locked_until &&
      new Date() < authSettings.locked_until
    ) {
      return {
        is_success: false,
        failure_reason: 'ACCOUNT_LOCKED',
        remaining_attempts: 0,
        is_locked: true,
        locked_until: authSettings.locked_until,
      };
    }

    let isValid = false;
    let failureReason = '';

    // 인증 타입별 검증
    switch (auth_type) {
      case 'PIN':
        if (authSettings.pin_number && auth_value === authSettings.pin_number) {
          isValid = true;
        } else {
          failureReason = 'WRONG_PIN';
        }
        break;

      case 'PATTERN':
        if (
          authSettings.pattern_sequence &&
          auth_value === authSettings.pattern_sequence
        ) {
          isValid = true;
        } else {
          failureReason = 'WRONG_PATTERN';
        }
        break;

      case 'FINGERPRINT':
        if (authSettings.is_fingerprint_enabled) {
          // 실제 생체인증은 클라이언트에서 처리되므로 여기서는 설정 여부만 확인
          isValid = true;
        } else {
          failureReason = 'BIOMETRIC_NOT_ENABLED';
        }
        break;

      case 'FACE_ID':
        if (authSettings.is_face_id_enabled) {
          // 실제 생체인증은 클라이언트에서 처리되므로 여기서는 설정 여부만 확인
          isValid = true;
        } else {
          failureReason = 'BIOMETRIC_NOT_ENABLED';
        }
        break;

      default:
        failureReason = 'INVALID_AUTH_TYPE';
    }

    // 인증 시도 기록
    await this.recordAuthAttempt({
      user_id,
      auth_type,
      is_success: isValid,
      device_info,
      failure_reason: isValid ? undefined : failureReason,
    });

    if (isValid) {
      // 성공 시 잠금 해제 및 시도 횟수 초기화
      if (authSettings.is_locked) {
        await this.updateAuthSettings(user_id, {
          is_locked: false,
          locked_until: undefined,
        });
      }

      return {
        is_success: true,
        is_locked: false,
      };
    } else {
      // 실패 시 시도 횟수 확인 및 계정 잠금 처리
      const recentFailures = await this.getRecentAuthFailures(user_id);
      const remainingAttempts = Math.max(
        0,
        authSettings.max_auth_attempts - recentFailures,
      );

      if (remainingAttempts <= 1) {
        // 계정 잠금
        const lockedUntil = new Date(
          Date.now() + authSettings.lockout_duration * 1000,
        );
        await this.updateAuthSettings(user_id, {
          is_locked: true,
          locked_until: lockedUntil,
        });

        return {
          is_success: false,
          failure_reason: 'ACCOUNT_LOCKED',
          remaining_attempts: 0,
          is_locked: true,
          locked_until: lockedUntil,
        };
      }

      return {
        is_success: false,
        failure_reason: failureReason,
        remaining_attempts: remainingAttempts - 1,
        is_locked: false,
      };
    }
  }

  // 인증 시도 기록
  private async recordAuthAttempt(
    attempt: Omit<AuthAttempt, 'attempt_id' | 'attempted_at'>,
  ): Promise<void> {
    const { error } = await this.supabase.from('auth_attempts').insert({
      ...attempt,
      attempted_at: new Date().toISOString(),
    });

    if (error) {
      console.error('인증 시도 기록 실패:', error);
    }
  }

  // 최근 인증 실패 횟수 조회
  private async getRecentAuthFailures(userId: number): Promise<number> {
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);

    const { data, error } = await this.supabase
      .from('auth_attempts')
      .select('attempt_id')
      .eq('user_id', userId)
      .eq('is_success', false)
      .gte('attempted_at', fiveMinutesAgo.toISOString());

    if (error) {
      console.error('인증 실패 횟수 조회 실패:', error);
      return 0;
    }

    return data?.length || 0;
  }
}
