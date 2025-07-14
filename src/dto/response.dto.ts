import { ApiProperty } from '@nestjs/swagger';

// 기본 응답 형식
export class BaseResponseDto<T = any> {
  @ApiProperty({ description: '성공 여부', example: true })
  success: boolean;

  @ApiProperty({ description: '응답 데이터' })
  data?: T;

  @ApiProperty({
    description: '응답 메시지',
    example: '성공적으로 처리되었습니다.',
  })
  message?: string;
}

// 오류 응답 형식
export class ErrorResponseDto {
  @ApiProperty({ description: '성공 여부', example: false })
  success: boolean;

  @ApiProperty({ description: 'HTTP 상태 코드', example: 400 })
  statusCode: number;

  @ApiProperty({
    description: '타임스탬프',
    example: '2024-01-01T00:00:00.000Z',
  })
  timestamp: string;

  @ApiProperty({ description: '요청 경로', example: '/users' })
  path: string;

  @ApiProperty({ description: 'HTTP 메서드', example: 'POST' })
  method: string;

  @ApiProperty({ description: '오류 메시지', example: '잘못된 요청입니다.' })
  message: string;
}

// 사용자 응답 DTO
export class UserDto {
  @ApiProperty({ description: '사용자 ID', example: 'john_doe' })
  user_id: string;

  @ApiProperty({ description: '사용자 이름', example: '홍길동' })
  name: string;

  @ApiProperty({ description: '숫자 패스워드', example: 1234 })
  pw_number: number;

  @ApiProperty({ description: '패턴 패스워드', example: 5678 })
  pw_pattern: number;

  @ApiProperty({ description: '생성일', example: '2024-01-01T00:00:00.000Z' })
  created_at: string;

  @ApiProperty({ description: '수정일', example: '2024-01-01T00:00:00.000Z' })
  updated_at: string;
}

export class UserResponseDto {
  @ApiProperty({ description: '성공 여부', example: true })
  success: boolean;

  @ApiProperty({ type: UserDto })
  data: UserDto;

  @ApiProperty({
    description: '응답 메시지',
    example: '사용자가 성공적으로 조회되었습니다.',
  })
  message?: string;
}

export class UsersResponseDto {
  @ApiProperty({ description: '성공 여부', example: true })
  success: boolean;

  @ApiProperty({ type: [UserDto] })
  data: UserDto[];

  @ApiProperty({
    description: '응답 메시지',
    example: '사용자 목록이 성공적으로 조회되었습니다.',
  })
  message?: string;
}

// 매장 응답 DTO
export class StoreDto {
  @ApiProperty({ description: '매장 ID', example: 'store_001' })
  store_id: string;

  @ApiProperty({ description: '매장 이름', example: '스타벅스 강남점' })
  name: string;

  @ApiProperty({
    description: '매장 주소',
    example: '서울시 강남구 테헤란로 123',
  })
  address: string;

  @ApiProperty({
    description: '매장 이미지 URL',
    example: 'https://example.com/image.jpg',
    required: false,
  })
  image?: string;

  @ApiProperty({ description: '생성일', example: '2024-01-01T00:00:00.000Z' })
  created_at: string;

  @ApiProperty({ description: '수정일', example: '2024-01-01T00:00:00.000Z' })
  updated_at: string;
}

export class StoreResponseDto {
  @ApiProperty({ description: '성공 여부', example: true })
  success: boolean;

  @ApiProperty({ type: StoreDto })
  data: StoreDto;

  @ApiProperty({
    description: '응답 메시지',
    example: '매장이 성공적으로 조회되었습니다.',
  })
  message?: string;
}

export class StoresResponseDto {
  @ApiProperty({ description: '성공 여부', example: true })
  success: boolean;

  @ApiProperty({ type: [StoreDto] })
  data: StoreDto[];

  @ApiProperty({
    description: '응답 메시지',
    example: '매장 목록이 성공적으로 조회되었습니다.',
  })
  message?: string;
}

// 카테고리 응답 DTO
export class CategoryDto {
  @ApiProperty({ description: '카테고리 ID', example: 'cat_001' })
  category_id: string;

  @ApiProperty({ description: '카테고리 이름', example: '음료' })
  name: string;

  @ApiProperty({ description: '생성일', example: '2024-01-01T00:00:00.000Z' })
  created_at: string;

  @ApiProperty({ description: '수정일', example: '2024-01-01T00:00:00.000Z' })
  updated_at: string;
}

export class CategoryResponseDto {
  @ApiProperty({ description: '성공 여부', example: true })
  success: boolean;

  @ApiProperty({ type: CategoryDto })
  data: CategoryDto;

  @ApiProperty({
    description: '응답 메시지',
    example: '카테고리가 성공적으로 조회되었습니다.',
  })
  message?: string;
}

export class CategoriesResponseDto {
  @ApiProperty({ description: '성공 여부', example: true })
  success: boolean;

  @ApiProperty({ type: [CategoryDto] })
  data: CategoryDto[];

  @ApiProperty({
    description: '응답 메시지',
    example: '카테고리 목록이 성공적으로 조회되었습니다.',
  })
  message?: string;
}

// 결제 이력 응답 DTO
export class PayHistoryDto {
  @ApiProperty({ description: '결제 ID', example: 'pay_001' })
  pay_id: string;

  @ApiProperty({ description: '사용자 ID', example: 'john_doe' })
  user_id: string;

  @ApiProperty({ description: '매장 ID', example: 'store_001' })
  store_id: string;

  @ApiProperty({ description: '결제 수단 ID', example: 'method_001' })
  method_id: string;

  @ApiProperty({
    description: '거래 시간',
    example: '2024-01-01T12:00:00.000Z',
  })
  time: string;

  @ApiProperty({ description: '금액 (양수: 적립, 음수: 사용)', example: 1000 })
  amount: number;

  @ApiProperty({ description: '생성일', example: '2024-01-01T00:00:00.000Z' })
  created_at: string;

  @ApiProperty({ description: '수정일', example: '2024-01-01T00:00:00.000Z' })
  updated_at: string;
}

export class PayHistoryWithDetailsDto extends PayHistoryDto {
  @ApiProperty({
    description: '사용자 이름',
    example: '홍길동',
    required: false,
  })
  user_name?: string;

  @ApiProperty({
    description: '매장 이름',
    example: '스타벅스 강남점',
    required: false,
  })
  store_name?: string;

  @ApiProperty({
    description: '결제 수단 타입',
    example: '카드',
    required: false,
  })
  method_type?: string;

  @ApiProperty({
    description: '결제 수단 이름',
    example: '신한카드',
    required: false,
  })
  method_name?: string;
}

export class PayHistoryResponseDto {
  @ApiProperty({ description: '성공 여부', example: true })
  success: boolean;

  @ApiProperty({ type: PayHistoryDto })
  data: PayHistoryDto;

  @ApiProperty({
    description: '응답 메시지',
    example: '결제 내역이 성공적으로 조회되었습니다.',
  })
  message?: string;
}

export class PayHistoriesResponseDto {
  @ApiProperty({ description: '성공 여부', example: true })
  success: boolean;

  @ApiProperty({ type: [PayHistoryWithDetailsDto] })
  data: PayHistoryWithDetailsDto[];

  @ApiProperty({
    description: '응답 메시지',
    example: '결제 내역 목록이 성공적으로 조회되었습니다.',
  })
  message?: string;
}

// 포인트 잔액 응답 DTO
export class PointBalanceDto {
  @ApiProperty({ description: '현재 포인트 잔액', example: 5000 })
  balance: number;
}

export class PointBalanceResponseDto {
  @ApiProperty({ description: '성공 여부', example: true })
  success: boolean;

  @ApiProperty({ type: PointBalanceDto })
  data: PointBalanceDto;

  @ApiProperty({
    description: '응답 메시지',
    example: '현재 포인트 잔액: 5000원',
  })
  message: string;
}

// 비밀번호 확인 응답 DTO
export class PasswordVerificationDto {
  @ApiProperty({ description: '비밀번호 일치 여부', example: true })
  isValid: boolean;
}

export class PasswordVerificationResponseDto {
  @ApiProperty({ description: '성공 여부', example: true })
  success: boolean;

  @ApiProperty({ type: PasswordVerificationDto })
  data: PasswordVerificationDto;

  @ApiProperty({
    description: '응답 메시지',
    example: '비밀번호가 일치합니다.',
  })
  message: string;
}

// 월별 통계 응답 DTO
export class MonthlyStatsDto {
  @ApiProperty({ description: '총 거래 금액', example: 15000 })
  totalAmount: number;

  @ApiProperty({ description: '거래 횟수', example: 8 })
  transactionCount: number;

  @ApiProperty({ description: '조회 월', example: '2024-01' })
  month: string;
}

export class MonthlyStatsResponseDto {
  @ApiProperty({ description: '성공 여부', example: true })
  success: boolean;

  @ApiProperty({ type: MonthlyStatsDto })
  data: MonthlyStatsDto;

  @ApiProperty({
    description: '응답 메시지',
    example: '월별 통계가 성공적으로 조회되었습니다.',
  })
  message?: string;
}

// 헬스체크 응답 DTO
export class HealthCheckDto {
  @ApiProperty({ description: '성공 여부', example: true })
  success: boolean;

  @ApiProperty({
    description: '응답 메시지',
    example: 'API is running successfully',
  })
  message: string;

  @ApiProperty({
    description: '타임스탬프',
    example: '2024-01-01T00:00:00.000Z',
  })
  timestamp: string;

  @ApiProperty({ description: '버전', example: '1.0.0' })
  version: string;
}

// API 정보 응답 DTO
export class ApiInfoDataDto {
  @ApiProperty({
    description: 'API 이름',
    example: '포인트 적립/사용 시스템 API',
  })
  name: string;

  @ApiProperty({ description: '버전', example: '1.0.0' })
  version: string;

  @ApiProperty({
    description: '설명',
    example:
      'Supabase를 백엔드로 사용하는 NestJS 기반의 포인트 적립 및 사용 시스템',
  })
  description: string;

  @ApiProperty({
    description: '엔드포인트 목록',
    example: {
      users: '/users',
      stores: '/stores',
      categories: '/categories',
      payHistory: '/pay-history',
    },
  })
  endpoints: object;

  @ApiProperty({ description: '문서', example: 'README.md 파일을 참조하세요.' })
  documentation: string;
}

export class ApiInfoResponseDto {
  @ApiProperty({ description: '성공 여부', example: true })
  success: boolean;

  @ApiProperty({ type: ApiInfoDataDto })
  data: ApiInfoDataDto;

  @ApiProperty({
    description: '응답 메시지',
    example: 'API 정보가 성공적으로 조회되었습니다.',
  })
  message?: string;
}
