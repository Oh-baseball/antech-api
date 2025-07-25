// 간편 결제 시스템 - 사용자 컨트롤러

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
  CreateUserDto,
  UpdateUserDto,
  LoginDto,
  CreateAuthSettingsDto,
  UpdateAuthSettingsDto,
  AuthenticateDto,
  AuthResultDto,
  WalletInfoDto,
} from '../dto/user.dto';
import { ResponseDto } from '../dto/response.dto';

@ApiTags('👤 users')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  /* -------------------------------------------------------------
     사용자 기본 관리
  ------------------------------------------------------------- */

  @Post()
  @ApiOperation({
    summary: '회원가입',
    description: '새로운 사용자를 생성합니다.',
  })
  @ApiResponse({
    status: 201,
    description: '사용자 생성 성공',
    type: ResponseDto,
  })
  async createUser(@Body() createUserDto: CreateUserDto): Promise<ResponseDto> {
    const user = await this.userService.createUser(createUserDto);
    const { password_hash, ...userWithoutPassword } = user;

    return {
      success: true,
      data: userWithoutPassword,
      message: '회원가입이 성공적으로 완료되었습니다.',
    };
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: '로그인',
    description: '이메일과 비밀번호로 로그인합니다.',
  })
  @ApiResponse({
    status: 200,
    description: '로그인 성공',
    type: ResponseDto,
  })
  async login(@Body() loginDto: LoginDto): Promise<ResponseDto> {
    const user = await this.userService.login(
      loginDto.email,
      loginDto.password,
    );
    const { password_hash, ...userWithoutPassword } = user;

    return {
      success: true,
      data: userWithoutPassword,
      message: '로그인이 성공적으로 완료되었습니다.',
    };
  }

  @Get()
  @ApiOperation({
    summary: '사용자 목록 조회',
    description: '모든 사용자 목록을 조회합니다.',
  })
  @ApiResponse({
    status: 200,
    description: '사용자 목록 조회 성공',
    type: ResponseDto,
  })
  async findAllUsers(): Promise<ResponseDto> {
    const users = await this.userService.findAllUsers();
    const usersWithoutPassword = users.map(
      ({ password_hash, ...user }) => user,
    );

    return {
      success: true,
      data: usersWithoutPassword,
      message: '사용자 목록을 성공적으로 조회했습니다.',
    };
  }

  @Get(':id')
  @ApiOperation({
    summary: '사용자 정보 조회',
    description: '특정 사용자의 정보를 조회합니다.',
  })
  @ApiParam({ name: 'id', description: '사용자 ID' })
  @ApiResponse({
    status: 200,
    description: '사용자 정보 조회 성공',
    type: ResponseDto,
  })
  async findUserById(
    @Param('id', ParseIntPipe) userId: number,
  ): Promise<ResponseDto> {
    const user = await this.userService.findUserById(userId);
    const { password_hash, ...userWithoutPassword } = user;

    return {
      success: true,
      data: userWithoutPassword,
      message: '사용자 정보를 성공적으로 조회했습니다.',
    };
  }

  @Put(':id')
  @ApiOperation({
    summary: '사용자 정보 수정',
    description: '사용자 정보를 수정합니다.',
  })
  @ApiParam({ name: 'id', description: '사용자 ID' })
  @ApiResponse({
    status: 200,
    description: '사용자 정보 수정 성공',
    type: ResponseDto,
  })
  async updateUser(
    @Param('id', ParseIntPipe) userId: number,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<ResponseDto> {
    const user = await this.userService.updateUser(userId, updateUserDto);
    const { password_hash, ...userWithoutPassword } = user;

    return {
      success: true,
      data: userWithoutPassword,
      message: '사용자 정보가 성공적으로 수정되었습니다.',
    };
  }

  @Delete(':id')
  @ApiOperation({ summary: '사용자 삭제', description: '사용자를 삭제합니다.' })
  @ApiParam({ name: 'id', description: '사용자 ID' })
  @ApiResponse({
    status: 200,
    description: '사용자 삭제 성공',
    type: ResponseDto,
  })
  async deleteUser(
    @Param('id', ParseIntPipe) userId: number,
  ): Promise<ResponseDto> {
    await this.userService.deleteUser(userId);

    return {
      success: true,
      data: null,
      message: '사용자가 성공적으로 삭제되었습니다.',
    };
  }

  /* -------------------------------------------------------------
     지갑 관리
  ------------------------------------------------------------- */

  @Get(':id/wallet')
  @ApiOperation({
    summary: '지갑 정보 조회',
    description: '사용자의 지갑 정보를 조회합니다.',
  })
  @ApiParam({ name: 'id', description: '사용자 ID' })
  @ApiResponse({
    status: 200,
    description: '지갑 정보 조회 성공',
    type: ResponseDto,
  })
  async getUserWallet(
    @Param('id', ParseIntPipe) userId: number,
  ): Promise<ResponseDto> {
    const wallet = await this.userService.getUserWallet(userId);

    return {
      success: true,
      data: wallet,
      message: '지갑 정보를 성공적으로 조회했습니다.',
    };
  }

  @Get(':id/balance')
  @ApiOperation({
    summary: '포인트 잔액 조회',
    description: '사용자의 포인트 잔액을 조회합니다.',
  })
  @ApiParam({ name: 'id', description: '사용자 ID' })
  @ApiResponse({
    status: 200,
    description: '포인트 잔액 조회 성공',
    type: ResponseDto,
  })
  async getPointBalance(
    @Param('id', ParseIntPipe) userId: number,
  ): Promise<ResponseDto> {
    const balance = await this.userService.getPointBalance(userId);

    return {
      success: true,
      data: { point_balance: balance },
      message: '포인트 잔액을 성공적으로 조회했습니다.',
    };
  }

  /* -------------------------------------------------------------
     인증 설정 관리
  ------------------------------------------------------------- */

  @Post(':id/auth-settings')
  @ApiOperation({
    summary: '인증 설정 생성',
    description: '사용자의 인증 설정을 생성합니다.',
  })
  @ApiParam({ name: 'id', description: '사용자 ID' })
  @ApiResponse({
    status: 201,
    description: '인증 설정 생성 성공',
    type: ResponseDto,
  })
  async createAuthSettings(
    @Param('id', ParseIntPipe) userId: number,
    @Body() createAuthSettingsDto: CreateAuthSettingsDto,
  ): Promise<ResponseDto> {
    // DTO에 사용자 ID 설정
    createAuthSettingsDto.user_id = userId;

    const authSettings = await this.userService.createAuthSettings(
      createAuthSettingsDto,
    );

    return {
      success: true,
      data: authSettings,
      message: '인증 설정이 성공적으로 생성되었습니다.',
    };
  }

  @Get(':id/auth-settings')
  @ApiOperation({
    summary: '인증 설정 조회',
    description: '사용자의 인증 설정을 조회합니다.',
  })
  @ApiParam({ name: 'id', description: '사용자 ID' })
  @ApiResponse({
    status: 200,
    description: '인증 설정 조회 성공',
    type: ResponseDto,
  })
  async getAuthSettings(
    @Param('id', ParseIntPipe) userId: number,
  ): Promise<ResponseDto> {
    const authSettings = await this.userService.getAuthSettings(userId);

    return {
      success: true,
      data: authSettings,
      message: '인증 설정을 성공적으로 조회했습니다.',
    };
  }

  @Put(':id/auth-settings')
  @ApiOperation({
    summary: '인증 설정 수정',
    description: '사용자의 인증 설정을 수정합니다.',
  })
  @ApiParam({ name: 'id', description: '사용자 ID' })
  @ApiResponse({
    status: 200,
    description: '인증 설정 수정 성공',
    type: ResponseDto,
  })
  async updateAuthSettings(
    @Param('id', ParseIntPipe) userId: number,
    @Body() updateAuthSettingsDto: UpdateAuthSettingsDto,
  ): Promise<ResponseDto> {
    const authSettings = await this.userService.updateAuthSettings(
      userId,
      updateAuthSettingsDto,
    );

    return {
      success: true,
      data: authSettings,
      message: '인증 설정이 성공적으로 수정되었습니다.',
    };
  }

  /* -------------------------------------------------------------
     인증 처리
  ------------------------------------------------------------- */

  @Post('authenticate')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: '사용자 인증',
    description: 'PIN, 패턴, 생체인증으로 사용자를 인증합니다.',
  })
  @ApiResponse({
    status: 200,
    description: '인증 처리 완료',
    type: ResponseDto,
  })
  async authenticate(
    @Body() authenticateDto: AuthenticateDto,
  ): Promise<ResponseDto> {
    const result = await this.userService.authenticate(authenticateDto);

    return {
      success: result.is_success,
      data: result,
      message: result.is_success
        ? '인증이 성공했습니다.'
        : '인증에 실패했습니다.',
    };
  }

  @Post(':id/verify-password')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: '비밀번호 확인',
    description: '사용자의 비밀번호를 확인합니다.',
  })
  @ApiParam({ name: 'id', description: '사용자 ID' })
  @ApiResponse({
    status: 200,
    description: '비밀번호 확인 완료',
    type: ResponseDto,
  })
  async verifyPassword(
    @Param('id', ParseIntPipe) userId: number,
    @Body() body: { password: string },
  ): Promise<ResponseDto> {
    const isValid = await this.userService.verifyPassword(
      userId,
      body.password,
    );

    return {
      success: true,
      data: { is_valid: isValid },
      message: isValid
        ? '비밀번호가 일치합니다.'
        : '비밀번호가 일치하지 않습니다.',
    };
  }
}
