import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  HttpCode,
  HttpStatus,
  ParseIntPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { PaymentService } from '../services/payment.service';
import {
  CreateLogoDto,
  UpdateLogoDto,
  CreatePaymentMethodDto,
  UpdatePaymentMethodDto,
  CreateAccountDto,
  UpdateAccountDto,
  CreateCardDto,
  UpdateCardDto,
  CreateTossDto,
  UpdateTossDto,
} from '../dto/payment.dto';
import { ErrorResponseDto } from '../dto/response.dto';

@ApiTags('logos')
@Controller('logos')
export class LogoController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: '로고 생성',
    description: '새로운 로고를 생성합니다.',
  })
  async createLogo(@Body() createLogoDto: CreateLogoDto) {
    const logo = await this.paymentService.createLogo(createLogoDto);
    return {
      success: true,
      data: logo,
      message: '로고가 성공적으로 생성되었습니다.',
    };
  }

  @Get()
  @ApiOperation({
    summary: '모든 로고 조회',
    description: '등록된 모든 로고 목록을 조회합니다.',
  })
  async getAllLogos() {
    const logos = await this.paymentService.findAllLogos();
    return {
      success: true,
      data: logos,
    };
  }

  @Get(':logoId')
  @ApiOperation({
    summary: '로고 조회',
    description: '로고 ID로 로고 정보를 조회합니다.',
  })
  @ApiParam({ name: 'logoId', description: '로고 ID', example: 'LOGO0001' })
  async getLogo(@Param('logoId') logoId: string) {
    const logo = await this.paymentService.findLogoById(logoId);
    return {
      success: true,
      data: logo,
    };
  }

  @Put(':logoId')
  @ApiOperation({
    summary: '로고 정보 수정',
    description: '로고 정보를 수정합니다.',
  })
  @ApiParam({ name: 'logoId', description: '로고 ID', example: 'LOGO0001' })
  async updateLogo(
    @Param('logoId') logoId: string,
    @Body() updateLogoDto: UpdateLogoDto,
  ) {
    const logo = await this.paymentService.updateLogo(logoId, updateLogoDto);
    return {
      success: true,
      data: logo,
      message: '로고 정보가 성공적으로 업데이트되었습니다.',
    };
  }

  @Delete(':logoId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: '로고 삭제',
    description: '로고를 삭제합니다.',
  })
  @ApiParam({ name: 'logoId', description: '로고 ID', example: 'LOGO0001' })
  async deleteLogo(@Param('logoId') logoId: string) {
    await this.paymentService.deleteLogo(logoId);
    return {
      success: true,
      message: '로고가 성공적으로 삭제되었습니다.',
    };
  }
}

@ApiTags('payment-methods')
@Controller('payment-methods')
export class PaymentMethodController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: '결제 수단 생성',
    description: '새로운 결제 수단을 생성합니다.',
  })
  async createPaymentMethod(
    @Body() createPaymentMethodDto: CreatePaymentMethodDto,
  ) {
    const paymentMethod = await this.paymentService.createPaymentMethod(
      createPaymentMethodDto,
    );
    return {
      success: true,
      data: paymentMethod,
      message: '결제 수단이 성공적으로 생성되었습니다.',
    };
  }

  @Get()
  @ApiOperation({
    summary: '모든 결제 수단 조회',
    description: '등록된 모든 결제 수단 목록을 조회합니다.',
  })
  async getAllPaymentMethods() {
    const paymentMethods = await this.paymentService.findAllPaymentMethods();
    return {
      success: true,
      data: paymentMethods,
    };
  }

  @Get('type/:type')
  @ApiOperation({
    summary: '타입별 결제 수단 조회',
    description: '특정 타입의 결제 수단들을 조회합니다.',
  })
  @ApiParam({
    name: 'type',
    description: '결제 수단 타입',
    example: 'CARD',
    enum: ['CARD', 'BANK', 'MOBILE'],
  })
  async getPaymentMethodsByType(
    @Param('type') type: 'CARD' | 'BANK' | 'MOBILE',
  ) {
    const paymentMethods =
      await this.paymentService.findPaymentMethodsByType(type);
    return {
      success: true,
      data: paymentMethods,
    };
  }

  @Get(':methodId')
  @ApiOperation({
    summary: '결제 수단 조회',
    description: '결제 수단 ID로 결제 수단 정보를 조회합니다.',
  })
  @ApiParam({
    name: 'methodId',
    description: '결제 수단 ID',
    example: 'METHOD0001',
  })
  async getPaymentMethod(@Param('methodId') methodId: string) {
    const paymentMethod =
      await this.paymentService.findPaymentMethodById(methodId);
    return {
      success: true,
      data: paymentMethod,
    };
  }

  @Put(':methodId')
  @ApiOperation({
    summary: '결제 수단 정보 수정',
    description: '결제 수단 정보를 수정합니다.',
  })
  @ApiParam({
    name: 'methodId',
    description: '결제 수단 ID',
    example: 'METHOD0001',
  })
  async updatePaymentMethod(
    @Param('methodId') methodId: string,
    @Body() updatePaymentMethodDto: UpdatePaymentMethodDto,
  ) {
    const paymentMethod = await this.paymentService.updatePaymentMethod(
      methodId,
      updatePaymentMethodDto,
    );
    return {
      success: true,
      data: paymentMethod,
      message: '결제 수단 정보가 성공적으로 업데이트되었습니다.',
    };
  }

  @Delete(':methodId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: '결제 수단 삭제',
    description: '결제 수단을 삭제합니다.',
  })
  @ApiParam({
    name: 'methodId',
    description: '결제 수단 ID',
    example: 'METHOD0001',
  })
  async deletePaymentMethod(@Param('methodId') methodId: string) {
    await this.paymentService.deletePaymentMethod(methodId);
    return {
      success: true,
      message: '결제 수단이 성공적으로 삭제되었습니다.',
    };
  }
}

@ApiTags('accounts')
@Controller('accounts')
export class AccountController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: '계좌 생성',
    description: '새로운 계좌를 생성합니다.',
  })
  async createAccount(@Body() createAccountDto: CreateAccountDto) {
    const account = await this.paymentService.createAccount(createAccountDto);
    return {
      success: true,
      data: account,
      message: '계좌가 성공적으로 생성되었습니다.',
    };
  }

  @Get('user/:userId')
  @ApiOperation({
    summary: '사용자별 계좌 조회',
    description: '특정 사용자의 모든 계좌를 조회합니다.',
  })
  @ApiParam({ name: 'userId', description: '사용자 ID', example: 1 })
  async getAccountsByUserId(@Param('userId', ParseIntPipe) userId: number) {
    const accounts = await this.paymentService.findAccountsByUserId(userId);
    return {
      success: true,
      data: accounts,
    };
  }

  @Get(':accountId')
  @ApiOperation({
    summary: '계좌 조회',
    description: '계좌 ID로 계좌 정보를 조회합니다.',
  })
  @ApiParam({ name: 'accountId', description: '계좌 ID', example: 'ACC0001' })
  async getAccount(@Param('accountId') accountId: string) {
    const account = await this.paymentService.findAccountById(accountId);
    return {
      success: true,
      data: account,
    };
  }

  @Put(':accountId')
  @ApiOperation({
    summary: '계좌 정보 수정',
    description: '계좌 정보를 수정합니다.',
  })
  @ApiParam({ name: 'accountId', description: '계좌 ID', example: 'ACC0001' })
  async updateAccount(
    @Param('accountId') accountId: string,
    @Body() updateAccountDto: UpdateAccountDto,
  ) {
    const account = await this.paymentService.updateAccount(
      accountId,
      updateAccountDto,
    );
    return {
      success: true,
      data: account,
      message: '계좌 정보가 성공적으로 업데이트되었습니다.',
    };
  }

  @Delete(':accountId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: '계좌 삭제',
    description: '계좌를 삭제합니다.',
  })
  @ApiParam({ name: 'accountId', description: '계좌 ID', example: 'ACC0001' })
  async deleteAccount(@Param('accountId') accountId: string) {
    await this.paymentService.deleteAccount(accountId);
    return {
      success: true,
      message: '계좌가 성공적으로 삭제되었습니다.',
    };
  }
}

@ApiTags('cards')
@Controller('cards')
export class CardController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: '카드 생성',
    description: '새로운 카드를 생성합니다.',
  })
  async createCard(@Body() createCardDto: CreateCardDto) {
    const card = await this.paymentService.createCard(createCardDto);
    return {
      success: true,
      data: card,
      message: '카드가 성공적으로 생성되었습니다.',
    };
  }

  @Get('user/:userId')
  @ApiOperation({
    summary: '사용자별 카드 조회',
    description: '특정 사용자의 모든 카드를 조회합니다.',
  })
  @ApiParam({ name: 'userId', description: '사용자 ID', example: 1 })
  async getCardsByUserId(@Param('userId', ParseIntPipe) userId: number) {
    const cards = await this.paymentService.findCardsByUserId(userId);
    return {
      success: true,
      data: cards,
    };
  }

  @Get(':cardId')
  @ApiOperation({
    summary: '카드 조회',
    description: '카드 ID로 카드 정보를 조회합니다.',
  })
  @ApiParam({ name: 'cardId', description: '카드 ID', example: 'CARD0001' })
  async getCard(@Param('cardId') cardId: string) {
    const card = await this.paymentService.findCardById(cardId);
    return {
      success: true,
      data: card,
    };
  }

  @Put(':cardId')
  @ApiOperation({
    summary: '카드 정보 수정',
    description: '카드 정보를 수정합니다.',
  })
  @ApiParam({ name: 'cardId', description: '카드 ID', example: 'CARD0001' })
  async updateCard(
    @Param('cardId') cardId: string,
    @Body() updateCardDto: UpdateCardDto,
  ) {
    const card = await this.paymentService.updateCard(cardId, updateCardDto);
    return {
      success: true,
      data: card,
      message: '카드 정보가 성공적으로 업데이트되었습니다.',
    };
  }

  @Delete(':cardId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: '카드 삭제',
    description: '카드를 삭제합니다.',
  })
  @ApiParam({ name: 'cardId', description: '카드 ID', example: 'CARD0001' })
  async deleteCard(@Param('cardId') cardId: string) {
    await this.paymentService.deleteCard(cardId);
    return {
      success: true,
      message: '카드가 성공적으로 삭제되었습니다.',
    };
  }
}

@ApiTags('toss')
@Controller('toss')
export class TossController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: '토스 송금 생성',
    description: '새로운 토스 송금을 생성합니다.',
  })
  async createToss(@Body() createTossDto: CreateTossDto) {
    const toss = await this.paymentService.createToss(createTossDto);
    return {
      success: true,
      data: toss,
      message: '토스 송금이 성공적으로 생성되었습니다.',
    };
  }

  @Get('user/:userId')
  @ApiOperation({
    summary: '사용자별 토스 내역 조회',
    description: '특정 사용자의 모든 토스 내역을 조회합니다.',
  })
  @ApiParam({ name: 'userId', description: '사용자 ID', example: 1 })
  async getTossByUserId(@Param('userId', ParseIntPipe) userId: number) {
    const tossList = await this.paymentService.findTossByUserId(userId);
    return {
      success: true,
      data: tossList,
    };
  }

  @Get(':tossId')
  @ApiOperation({
    summary: '토스 조회',
    description: '토스 ID로 토스 정보를 조회합니다.',
  })
  @ApiParam({ name: 'tossId', description: '토스 ID', example: 1 })
  async getToss(@Param('tossId', ParseIntPipe) tossId: number) {
    const toss = await this.paymentService.findTossById(tossId);
    return {
      success: true,
      data: toss,
    };
  }

  @Put(':tossId')
  @ApiOperation({
    summary: '토스 정보 수정',
    description: '토스 정보를 수정합니다.',
  })
  @ApiParam({ name: 'tossId', description: '토스 ID', example: 1 })
  async updateToss(
    @Param('tossId', ParseIntPipe) tossId: number,
    @Body() updateTossDto: UpdateTossDto,
  ) {
    const toss = await this.paymentService.updateToss(tossId, updateTossDto);
    return {
      success: true,
      data: toss,
      message: '토스 정보가 성공적으로 업데이트되었습니다.',
    };
  }

  @Delete(':tossId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: '토스 삭제',
    description: '토스를 삭제합니다.',
  })
  @ApiParam({ name: 'tossId', description: '토스 ID', example: 1 })
  async deleteToss(@Param('tossId', ParseIntPipe) tossId: number) {
    await this.paymentService.deleteToss(tossId);
    return {
      success: true,
      message: '토스가 성공적으로 삭제되었습니다.',
    };
  }

  @Get('stats/company/:companyId')
  @ApiOperation({
    summary: '회사별 토스 통계 조회',
    description: '특정 회사의 토스 통계를 조회합니다.',
  })
  @ApiParam({ name: 'companyId', description: '회사 ID', example: 'COMP0001' })
  async getTossStatsByCompany(@Param('companyId') companyId: string) {
    const stats = await this.paymentService.getTossStatsByCompany(companyId);
    return {
      success: true,
      data: stats,
    };
  }
}
