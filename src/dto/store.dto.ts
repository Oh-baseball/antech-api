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
    description: '매장 이미지 URL',
    example: 'https://example.com/store-image.jpg',
    required: false,
  })
  @IsOptional()
  @IsString()
  image?: string;
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
    description: '매장 이미지 URL',
    example: 'https://example.com/new-store-image.jpg',
    required: false,
  })
  @IsOptional()
  @IsString()
  image?: string;
}

export class CreateCategoryDto {
  @ApiProperty({
    description: '카테고리 ID',
    example: 'CAT0001',
    maxLength: 8,
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
}
