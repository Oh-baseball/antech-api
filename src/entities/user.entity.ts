// 간편 결제 시스템 - 사용자 관련 엔티티

/* -------------------------------------------------------------
   ENUM 타입 정의
------------------------------------------------------------- */
export enum PaymentType {
  CARD = 'CARD', // 신용/체크카드
  BANK_TRANSFER = 'BANK_TRANSFER', // 계좌이체
  MOBILE_PAY = 'MOBILE_PAY', // 카카오페이, 네이버페이, 토스페이 등
  POINT = 'POINT', // 적립 포인트
}

export enum PaymentStatus {
  PENDING = 'PENDING', // 결제 대기
  COMPLETED = 'COMPLETED', // 결제 완료
  FAILED = 'FAILED', // 결제 실패
  CANCELLED = 'CANCELLED', // 결제 취소
  REFUNDED = 'REFUNDED', // 환불 완료
}

export enum PointTransactionType {
  EARN = 'EARN', // 적립
  USE = 'USE', // 사용
  EXPIRE = 'EXPIRE', // 소멸
  REFUND = 'REFUND', // 환불
}

/* -------------------------------------------------------------
   사용자 관련 엔티티
------------------------------------------------------------- */

// 사용자 기본 정보
export interface User {
  user_id: number; // INTEGER IDENTITY
  email: string; // VARCHAR(255) UNIQUE
  password_hash: string; // TEXT
  name: string; // VARCHAR(100)
  phone?: string; // VARCHAR(20)
  created_at: Date; // TIMESTAMP
  updated_at: Date; // TIMESTAMP
}

// 사용자 지갑 (포인트 관리)
export interface UserWallet {
  wallet_id: number; // INTEGER IDENTITY
  user_id: number; // INTEGER FK
  point_balance: number; // INTEGER DEFAULT 0
  total_earned_points: number; // INTEGER DEFAULT 0
  total_used_points: number; // INTEGER DEFAULT 0
  updated_at: Date; // TIMESTAMP
}

// 사용자 인증 설정
export interface UserAuthSettings {
  auth_id: number; // INTEGER IDENTITY
  user_id: number; // INTEGER FK UNIQUE

  // 간단한 PIN/패턴 저장
  pin_number?: string; // VARCHAR(6) - 6자리 PIN
  pattern_sequence?: string; // VARCHAR(20) - 패턴 순서

  // 생체인증 사용 여부
  is_fingerprint_enabled: boolean; // BOOLEAN DEFAULT false
  is_face_id_enabled: boolean; // BOOLEAN DEFAULT false

  // 보안 설정
  max_auth_attempts: number; // INTEGER DEFAULT 5
  lockout_duration: number; // INTEGER DEFAULT 300 (초)
  is_locked: boolean; // BOOLEAN DEFAULT false
  locked_until?: Date; // TIMESTAMP

  // 결제 시 인증 필수 금액
  auth_required_amount: number; // INTEGER DEFAULT 10000

  created_at: Date; // TIMESTAMP
  updated_at: Date; // TIMESTAMP
}

// 인증 시도 기록
export interface AuthAttempt {
  attempt_id: number; // INTEGER IDENTITY
  user_id: number; // INTEGER FK

  auth_type: string; // VARCHAR(20) - 'PIN', 'PATTERN', 'FINGERPRINT', 'FACE_ID'
  is_success: boolean; // BOOLEAN
  attempt_ip?: string; // INET
  device_info?: string; // TEXT

  // 실패 시 상세 정보
  failure_reason?: string; // VARCHAR(100) - 'WRONG_PIN', 'WRONG_PATTERN', etc.

  attempted_at: Date; // TIMESTAMP
}

/* -------------------------------------------------------------
   결제 관련 엔티티
------------------------------------------------------------- */

// 결제 제공업체
export interface PaymentProvider {
  provider_id: string; // VARCHAR(20) PK
  provider_name: string; // VARCHAR(100)
  provider_type: PaymentType; // payment_type ENUM
  logo_url?: string; // TEXT
  is_active: boolean; // BOOLEAN DEFAULT true
}

// 사용자별 결제 수단
export interface UserPaymentMethod {
  method_id: number; // INTEGER IDENTITY
  user_id: number; // INTEGER FK
  provider_id: string; // VARCHAR(20) FK

  // 카드/계좌 정보 (마스킹된 형태)
  masked_number?: string; // VARCHAR(50) - "**** **** **** 1234"
  card_company?: string; // VARCHAR(50) - 카드사명
  bank_name?: string; // VARCHAR(50) - 은행명

  // 결제 수단별 고유 토큰
  payment_token?: string; // TEXT

  alias_name?: string; // VARCHAR(100) - 사용자 지정 별칭
  is_default: boolean; // BOOLEAN DEFAULT false
  is_active: boolean; // BOOLEAN DEFAULT true
  created_at: Date; // TIMESTAMP
}

/* -------------------------------------------------------------
   DTO 인터페이스
------------------------------------------------------------- */

export interface CreateUserDto {
  email: string;
  password: string;
  name: string;
  phone?: string;
}

export interface UpdateUserDto {
  email?: string;
  password?: string;
  name?: string;
  phone?: string;
}

export interface CreateAuthSettingsDto {
  user_id: number;
  pin_number?: string;
  pattern_sequence?: string;
  is_fingerprint_enabled?: boolean;
  is_face_id_enabled?: boolean;
  auth_required_amount?: number;
}

export interface UpdateAuthSettingsDto {
  pin_number?: string;
  pattern_sequence?: string;
  is_fingerprint_enabled?: boolean;
  is_face_id_enabled?: boolean;
  max_auth_attempts?: number;
  lockout_duration?: number;
  auth_required_amount?: number;
  is_locked?: boolean;
  locked_until?: Date;
}

export interface CreatePaymentMethodDto {
  user_id: number;
  provider_id: string;
  masked_number?: string;
  card_company?: string;
  bank_name?: string;
  payment_token?: string;
  alias_name?: string;
  is_default?: boolean;
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

export interface AuthenticateDto {
  user_id: number;
  auth_type: AuthType;
  auth_value?: string;
  device_info?: string;
}

export interface AuthResultDto {
  is_success: boolean;
  failure_reason?: string;
  remaining_attempts?: number;
  is_locked: boolean;
  locked_until?: Date;
}

/* -------------------------------------------------------------
   지갑 관련 DTO
------------------------------------------------------------- */

export interface WalletInfoDto {
  wallet_id: number;
  user_id: number;
  point_balance: number;
  total_earned_points: number;
  total_used_points: number;
  updated_at: Date;
}
