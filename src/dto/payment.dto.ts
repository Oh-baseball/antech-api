import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsEnum,
  Min,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

// Logo DTOs
export class CreateLogoDto {
  @ApiProperty({
    description: '로고 ID',
    example: 'LOGO0001',
    maxLength: 8,
  })
  @IsString()
  @IsNotEmpty()
  logo_id: string;

  @ApiProperty({
    description: '로고 이미지 URL',
    example: 'https://example.com/logos/samsung_logo.png',
  })
  @IsString()
  @IsNotEmpty()
  image: string;
}

export class UpdateLogoDto {
  @ApiProperty({
    description: '로고 이미지 URL',
    example: 'https://example.com/logos/new_samsung_logo.png',
    required: false,
  })
  @IsOptional()
  @IsString()
  image?: string;
}

// PaymentMethod DTOs
export enum PaymentType {
  CARD = 'CARD',
  BANK = 'BANK',
  MOBILE = 'MOBILE',
}

export class CreatePaymentMethodDto {
  @ApiProperty({
    description: '결제 수단 ID',
    example: 'METHOD0001',
    maxLength: 10,
  })
  @IsString()
  @IsNotEmpty()
  method_id: string;

  @ApiProperty({
    description: '로고 ID',
    example: 'LOGO0001',
  })
  @IsString()
  @IsNotEmpty()
  logo_id: string;

  @ApiProperty({
    description: '결제 유형',
    enum: PaymentType,
    example: PaymentType.CARD,
  })
  @IsEnum(PaymentType)
  type: PaymentType;

  @ApiProperty({
    description: '결제 수단 이름',
    example: 'VISA 신용카드',
  })
  @IsString()
  @IsNotEmpty()
  name: string;
}

export class UpdatePaymentMethodDto {
  @ApiProperty({
    description: '로고 ID',
    example: 'LOGO0002',
    required: false,
  })
  @IsOptional()
  @IsString()
  logo_id?: string;

  @ApiProperty({
    description: '결제 유형',
    enum: PaymentType,
    example: PaymentType.MOBILE,
    required: false,
  })
  @IsOptional()
  @IsEnum(PaymentType)
  type?: PaymentType;

  @ApiProperty({
    description: '결제 수단 이름',
    example: '카카오페이',
    required: false,
  })
  @IsOptional()
  @IsString()
  name?: string;
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
    description: '회사 ID',
    example: 'COMP0001',
    required: false,
  })
  @IsOptional()
  @IsString()
  company_id?: string;

  @ApiProperty({
    description: '계좌번호',
    example: '110-123-456789',
    maxLength: 30,
  })
  @IsString()
  @IsNotEmpty()
  number: string;

  @ApiProperty({
    description: '로고 ID',
    example: 'LOGO0011',
    required: false,
  })
  @IsOptional()
  @IsString()
  logo_id?: string;
}

export class UpdateAccountDto {
  @ApiProperty({
    description: '회사 ID',
    example: 'COMP0002',
    required: false,
  })
  @IsOptional()
  @IsString()
  company_id?: string;

  @ApiProperty({
    description: '계좌번호',
    example: '110-123-456780',
    maxLength: 30,
    required: false,
  })
  @IsOptional()
  @IsString()
  number?: string;

  @ApiProperty({
    description: '로고 ID',
    example: 'LOGO0012',
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
    description: '회사 ID',
    example: 'COMP0001',
    required: false,
  })
  @IsOptional()
  @IsString()
  company_id?: string;

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
    description: '회사 ID',
    example: 'COMP0002',
    required: false,
  })
  @IsOptional()
  @IsString()
  company_id?: string;

  @ApiProperty({
    description: '카드번호',
    example: '1234-5678-9012-3457',
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
    description: '회사 ID',
    example: 'COMP0001',
  })
  @IsString()
  @IsNotEmpty()
  company_id: string;

  @ApiProperty({
    description: '토스 금액',
    example: 50000,
    minimum: 0,
  })
  @IsNumber()
  @Min(0)
  toss_amount: number;
}

export class UpdateTossDto {
  @ApiProperty({
    description: '회사 ID',
    example: 'COMP0002',
    required: false,
  })
  @IsOptional()
  @IsString()
  company_id?: string;

  @ApiProperty({
    description: '토스 금액',
    example: 75000,
    minimum: 0,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  toss_amount?: number;
}
