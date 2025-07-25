// 간편 결제 시스템 - 사용자 관련 DTO

import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsString,
  IsOptional,
  IsBoolean,
  IsNumber,
  MinLength,
  MaxLength,
  Min,
  Max,
  IsEnum,
  IsArray,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

/* -------------------------------------------------------------
   사용자 기본 정보 DTO
------------------------------------------------------------- */

export class CreateUserDto {
  @ApiProperty({
    description: '이메일 주소',
    example: 'kim@example.com',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: '비밀번호 (최소 6자)',
    example: 'password123',
    minLength: 6,
  })
  @IsString()
  @MinLength(6)
  password: string;

  @ApiProperty({
    description: '사용자 이름',
    example: '김민수',
  })
  @IsString()
  @MaxLength(100)
  name: string;

  @ApiProperty({
    description: '휴대폰 번호',
    example: '010-1234-5678',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(20)
  phone?: string;
}

export class UpdateUserDto {
  @ApiProperty({
    description: '이메일 주소',
    example: 'kim@example.com',
    required: false,
  })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiProperty({
    description: '새 비밀번호 (최소 6자)',
    example: 'newpassword123',
    required: false,
    minLength: 6,
  })
  @IsOptional()
  @IsString()
  @MinLength(6)
  password?: string;

  @ApiProperty({
    description: '사용자 이름',
    example: '김민수',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  name?: string;

  @ApiProperty({
    description: '휴대폰 번호',
    example: '010-1234-5678',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(20)
  phone?: string;
}

export class LoginDto {
  @ApiProperty({
    description: '이메일 주소',
    example: 'kim@example.com',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: '비밀번호',
    example: 'password123',
  })
  @IsString()
  password: string;
}

/* -------------------------------------------------------------
   인증 설정 관련 DTO
------------------------------------------------------------- */

export class CreateAuthSettingsDto {
  @ApiProperty({
    description: '사용자 ID',
    example: 1,
  })
  @IsNumber()
  user_id: number;

  @ApiProperty({
    description: '6자리 PIN 번호',
    example: '123456',
    required: false,
    minLength: 6,
    maxLength: 6,
  })
  @IsOptional()
  @IsString()
  @MinLength(6)
  @MaxLength(6)
  pin_number?: string;

  @ApiProperty({
    description: '패턴 순서 (9자리 숫자)',
    example: '147852963',
    required: false,
    maxLength: 20,
  })
  @IsOptional()
  @IsString()
  @MaxLength(20)
  pattern_sequence?: string;

  @ApiProperty({
    description: '지문 인증 사용 여부',
    example: false,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  is_fingerprint_enabled?: boolean;

  @ApiProperty({
    description: 'Face ID 사용 여부',
    example: false,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  is_face_id_enabled?: boolean;

  @ApiProperty({
    description: '결제 시 인증 필수 금액 (원)',
    example: 10000,
    required: false,
    minimum: 0,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  auth_required_amount?: number;
}

export class UpdateAuthSettingsDto {
  @ApiProperty({
    description: '6자리 PIN 번호',
    example: '123456',
    required: false,
    minLength: 6,
    maxLength: 6,
  })
  @IsOptional()
  @IsString()
  @MinLength(6)
  @MaxLength(6)
  pin_number?: string;

  @ApiProperty({
    description: '패턴 순서 (9자리 숫자)',
    example: '147852963',
    required: false,
    maxLength: 20,
  })
  @IsOptional()
  @IsString()
  @MaxLength(20)
  pattern_sequence?: string;

  @ApiProperty({
    description: '지문 인증 사용 여부',
    example: true,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  is_fingerprint_enabled?: boolean;

  @ApiProperty({
    description: 'Face ID 사용 여부',
    example: true,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  is_face_id_enabled?: boolean;

  @ApiProperty({
    description: '최대 인증 시도 횟수',
    example: 5,
    required: false,
    minimum: 1,
    maximum: 10,
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(10)
  max_auth_attempts?: number;

  @ApiProperty({
    description: '계정 잠금 시간 (초)',
    example: 300,
    required: false,
    minimum: 60,
  })
  @IsOptional()
  @IsNumber()
  @Min(60)
  lockout_duration?: number;

  @ApiProperty({
    description: '결제 시 인증 필수 금액 (원)',
    example: 10000,
    required: false,
    minimum: 0,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  auth_required_amount?: number;
}

/* -------------------------------------------------------------
   인증 관련 DTO
------------------------------------------------------------- */

export enum AuthType {
  PIN = 'PIN',
  PATTERN = 'PATTERN',
  FINGERPRINT = 'FINGERPRINT',
  FACE_ID = 'FACE_ID',
}

export class AuthenticateDto {
  @ApiProperty({
    description: '사용자 ID',
    example: 1,
  })
  @IsNumber()
  user_id: number;

  @ApiProperty({
    description: '인증 타입',
    example: 'PIN',
    enum: AuthType,
  })
  @IsEnum(AuthType)
  auth_type: AuthType;

  @ApiProperty({
    description: '인증 값 (PIN 번호 또는 패턴 순서)',
    example: '123456',
    required: false,
  })
  @IsOptional()
  @IsString()
  auth_value?: string;

  @ApiProperty({
    description: '디바이스 정보',
    example: 'iPhone 15 Pro, iOS 17.2',
    required: false,
  })
  @IsOptional()
  @IsString()
  device_info?: string;
}

export class AuthResultDto {
  @ApiProperty({
    description: '인증 성공 여부',
    example: true,
  })
  is_success: boolean;

  @ApiProperty({
    description: '실패 사유',
    example: 'WRONG_PIN',
    required: false,
  })
  failure_reason?: string;

  @ApiProperty({
    description: '남은 시도 횟수',
    example: 4,
    required: false,
  })
  remaining_attempts?: number;

  @ApiProperty({
    description: '계정 잠금 여부',
    example: false,
  })
  is_locked: boolean;

  @ApiProperty({
    description: '잠금 해제 시간',
    example: '2025-01-25T10:30:00Z',
    required: false,
  })
  locked_until?: Date;
}

/* -------------------------------------------------------------
   지갑 관련 DTO
------------------------------------------------------------- */

export class WalletInfoDto {
  @ApiProperty({
    description: '지갑 ID',
    example: 1,
  })
  wallet_id: number;

  @ApiProperty({
    description: '사용자 ID',
    example: 1,
  })
  user_id: number;

  @ApiProperty({
    description: '현재 포인트 잔액',
    example: 5000,
  })
  point_balance: number;

  @ApiProperty({
    description: '총 적립 포인트',
    example: 50000,
  })
  total_earned_points: number;

  @ApiProperty({
    description: '총 사용 포인트',
    example: 45000,
  })
  total_used_points: number;

  @ApiProperty({
    description: '마지막 업데이트 시간',
    example: '2025-01-25T10:30:00Z',
  })
  updated_at: Date;
}
