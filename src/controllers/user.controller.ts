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
import { UserService } from '../services/user.service';
import {
  CreateUserDto,
  UpdateUserDto,
  VerifyPasswordDto,
} from '../dto/user.dto';
import {
  UserResponseDto,
  PasswordVerificationResponseDto,
  ErrorResponseDto,
} from '../dto/response.dto';

@ApiTags('users')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: '사용자 생성',
    description: '새로운 사용자를 생성합니다. user_id는 자동으로 생성됩니다.',
  })
  @ApiResponse({
    status: 201,
    description: '사용자가 성공적으로 생성되었습니다.',
    type: UserResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: '잘못된 요청 데이터입니다.',
    type: ErrorResponseDto,
  })
  async createUser(@Body() createUserDto: CreateUserDto) {
    const user = await this.userService.createUser(createUserDto);
    // 비밀번호 제외하고 반환
    const { password, ...userWithoutPassword } = user;
    return {
      success: true,
      data: userWithoutPassword,
      message: '사용자가 성공적으로 생성되었습니다.',
    };
  }

  @Get()
  @ApiOperation({
    summary: '모든 사용자 조회',
    description: '등록된 모든 사용자 목록을 조회합니다.',
  })
  @ApiResponse({
    status: 200,
    description: '사용자 목록 조회 성공',
  })
  async getAllUsers() {
    const users = await this.userService.findAllUsers();
    // 비밀번호 제외하고 반환
    const usersWithoutPassword = users.map(({ password, ...user }) => user);
    return {
      success: true,
      data: usersWithoutPassword,
    };
  }

  @Get(':userId')
  @ApiOperation({
    summary: '사용자 조회',
    description: '사용자 ID로 사용자 정보를 조회합니다.',
  })
  @ApiParam({ name: 'userId', description: '사용자 ID (숫자)', example: 1 })
  @ApiResponse({
    status: 200,
    description: '사용자 정보 조회 성공',
    type: UserResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: '사용자를 찾을 수 없습니다.',
    type: ErrorResponseDto,
  })
  async getUser(@Param('userId', ParseIntPipe) userId: number) {
    const user = await this.userService.findByUserId(userId);
    // 비밀번호 제외하고 반환
    const { password, ...userWithoutPassword } = user;
    return {
      success: true,
      data: userWithoutPassword,
    };
  }

  @Put(':userId')
  @ApiOperation({
    summary: '사용자 정보 수정',
    description: '사용자 정보를 수정합니다.',
  })
  @ApiParam({ name: 'userId', description: '사용자 ID (숫자)', example: 1 })
  @ApiResponse({
    status: 200,
    description: '사용자 정보가 성공적으로 수정되었습니다.',
    type: UserResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: '사용자를 찾을 수 없습니다.',
    type: ErrorResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: '잘못된 요청 데이터입니다.',
    type: ErrorResponseDto,
  })
  async updateUser(
    @Param('userId', ParseIntPipe) userId: number,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    const user = await this.userService.updateUser(userId, updateUserDto);
    // 비밀번호 제외하고 반환
    const { password, ...userWithoutPassword } = user;
    return {
      success: true,
      data: userWithoutPassword,
      message: '사용자 정보가 성공적으로 업데이트되었습니다.',
    };
  }

  @Delete(':userId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: '사용자 삭제', description: '사용자를 삭제합니다.' })
  @ApiParam({ name: 'userId', description: '사용자 ID (숫자)', example: 1 })
  @ApiResponse({
    status: 204,
    description: '사용자가 성공적으로 삭제되었습니다.',
  })
  @ApiResponse({
    status: 404,
    description: '사용자를 찾을 수 없습니다.',
    type: ErrorResponseDto,
  })
  async deleteUser(@Param('userId', ParseIntPipe) userId: number) {
    await this.userService.deleteUser(userId);
    return {
      success: true,
      message: '사용자가 성공적으로 삭제되었습니다.',
    };
  }

  @Post(':userId/verify-password')
  @ApiOperation({
    summary: '비밀번호 확인',
    description: '사용자의 비밀번호를 확인합니다.',
  })
  @ApiParam({ name: 'userId', description: '사용자 ID (숫자)', example: 1 })
  @ApiResponse({
    status: 200,
    description: '비밀번호 확인 완료',
    type: PasswordVerificationResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: '사용자를 찾을 수 없습니다.',
    type: ErrorResponseDto,
  })
  async verifyPassword(
    @Param('userId', ParseIntPipe) userId: number,
    @Body() verifyPasswordDto: VerifyPasswordDto,
  ) {
    const isValid = await this.userService.verifyPassword(
      userId,
      verifyPasswordDto.password,
    );
    return {
      success: true,
      data: { isValid },
      message: isValid
        ? '비밀번호가 일치합니다.'
        : '비밀번호가 일치하지 않습니다.',
    };
  }

  @Get('company/:companyId')
  @ApiOperation({
    summary: '회사별 사용자 조회',
    description: '특정 회사에 속한 사용자들을 조회합니다.',
  })
  @ApiParam({ name: 'companyId', description: '회사 ID', example: 'COMP0001' })
  @ApiResponse({
    status: 200,
    description: '회사별 사용자 목록 조회 성공',
  })
  async getUsersByCompany(@Param('companyId') companyId: string) {
    const users = await this.userService.findUsersByCompany(companyId);
    // 비밀번호 제외하고 반환
    const usersWithoutPassword = users.map(({ password, ...user }) => user);
    return {
      success: true,
      data: usersWithoutPassword,
    };
  }
}
