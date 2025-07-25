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

// ===== Logo Controller =====
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
  @ApiResponse({
    status: 201,
    description: '로고가 성공적으로 생성되었습니다.',
  })
  @ApiResponse({
    status: 409,
    description: '이미 존재하는 로고 ID입니다.',
    type: ErrorResponseDto,
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
      message: '로고가 성공적으로 업데이트되었습니다.',
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

// ===== PaymentMethod Controller =====
@ApiTags('payment-methods')
@Controller('payment-methods')
export class PaymentMethodController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: '결제수단 생성',
    description: '새로운 결제수단을 생성합니다.',
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
      message: '결제수단이 성공적으로 생성되었습니다.',
    };
  }

  @Get()
  @ApiOperation({
    summary: '모든 결제수단 조회',
    description: '등록된 모든 결제수단 목록을 조회합니다.',
  })
  async getAllPaymentMethods() {
    const paymentMethods = await this.paymentService.findAllPaymentMethods();
    return {
      success: true,
      data: paymentMethods,
    };
  }

  @Get(':methodId')
  @ApiOperation({
    summary: '결제수단 조회',
    description: '결제수단 ID로 결제수단 정보를 조회합니다.',
  })
  @ApiParam({
    name: 'methodId',
    description: '결제수단 ID',
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
    summary: '결제수단 정보 수정',
    description: '결제수단 정보를 수정합니다.',
  })
  @ApiParam({
    name: 'methodId',
    description: '결제수단 ID',
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
      message: '결제수단이 성공적으로 업데이트되었습니다.',
    };
  }

  @Delete(':methodId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: '결제수단 삭제',
    description: '결제수단을 삭제합니다.',
  })
  @ApiParam({
    name: 'methodId',
    description: '결제수단 ID',
    example: 'METHOD0001',
  })
  async deletePaymentMethod(@Param('methodId') methodId: string) {
    await this.paymentService.deletePaymentMethod(methodId);
    return {
      success: true,
      message: '결제수단이 성공적으로 삭제되었습니다.',
    };
  }
}

// ===== Account Controller =====
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

  @Get()
  @ApiOperation({
    summary: '모든 계좌 조회',
    description: '등록된 모든 계좌 목록을 조회합니다.',
  })
  async getAllAccounts() {
    const accounts = await this.paymentService.findAllAccounts();
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
      message: '계좌가 성공적으로 업데이트되었습니다.',
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

// ===== Card Controller =====
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

  @Get()
  @ApiOperation({
    summary: '모든 카드 조회',
    description: '등록된 모든 카드 목록을 조회합니다.',
  })
  async getAllCards() {
    const cards = await this.paymentService.findAllCards();
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
      message: '카드가 성공적으로 업데이트되었습니다.',
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

// ===== Toss Controller =====
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

  @Get()
  @ApiOperation({
    summary: '모든 토스 송금 조회',
    description: '등록된 모든 토스 송금 목록을 조회합니다.',
  })
  async getAllToss() {
    const tossRecords = await this.paymentService.findAllToss();
    return {
      success: true,
      data: tossRecords,
    };
  }

  @Get('user/:userId')
  @ApiOperation({
    summary: '사용자별 토스 송금 조회',
    description: '사용자 ID로 토스 송금 목록을 조회합니다.',
  })
  @ApiParam({ name: 'userId', description: '사용자 ID', example: 1 })
  async getTossByUserId(@Param('userId') userId: number) {
    const tossRecords = await this.paymentService.findTossByUserId(userId);
    return {
      success: true,
      data: tossRecords,
    };
  }

  @Put(':userId')
  @ApiOperation({
    summary: '토스 송금 정보 수정',
    description: '토스 송금 정보를 수정합니다.',
  })
  @ApiParam({ name: 'userId', description: '사용자 ID', example: 1 })
  async updateToss(
    @Param('userId') userId: number,
    @Body() updateTossDto: UpdateTossDto,
  ) {
    const toss = await this.paymentService.updateToss(userId, updateTossDto);
    return {
      success: true,
      data: toss,
      message: '토스 송금이 성공적으로 업데이트되었습니다.',
    };
  }

  @Delete(':userId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: '토스 송금 삭제',
    description: '토스 송금을 삭제합니다.',
  })
  @ApiParam({ name: 'userId', description: '사용자 ID', example: 1 })
  async deleteToss(@Param('userId') userId: number) {
    await this.paymentService.deleteToss(userId);
    return {
      success: true,
      message: '토스 송금이 성공적으로 삭제되었습니다.',
    };
  }
}
