import { IsString, IsNotEmpty, IsNumber, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCompanyDto {
  @ApiProperty({
    description: '회사 ID',
    example: 'COMP0001',
    maxLength: 10,
  })
  @IsString()
  @IsNotEmpty()
  company_id: string;

  @ApiProperty({
    description: '회사 포인트',
    example: 1000000,
    minimum: 0,
  })
  @IsNumber()
  @Min(0)
  point: number;
}

export class UpdateCompanyDto {
  @ApiProperty({
    description: '회사 포인트',
    example: 1200000,
    minimum: 0,
    required: false,
  })
  @IsNumber()
  @Min(0)
  point?: number;
}
