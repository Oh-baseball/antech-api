import { IsString, IsNotEmpty, IsNumber, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePayHistoryDto {
  @ApiProperty({
    description: '사용자 ID (숫자)',
    example: 1,
  })
  @IsNumber()
  @IsNotEmpty()
  user_id: number;

  @ApiProperty({
    description: '매장 ID (숫자)',
    example: 1,
  })
  @IsNumber()
  @IsNotEmpty()
  store_id: number;

  @ApiProperty({
    description: '결제 수단 ID',
    example: 'METHOD0001',
  })
  @IsString()
  @IsNotEmpty()
  method_id: string;

  @ApiProperty({
    description:
      '금액 (포인트 적립: 양수, 포인트 사용: 양수로 입력하면 자동으로 음수 처리)',
    example: 1000,
    minimum: 1,
  })
  @IsNumber()
  @Min(1)
  amount: number;
}
