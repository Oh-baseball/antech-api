import {
  IsString,
  IsNotEmpty,
  IsOptional,
  MinLength,
  MaxLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateStoreDto {
  @ApiProperty({
    description: '매장 이름',
    example: '스타벅스 강남점',
    minLength: 2,
    maxLength: 100,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(100)
  name: string;

  @ApiProperty({
    description: '매장 주소',
    example: '서울시 강남구 테헤란로 123',
    minLength: 5,
    maxLength: 200,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(5)
  @MaxLength(200)
  address: string;

  @ApiProperty({
    description: '카테고리 ID',
    example: 'CAT0001',
    maxLength: 10,
  })
  @IsString()
  @IsNotEmpty()
  category_id: string;

  @ApiProperty({
    description: '매장 전화번호',
    example: '02-1234-5678',
    required: false,
  })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiProperty({
    description: '매장 설명',
    example: '강남역 근처 스타벅스입니다.',
    required: false,
  })
  @IsOptional()
  @IsString()
  description?: string;
}

export class UpdateStoreDto {
  @ApiProperty({
    description: '매장 이름',
    example: '스타벅스 신논현점',
    minLength: 2,
    maxLength: 100,
    required: false,
  })
  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  name?: string;

  @ApiProperty({
    description: '매장 주소',
    example: '서울시 강남구 논현로 456',
    minLength: 5,
    maxLength: 200,
    required: false,
  })
  @IsOptional()
  @IsString()
  @MinLength(5)
  @MaxLength(200)
  address?: string;

  @ApiProperty({
    description: '카테고리 ID',
    example: 'CAT0002',
    maxLength: 10,
    required: false,
  })
  @IsOptional()
  @IsString()
  category_id?: string;

  @ApiProperty({
    description: '매장 전화번호',
    example: '02-9876-5432',
    required: false,
  })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiProperty({
    description: '매장 설명',
    example: '신논현역 근처 스타벅스입니다.',
    required: false,
  })
  @IsOptional()
  @IsString()
  description?: string;
}

export class CreateCategoryDto {
  @ApiProperty({
    description: '카테고리 ID',
    example: 'CAT0001',
    maxLength: 10,
  })
  @IsString()
  @IsNotEmpty()
  category_id: string;

  @ApiProperty({
    description: '카테고리 이름',
    example: '음료',
    minLength: 1,
    maxLength: 50,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  @MaxLength(50)
  name: string;

  @ApiProperty({
    description: '카테고리 설명',
    example: '음료 카테고리입니다.',
    required: false,
  })
  @IsOptional()
  @IsString()
  description?: string;
}

export class UpdateCategoryDto {
  @ApiProperty({
    description: '카테고리 이름',
    example: '디저트',
    minLength: 1,
    maxLength: 50,
    required: false,
  })
  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(50)
  name?: string;

  @ApiProperty({
    description: '카테고리 설명',
    example: '디저트 카테고리입니다.',
    required: false,
  })
  @IsOptional()
  @IsString()
  description?: string;
}
