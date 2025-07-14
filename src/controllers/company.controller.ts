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
import { CompanyService } from '../services/company.service';
import { CreateCompanyDto, UpdateCompanyDto } from '../dto/company.dto';
import { ErrorResponseDto } from '../dto/response.dto';

@ApiTags('companies')
@Controller('companies')
export class CompanyController {
  constructor(private readonly companyService: CompanyService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: '회사 생성',
    description: '새로운 회사를 생성합니다.',
  })
  @ApiResponse({
    status: 201,
    description: '회사가 성공적으로 생성되었습니다.',
  })
  @ApiResponse({
    status: 409,
    description: '이미 존재하는 회사 ID입니다.',
    type: ErrorResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: '잘못된 요청 데이터입니다.',
    type: ErrorResponseDto,
  })
  async createCompany(@Body() createCompanyDto: CreateCompanyDto) {
    const company = await this.companyService.createCompany(createCompanyDto);
    return {
      success: true,
      data: company,
      message: '회사가 성공적으로 생성되었습니다.',
    };
  }

  @Get()
  @ApiOperation({
    summary: '모든 회사 조회',
    description: '등록된 모든 회사 목록을 조회합니다.',
  })
  @ApiResponse({
    status: 200,
    description: '회사 목록 조회 성공',
  })
  async getAllCompanies() {
    const companies = await this.companyService.findAllCompanies();
    return {
      success: true,
      data: companies,
    };
  }

  @Get(':companyId')
  @ApiOperation({
    summary: '회사 조회',
    description: '회사 ID로 회사 정보를 조회합니다.',
  })
  @ApiParam({ name: 'companyId', description: '회사 ID', example: 'COMP0001' })
  @ApiResponse({
    status: 200,
    description: '회사 정보 조회 성공',
  })
  @ApiResponse({
    status: 404,
    description: '회사를 찾을 수 없습니다.',
    type: ErrorResponseDto,
  })
  async getCompany(@Param('companyId') companyId: string) {
    const company = await this.companyService.findCompanyById(companyId);
    return {
      success: true,
      data: company,
    };
  }

  @Put(':companyId')
  @ApiOperation({
    summary: '회사 정보 수정',
    description: '회사 정보를 수정합니다.',
  })
  @ApiParam({ name: 'companyId', description: '회사 ID', example: 'COMP0001' })
  @ApiResponse({
    status: 200,
    description: '회사 정보가 성공적으로 수정되었습니다.',
  })
  @ApiResponse({
    status: 404,
    description: '회사를 찾을 수 없습니다.',
    type: ErrorResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: '잘못된 요청 데이터입니다.',
    type: ErrorResponseDto,
  })
  async updateCompany(
    @Param('companyId') companyId: string,
    @Body() updateCompanyDto: UpdateCompanyDto,
  ) {
    const company = await this.companyService.updateCompany(
      companyId,
      updateCompanyDto,
    );
    return {
      success: true,
      data: company,
      message: '회사 정보가 성공적으로 업데이트되었습니다.',
    };
  }

  @Delete(':companyId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: '회사 삭제',
    description: '회사를 삭제합니다.',
  })
  @ApiParam({ name: 'companyId', description: '회사 ID', example: 'COMP0001' })
  @ApiResponse({
    status: 204,
    description: '회사가 성공적으로 삭제되었습니다.',
  })
  @ApiResponse({
    status: 404,
    description: '회사를 찾을 수 없습니다.',
    type: ErrorResponseDto,
  })
  async deleteCompany(@Param('companyId') companyId: string) {
    await this.companyService.deleteCompany(companyId);
    return {
      success: true,
      message: '회사가 성공적으로 삭제되었습니다.',
    };
  }

  @Put(':companyId/points/add')
  @ApiOperation({
    summary: '회사 포인트 추가',
    description: '회사의 포인트를 추가합니다.',
  })
  @ApiParam({ name: 'companyId', description: '회사 ID', example: 'COMP0001' })
  @ApiResponse({
    status: 200,
    description: '포인트가 성공적으로 추가되었습니다.',
  })
  async addPoints(
    @Param('companyId') companyId: string,
    @Body() body: { amount: number },
  ) {
    const company = await this.companyService.addPoints(companyId, body.amount);
    return {
      success: true,
      data: company,
      message: `${body.amount} 포인트가 추가되었습니다.`,
    };
  }

  @Put(':companyId/points/deduct')
  @ApiOperation({
    summary: '회사 포인트 차감',
    description: '회사의 포인트를 차감합니다.',
  })
  @ApiParam({ name: 'companyId', description: '회사 ID', example: 'COMP0001' })
  @ApiResponse({
    status: 200,
    description: '포인트가 성공적으로 차감되었습니다.',
  })
  async deductPoints(
    @Param('companyId') companyId: string,
    @Body() body: { amount: number },
  ) {
    const company = await this.companyService.deductPoints(
      companyId,
      body.amount,
    );
    return {
      success: true,
      data: company,
      message: `${body.amount} 포인트가 차감되었습니다.`,
    };
  }

  @Get(':companyId/stats')
  @ApiOperation({
    summary: '회사 통계 조회',
    description: '회사의 사용자 수, 토스 내역 등 통계를 조회합니다.',
  })
  @ApiParam({ name: 'companyId', description: '회사 ID', example: 'COMP0001' })
  @ApiResponse({
    status: 200,
    description: '회사 통계 조회 성공',
  })
  async getCompanyStats(@Param('companyId') companyId: string) {
    const stats = await this.companyService.getCompanyStats(companyId);
    return {
      success: true,
      data: stats,
    };
  }
}
