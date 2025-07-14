import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  HttpCode,
  HttpStatus,
  ParseIntPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { StoreService } from '../services/store.service';
import {
  CreateStoreDto,
  UpdateStoreDto,
  CreateCategoryDto,
} from '../dto/store.dto';
import {
  StoreResponseDto,
  StoresResponseDto,
  CategoriesResponseDto,
  CategoryResponseDto,
  ErrorResponseDto,
} from '../dto/response.dto';

@ApiTags('stores')
@Controller('stores')
export class StoreController {
  constructor(private readonly storeService: StoreService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: '매장 생성',
    description: '새로운 매장을 생성합니다.',
  })
  @ApiResponse({
    status: 201,
    description: '매장이 성공적으로 생성되었습니다.',
    type: StoreResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: '잘못된 요청 데이터입니다.',
    type: ErrorResponseDto,
  })
  async createStore(@Body() createStoreDto: CreateStoreDto) {
    const store = await this.storeService.createStore(createStoreDto);
    return {
      success: true,
      data: store,
      message: '매장이 성공적으로 생성되었습니다.',
    };
  }

  @Get()
  @ApiOperation({
    summary: '매장 목록 조회',
    description: '모든 매장 목록을 조회합니다.',
  })
  @ApiResponse({
    status: 200,
    description: '매장 목록 조회 성공',
    type: StoresResponseDto,
  })
  async getAllStores() {
    const stores = await this.storeService.findAllStores();
    return {
      success: true,
      data: stores,
    };
  }

  @Get('search')
  @ApiOperation({
    summary: '매장 검색',
    description: '키워드로 매장을 검색합니다.',
  })
  @ApiQuery({
    name: 'keyword',
    description: '검색 키워드',
    example: '스타벅스',
  })
  @ApiResponse({
    status: 200,
    description: '매장 검색 성공',
    type: StoresResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: '검색 키워드를 입력해주세요.',
    type: ErrorResponseDto,
  })
  async searchStores(@Query('keyword') keyword: string) {
    if (!keyword) {
      return {
        success: false,
        message: '검색 키워드를 입력해주세요.',
      };
    }

    const stores = await this.storeService.searchStores(keyword);
    return {
      success: true,
      data: stores,
      message: `'${keyword}'에 대한 검색 결과입니다.`,
    };
  }

  @Get(':storeId')
  @ApiOperation({
    summary: '매장 상세 조회',
    description: '매장 ID로 상세 정보를 조회합니다.',
  })
  @ApiParam({ name: 'storeId', description: '매장 ID (숫자)', example: 1 })
  @ApiResponse({ status: 200, description: '매장 상세 정보 조회 성공' })
  @ApiResponse({ status: 404, description: '매장을 찾을 수 없습니다.' })
  async getStore(@Param('storeId', ParseIntPipe) storeId: number) {
    const store = await this.storeService.findStoreById(storeId);
    return {
      success: true,
      data: store,
    };
  }

  @Put(':storeId')
  @ApiOperation({
    summary: '매장 정보 수정',
    description: '매장 정보를 수정합니다.',
  })
  @ApiParam({ name: 'storeId', description: '매장 ID (숫자)', example: 1 })
  @ApiResponse({
    status: 200,
    description: '매장 정보가 성공적으로 수정되었습니다.',
  })
  @ApiResponse({ status: 404, description: '매장을 찾을 수 없습니다.' })
  @ApiResponse({ status: 400, description: '잘못된 요청 데이터입니다.' })
  async updateStore(
    @Param('storeId', ParseIntPipe) storeId: number,
    @Body() updateStoreDto: UpdateStoreDto,
  ) {
    const store = await this.storeService.updateStore(storeId, updateStoreDto);
    return {
      success: true,
      data: store,
      message: '매장 정보가 성공적으로 업데이트되었습니다.',
    };
  }

  @Delete(':storeId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: '매장 삭제', description: '매장을 삭제합니다.' })
  @ApiParam({ name: 'storeId', description: '매장 ID (숫자)', example: 1 })
  @ApiResponse({
    status: 204,
    description: '매장이 성공적으로 삭제되었습니다.',
  })
  @ApiResponse({ status: 404, description: '매장을 찾을 수 없습니다.' })
  async deleteStore(@Param('storeId', ParseIntPipe) storeId: number) {
    await this.storeService.deleteStore(storeId);
    return {
      success: true,
      message: '매장이 성공적으로 삭제되었습니다.',
    };
  }

  @Get(':storeId/menus')
  @ApiOperation({
    summary: '매장 메뉴 조회',
    description: '매장의 모든 메뉴를 조회합니다.',
  })
  @ApiParam({ name: 'storeId', description: '매장 ID (숫자)', example: 1 })
  @ApiResponse({ status: 200, description: '매장 메뉴 조회 성공' })
  async getStoreMenus(@Param('storeId', ParseIntPipe) storeId: number) {
    const menus = await this.storeService.getStoreMenus(storeId);
    return {
      success: true,
      data: menus,
    };
  }

  @Get(':storeId/menus/category/:categoryId')
  @ApiOperation({
    summary: '카테고리별 메뉴 조회',
    description: '특정 카테고리의 메뉴를 조회합니다.',
  })
  @ApiParam({ name: 'storeId', description: '매장 ID (숫자)', example: 1 })
  @ApiParam({
    name: 'categoryId',
    description: '카테고리 ID',
    example: 'CAT0001',
  })
  @ApiResponse({ status: 200, description: '카테고리별 메뉴 조회 성공' })
  async getMenusByCategory(
    @Param('storeId', ParseIntPipe) storeId: number,
    @Param('categoryId') categoryId: string,
  ) {
    const menus = await this.storeService.getMenusByCategory(
      storeId,
      categoryId,
    );
    return {
      success: true,
      data: menus,
    };
  }

  @Get(':storeId/stats')
  @ApiOperation({
    summary: '매장 통계 조회',
    description: '매장의 메뉴 수, 결제 내역 수 등 통계를 조회합니다.',
  })
  @ApiParam({ name: 'storeId', description: '매장 ID (숫자)', example: 1 })
  @ApiResponse({ status: 200, description: '매장 통계 조회 성공' })
  async getStoreStats(@Param('storeId', ParseIntPipe) storeId: number) {
    const stats = await this.storeService.getStoreStats(storeId);
    return {
      success: true,
      data: stats,
    };
  }
}

@ApiTags('categories')
@Controller('categories')
export class CategoryController {
  constructor(private readonly storeService: StoreService) {}

  @Get()
  @ApiOperation({
    summary: '카테고리 목록 조회',
    description: '모든 카테고리 목록을 조회합니다.',
  })
  @ApiResponse({ status: 200, description: '카테고리 목록 조회 성공' })
  async getAllCategories() {
    const categories = await this.storeService.getAllCategories();
    return {
      success: true,
      data: categories,
    };
  }

  @Get(':categoryId')
  @ApiOperation({
    summary: '카테고리 조회',
    description: '카테고리 ID로 카테고리 정보를 조회합니다.',
  })
  @ApiParam({
    name: 'categoryId',
    description: '카테고리 ID',
    example: 'CAT0001',
  })
  @ApiResponse({ status: 200, description: '카테고리 조회 성공' })
  @ApiResponse({ status: 404, description: '카테고리를 찾을 수 없습니다.' })
  async getCategory(@Param('categoryId') categoryId: string) {
    const category = await this.storeService.getCategoryById(categoryId);
    return {
      success: true,
      data: category,
    };
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: '카테고리 생성',
    description: '새로운 카테고리를 생성합니다.',
  })
  @ApiResponse({
    status: 201,
    description: '카테고리가 성공적으로 생성되었습니다.',
  })
  @ApiResponse({ status: 400, description: '카테고리 정보를 입력해주세요.' })
  async createCategory(@Body() createCategoryDto: CreateCategoryDto) {
    const category = await this.storeService.createCategory(
      createCategoryDto.category_id,
      createCategoryDto.name,
    );
    return {
      success: true,
      data: category,
      message: '카테고리가 성공적으로 생성되었습니다.',
    };
  }
}
