import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsNumber,
  Min,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

// Logo DTOs
export class CreateLogoDto {
  @ApiProperty({
    description: '로고 이름',
    example: '스타벅스 로고',
    maxLength: 100,
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: '로고 이미지 URL',
    example: 'https://logo.starbucks.co.kr/logo.png',
    maxLength: 500,
  })
  @IsString()
  @IsNotEmpty()
  image_url: string;

  @ApiProperty({
    description: '사용자 ID',
    example: 1,
  })
  @IsNumber()
  @IsNotEmpty()
  user_id: number;
}

export class UpdateLogoDto {
  @ApiProperty({
    description: '로고 이름',
    example: '스타벅스 새 로고',
    maxLength: 100,
    required: false,
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({
    description: '로고 이미지 URL',
    example: 'https://logo.starbucks.co.kr/new-logo.png',
    maxLength: 500,
    required: false,
  })
  @IsOptional()
  @IsString()
  image_url?: string;

  @ApiProperty({
    description: '사용자 ID',
    example: 2,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  user_id?: number;
}

// PaymentMethod DTOs
export class CreatePaymentMethodDto {
  @ApiProperty({
    description: '결제수단 ID',
    example: 'METHOD0001',
    maxLength: 10,
  })
  @IsString()
  @IsNotEmpty()
  method_id: string;

  @ApiProperty({
    description: '결제수단 이름',
    example: '신용카드',
    maxLength: 50,
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: '결제수단 설명',
    example: '신용카드로 결제',
    maxLength: 200,
    required: false,
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    description: '활성화 여부',
    example: true,
    required: false,
    default: true,
  })
  @IsOptional()
  is_active?: boolean;
}

export class UpdatePaymentMethodDto {
  @ApiProperty({
    description: '결제수단 이름',
    example: '체크카드',
    maxLength: 50,
    required: false,
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({
    description: '결제수단 설명',
    example: '체크카드로 결제',
    maxLength: 200,
    required: false,
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    description: '활성화 여부',
    example: false,
    required: false,
  })
  @IsOptional()
  is_active?: boolean;
}

// Account DTOs
export class CreateAccountDto {
  @ApiProperty({
    description: '계좌 ID',
    example: 'ACC0001',
    maxLength: 10,
  })
  @IsString()
  @IsNotEmpty()
  account_id: string;

  @ApiProperty({
    description: '사용자 ID',
    example: 1,
  })
  @IsNumber()
  @IsNotEmpty()
  user_id: number;

  @ApiProperty({
    description: '계좌번호',
    example: '123-456-789012',
    maxLength: 30,
  })
  @IsString()
  @IsNotEmpty()
  number: string;

  @ApiProperty({
    description: '로고 ID',
    example: 'LOGO0001',
    required: false,
  })
  @IsOptional()
  @IsString()
  logo_id?: string;
}

export class UpdateAccountDto {
  @ApiProperty({
    description: '계좌번호',
    example: '987-654-321098',
    maxLength: 30,
    required: false,
  })
  @IsOptional()
  @IsString()
  number?: string;

  @ApiProperty({
    description: '로고 ID',
    example: 'LOGO0002',
    required: false,
  })
  @IsOptional()
  @IsString()
  logo_id?: string;
}

// Card DTOs
export class CreateCardDto {
  @ApiProperty({
    description: '카드 ID',
    example: 'CARD0001',
    maxLength: 10,
  })
  @IsString()
  @IsNotEmpty()
  card_id: string;

  @ApiProperty({
    description: '사용자 ID',
    example: 1,
  })
  @IsNumber()
  @IsNotEmpty()
  user_id: number;

  @ApiProperty({
    description: '카드번호',
    example: '1234-5678-9012-3456',
    maxLength: 30,
  })
  @IsString()
  @IsNotEmpty()
  number: string;
}

export class UpdateCardDto {
  @ApiProperty({
    description: '카드번호',
    example: '9876-5432-1098-7654',
    maxLength: 30,
    required: false,
  })
  @IsOptional()
  @IsString()
  number?: string;
}

// Toss DTOs
export class CreateTossDto {
  @ApiProperty({
    description: '사용자 ID',
    example: 1,
  })
  @IsNumber()
  @IsNotEmpty()
  user_id: number;

  @ApiProperty({
    description: '토스 금액',
    example: 10000,
    minimum: 1,
  })
  @IsNumber()
  @Min(1)
  toss_amount: number;
}

export class UpdateTossDto {
  @ApiProperty({
    description: '토스 금액',
    example: 15000,
    minimum: 1,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  toss_amount?: number;
}
