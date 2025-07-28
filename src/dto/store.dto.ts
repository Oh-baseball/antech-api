// 간편 결제 시스템 - 매장, 메뉴, 주문 관련 DTO

import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  IsBoolean,
  IsNumber,
  IsArray,
  IsEnum,
  MinLength,
  MaxLength,
  Min,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { PaymentType, AuthType } from '../entities/user.entity';

/* -------------------------------------------------------------
   매장 관련 DTO
------------------------------------------------------------- */

export class CreateStoreDto {
  @ApiProperty({
    description: '매장명',
    example: '스타벅스 강남점',
  })
  @IsString()
  @MaxLength(100)
  store_name: string;

  @ApiProperty({
    description: '매장 주소',
    example: '서울특별시 강남구 테헤란로 152',
  })
  @IsString()
  address: string;

  @ApiProperty({
    description: '매장 전화번호',
    example: '02-1234-5678',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(20)
  phone?: string;

  @ApiProperty({
    description: '사업자 등록번호',
    example: '123-45-67890',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(20)
  business_number?: string;

  @ApiProperty({
    description: '포인트 적립률 (%)',
    example: 1.0,
    required: false,
    minimum: 0,
    maximum: 100,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  point_rate?: number;

  @ApiProperty({
    description: '매장 로고 URL',
    example: 'https://example.com/logos/starbucks.png',
    required: false,
  })
  @IsOptional()
  @IsString()
  logo_url?: string;
}

export class UpdateStoreDto {
  @ApiProperty({
    description: '매장명',
    example: '스타벅스 강남점',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  store_name?: string;

  @ApiProperty({
    description: '매장 주소',
    example: '서울특별시 강남구 테헤란로 152',
    required: false,
  })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiProperty({
    description: '매장 전화번호',
    example: '02-1234-5678',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(20)
  phone?: string;

  @ApiProperty({
    description: '사업자 등록번호',
    example: '123-45-67890',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(20)
  business_number?: string;

  @ApiProperty({
    description: '포인트 적립률 (%)',
    example: 1.5,
    required: false,
    minimum: 0,
    maximum: 100,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  point_rate?: number;

  @ApiProperty({
    description: '매장 로고 URL',
    example: 'https://example.com/logos/starbucks.png',
    required: false,
  })
  @IsOptional()
  @IsString()
  logo_url?: string;

  @ApiProperty({
    description: '매장 활성화 상태',
    example: true,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  is_active?: boolean;
}

/* -------------------------------------------------------------
   카테고리 관련 DTO
------------------------------------------------------------- */

export class CreateCategoryDto {
  @ApiProperty({
    description: '카테고리명',
    example: '커피',
  })
  @IsString()
  @MaxLength(50)
  category_name: string;

  @ApiProperty({
    description: '카테고리 설명',
    example: '각종 커피 음료',
    required: false,
  })
  @IsOptional()
  @IsString()
  description?: string;
}

export class UpdateCategoryDto {
  @ApiProperty({
    description: '카테고리명',
    example: '커피',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  category_name?: string;

  @ApiProperty({
    description: '카테고리 설명',
    example: '각종 커피 음료',
    required: false,
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    description: '카테고리 활성화 상태',
    example: true,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  is_active?: boolean;
}

/* -------------------------------------------------------------
   메뉴 관련 DTO
------------------------------------------------------------- */

export class CreateMenuDto {
  @ApiProperty({
    description: '매장 ID',
    example: 1,
  })
  @IsNumber()
  store_id: number;

  @ApiProperty({
    description: '카테고리 ID',
    example: 1,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  category_id?: number;

  @ApiProperty({
    description: '메뉴명',
    example: '아메리카노',
  })
  @IsString()
  @MaxLength(100)
  menu_name: string;

  @ApiProperty({
    description: '메뉴 설명',
    example: '깊고 진한 에스프레소의 풍미를 느낄 수 있는 대표 커피',
    required: false,
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    description: '가격 (원)',
    example: 4500,
    minimum: 0,
  })
  @IsNumber()
  @Min(0)
  price: number;

  @ApiProperty({
    description: '메뉴 이미지 URL',
    example: 'https://image.istarbucks.co.kr/upload/store/skuimg/americano.jpg',
    required: false,
  })
  @IsOptional()
  @IsString()
  image_url?: string;
}

export class UpdateMenuDto {
  @ApiProperty({
    description: '카테고리 ID',
    example: 1,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  category_id?: number;

  @ApiProperty({
    description: '메뉴명',
    example: '아메리카노',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  menu_name?: string;

  @ApiProperty({
    description: '메뉴 설명',
    example: '깊고 진한 에스프레소의 풍미를 느낄 수 있는 대표 커피',
    required: false,
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    description: '가격 (원)',
    example: 4500,
    required: false,
    minimum: 0,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  price?: number;

  @ApiProperty({
    description: '메뉴 이미지 URL',
    example: 'https://image.istarbucks.co.kr/upload/store/skuimg/americano.jpg',
    required: false,
  })
  @IsOptional()
  @IsString()
  image_url?: string;

  @ApiProperty({
    description: '메뉴 판매 가능 여부',
    example: true,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  is_available?: boolean;
}

/* -------------------------------------------------------------
   주문 관련 DTO
------------------------------------------------------------- */

export class OrderItemDto {
  @ApiProperty({
    description: '메뉴 ID',
    example: 1,
  })
  @IsNumber()
  menu_id: number;

  @ApiProperty({
    description: '수량',
    example: 2,
    minimum: 1,
  })
  @IsNumber()
  @Min(1)
  quantity: number;
}

export class CreateOrderDto {
  @ApiProperty({
    description: '사용자 ID',
    example: 1,
  })
  @IsNumber()
  user_id: number;

  @ApiProperty({
    description: '매장 ID',
    example: 1,
  })
  @IsNumber()
  store_id: number;

  @ApiProperty({
    description: '주문 상품 목록',
    type: [OrderItemDto],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  items: OrderItemDto[];

  @ApiProperty({
    description: '사용할 포인트',
    example: 1000,
    required: false,
    minimum: 0,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  point_used?: number;
}

export { OrderSummaryDto, PaymentResultDto } from '../entities/store.entity';

/* -------------------------------------------------------------
   인증 후 결제 관련 DTO
------------------------------------------------------------- */

export class AuthenticateAndPayDto {
  // 인증 정보
  @ApiProperty({
    description: '사용자 ID',
    example: 1,
  })
  @IsNumber()
  user_id: number;

  @ApiProperty({
    description: '인증 타입',
    example: AuthType.PIN,
    enum: AuthType,
  })
  @IsEnum(AuthType)
  auth_type: AuthType;

  @ApiProperty({
    description: '인증 값 (PIN 번호 또는 패턴 시퀀스)',
    example: '123456',
  })
  @IsString()
  auth_value: string;

  @ApiProperty({
    description: '디바이스 정보',
    example: 'iPhone 15 Pro, iOS 17.0',
    required: false,
  })
  @IsOptional()
  @IsString()
  device_info?: string;

  // 결제 정보
  @ApiProperty({
    description: '주문 ID',
    example: 'ORD_20241201_123456',
  })
  @IsString()
  order_id: string;

  @ApiProperty({
    description: '결제 수단 ID',
    example: 1,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  method_id?: number;

  @ApiProperty({
    description: '결제 방법',
    example: PaymentType.CARD,
    enum: PaymentType,
  })
  @IsEnum(PaymentType)
  payment_method: PaymentType;

  @ApiProperty({
    description: '결제 금액',
    example: 15000,
    minimum: 0,
  })
  @IsNumber()
  @Min(0)
  payment_amount: number;

  @ApiProperty({
    description: '사용할 포인트',
    example: 1000,
    required: false,
    minimum: 0,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  point_used?: number;
}

export class AuthenticatedPaymentResultDto {
  @ApiProperty({
    description: '인증 성공 여부',
    example: true,
  })
  auth_success: boolean;

  @ApiProperty({
    description: '결제 성공 여부',
    example: true,
  })
  payment_success: boolean;

  @ApiProperty({
    description: '인증 결과 정보',
  })
  auth_result: any;

  @ApiProperty({
    description: '결제 결과 정보',
    required: false,
  })
  payment_result?: any;

  @ApiProperty({
    description: '실패 사유',
    example: '인증에 실패했습니다.',
    required: false,
  })
  failure_reason?: string;
}

export class CreatePaymentDto {
  @ApiProperty({
    description: '주문 ID',
    example: 'ORD_20241201_123456',
  })
  @IsString()
  order_id: string;

  @ApiProperty({
    description: '사용자 ID',
    example: 1,
  })
  @IsNumber()
  user_id: number;

  @ApiProperty({
    description: '결제 수단 ID',
    example: 1,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  method_id?: number;

  @ApiProperty({
    description: '결제 방법',
    example: PaymentType.CARD,
    enum: PaymentType,
  })
  @IsEnum(PaymentType)
  payment_method: PaymentType;

  @ApiProperty({
    description: '결제 금액',
    example: 15000,
    minimum: 0,
  })
  @IsNumber()
  @Min(0)
  payment_amount: number;

  @ApiProperty({
    description: '사용할 포인트',
    example: 1000,
    required: false,
    minimum: 0,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  point_used?: number;
}
