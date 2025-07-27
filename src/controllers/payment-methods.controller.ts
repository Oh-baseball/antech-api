// 간편 결제 시스템 - 결제수단 컨트롤러

import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  ParseIntPipe,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { UserService } from '../services/user.service';
import {
  CreatePaymentMethodDto,
  UpdatePaymentMethodDto,
  PaymentMethodDto,
  PaymentProviderDto,
} from '../dto/user.dto';
import { ResponseDto } from '../dto/response.dto';

@ApiTags('💳 payment-methods')
@Controller('payment-methods')
export class PaymentMethodsController {
  constructor(private readonly userService: UserService) {}

  /* -------------------------------------------------------------
     결제 업체 관리
  ------------------------------------------------------------- */

  @Get('providers')
  @ApiOperation({
    summary: '결제 업체 목록 조회',
    description: '사용 가능한 결제 업체 목록을 조회합니다.',
  })
  @ApiResponse({
    status: 200,
    description: '결제 업체 목록 조회 성공',
    type: ResponseDto,
  })
  async getPaymentProviders(): Promise<ResponseDto> {
    const providers = await this.userService.getPaymentProviders();

    return {
      success: true,
      data: providers,
      message: '결제 업체 목록을 성공적으로 조회했습니다.',
    };
  }

  /* -------------------------------------------------------------
     사용자 결제 수단 관리
  ------------------------------------------------------------- */

  @Get('users/:userId')
  @ApiOperation({
    summary: '사용자 결제 수단 목록 조회',
    description: '특정 사용자의 등록된 결제 수단 목록을 조회합니다.',
  })
  @ApiParam({ name: 'userId', description: '사용자 ID' })
  @ApiResponse({
    status: 200,
    description: '결제 수단 목록 조회 성공',
    type: ResponseDto,
  })
  async getUserPaymentMethods(
    @Param('userId', ParseIntPipe) userId: number,
  ): Promise<ResponseDto> {
    const paymentMethods = await this.userService.getUserPaymentMethods(userId);

    return {
      success: true,
      data: paymentMethods,
      message: '결제 수단 목록을 성공적으로 조회했습니다.',
    };
  }

  @Get('users/:userId/methods/:methodId')
  @ApiOperation({
    summary: '특정 결제 수단 조회',
    description: '사용자의 특정 결제 수단 정보를 조회합니다.',
  })
  @ApiParam({ name: 'userId', description: '사용자 ID' })
  @ApiParam({ name: 'methodId', description: '결제 수단 ID' })
  @ApiResponse({
    status: 200,
    description: '결제 수단 조회 성공',
    type: ResponseDto,
  })
  async getPaymentMethod(
    @Param('userId', ParseIntPipe) userId: number,
    @Param('methodId', ParseIntPipe) methodId: number,
  ): Promise<ResponseDto> {
    const paymentMethod = await this.userService.getPaymentMethod(
      userId,
      methodId,
    );

    return {
      success: true,
      data: paymentMethod,
      message: '결제 수단 정보를 성공적으로 조회했습니다.',
    };
  }

  @Post('users/:userId')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: '결제 수단 등록',
    description: '새로운 결제 수단을 등록합니다.',
  })
  @ApiParam({ name: 'userId', description: '사용자 ID' })
  @ApiResponse({
    status: 201,
    description: '결제 수단 등록 성공',
    type: ResponseDto,
  })
  async createPaymentMethod(
    @Param('userId', ParseIntPipe) userId: number,
    @Body() createPaymentMethodDto: CreatePaymentMethodDto,
  ): Promise<ResponseDto> {
    // DTO에서 user_id를 URL 파라미터로 오버라이드
    const paymentMethodDto = {
      ...createPaymentMethodDto,
      user_id: userId,
    };

    const paymentMethod =
      await this.userService.createPaymentMethod(paymentMethodDto);

    return {
      success: true,
      data: paymentMethod,
      message: '결제 수단이 성공적으로 등록되었습니다.',
    };
  }

  @Put('users/:userId/methods/:methodId')
  @ApiOperation({
    summary: '결제 수단 수정',
    description: '등록된 결제 수단 정보를 수정합니다.',
  })
  @ApiParam({ name: 'userId', description: '사용자 ID' })
  @ApiParam({ name: 'methodId', description: '결제 수단 ID' })
  @ApiResponse({
    status: 200,
    description: '결제 수단 수정 성공',
    type: ResponseDto,
  })
  async updatePaymentMethod(
    @Param('userId', ParseIntPipe) userId: number,
    @Param('methodId', ParseIntPipe) methodId: number,
    @Body() updatePaymentMethodDto: UpdatePaymentMethodDto,
  ): Promise<ResponseDto> {
    const updatedPaymentMethod = await this.userService.updatePaymentMethod(
      userId,
      methodId,
      updatePaymentMethodDto,
    );

    return {
      success: true,
      data: updatedPaymentMethod,
      message: '결제 수단이 성공적으로 수정되었습니다.',
    };
  }

  @Delete('users/:userId/methods/:methodId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: '결제 수단 삭제',
    description: '등록된 결제 수단을 삭제합니다.',
  })
  @ApiParam({ name: 'userId', description: '사용자 ID' })
  @ApiParam({ name: 'methodId', description: '결제 수단 ID' })
  @ApiResponse({
    status: 204,
    description: '결제 수단 삭제 성공',
  })
  async deletePaymentMethod(
    @Param('userId', ParseIntPipe) userId: number,
    @Param('methodId', ParseIntPipe) methodId: number,
  ): Promise<void> {
    await this.userService.deletePaymentMethod(userId, methodId);
  }

  @Put('users/:userId/methods/:methodId/default')
  @ApiOperation({
    summary: '기본 결제 수단 설정',
    description: '특정 결제 수단을 기본 결제 수단으로 설정합니다.',
  })
  @ApiParam({ name: 'userId', description: '사용자 ID' })
  @ApiParam({ name: 'methodId', description: '결제 수단 ID' })
  @ApiResponse({
    status: 200,
    description: '기본 결제 수단 설정 성공',
    type: ResponseDto,
  })
  async setDefaultPaymentMethod(
    @Param('userId', ParseIntPipe) userId: number,
    @Param('methodId', ParseIntPipe) methodId: number,
  ): Promise<ResponseDto> {
    const paymentMethod = await this.userService.setDefaultPaymentMethod(
      userId,
      methodId,
    );

    return {
      success: true,
      data: paymentMethod,
      message: '기본 결제 수단이 성공적으로 설정되었습니다.',
    };
  }

  /* -------------------------------------------------------------
     개발용 API
  ------------------------------------------------------------- */

  @Post('dev/generate-test-methods/:userId')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: '테스트 결제 수단 생성 (개발용)',
    description: '개발 및 테스트용 결제 수단을 자동으로 생성합니다.',
  })
  @ApiParam({ name: 'userId', description: '사용자 ID' })
  @ApiResponse({
    status: 201,
    description: '테스트 결제 수단 생성 성공',
    type: ResponseDto,
  })
  async generateTestPaymentMethods(
    @Param('userId', ParseIntPipe) userId: number,
  ): Promise<ResponseDto> {
    const testMethods =
      await this.userService.generateTestPaymentMethods(userId);

    return {
      success: true,
      data: testMethods,
      message: `${testMethods.length}개의 테스트 결제 수단이 생성되었습니다.`,
    };
  }
}
