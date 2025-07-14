import {
  IsString,
  IsNotEmpty,
  IsOptional,
  MinLength,
  MaxLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({
    description: '회사/기업 ID',
    example: 'COMP0001',
    required: false,
  })
  @IsOptional()
  @IsString()
  company_id?: string;

  @ApiProperty({
    description: '비밀번호',
    example: 'password123',
    minLength: 6,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @ApiProperty({
    description: '사용자 이름',
    example: '홍길동',
    minLength: 2,
    maxLength: 50,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(50)
  name: string;

  @ApiProperty({
    description: '숫자 패스워드',
    example: '123456',
    required: false,
  })
  @IsOptional()
  @IsString()
  pw_number?: string;

  @ApiProperty({
    description: '패턴 패스워드',
    example: '1234',
    required: false,
  })
  @IsOptional()
  @IsString()
  pw_pattern?: string;
}

export class UpdateUserDto {
  @ApiProperty({
    description: '회사/기업 ID',
    example: 'COMP0002',
    required: false,
  })
  @IsOptional()
  @IsString()
  company_id?: string;

  @ApiProperty({
    description: '새 비밀번호',
    example: 'newpassword123',
    minLength: 6,
    required: false,
  })
  @IsOptional()
  @IsString()
  @MinLength(6)
  password?: string;

  @ApiProperty({
    description: '새 이름',
    example: '김철수',
    minLength: 2,
    maxLength: 50,
    required: false,
  })
  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(50)
  name?: string;

  @ApiProperty({
    description: '새 숫자 패스워드',
    example: '654321',
    required: false,
  })
  @IsOptional()
  @IsString()
  pw_number?: string;

  @ApiProperty({
    description: '새 패턴 패스워드',
    example: '4321',
    required: false,
  })
  @IsOptional()
  @IsString()
  pw_pattern?: string;
}

export class VerifyPasswordDto {
  @ApiProperty({
    description: '확인할 비밀번호',
    example: 'password123',
  })
  @IsString()
  @IsNotEmpty()
  password: string;
}
