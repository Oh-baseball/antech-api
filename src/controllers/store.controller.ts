// 간편 결제 시스템 - 매장 컨트롤러

import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
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
  UpdateCategoryDto,
  CreateMenuDto,
  UpdateMenuDto,
} from '../dto/store.dto';
import { ResponseDto } from '../dto/response.dto';

@ApiTags('stores')
@Controller('stores')
export class StoreController {
  constructor(private readonly storeService: StoreService) {}

  /* -------------------------------------------------------------
     매장 관리
  ------------------------------------------------------------- */

  @Post()
  @ApiOperation({
    summary: '매장 생성',
    description: '새로운 매장을 생성합니다.',
  })
  @ApiResponse({
    status: 201,
    description: '매장 생성 성공',
    type: ResponseDto,
  })
  async createStore(
    @Body() createStoreDto: CreateStoreDto,
  ): Promise<ResponseDto> {
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
  @ApiQuery({ name: 'search', required: false, description: '매장명 검색' })
  @ApiResponse({
    status: 200,
    description: '매장 목록 조회 성공',
    type: ResponseDto,
  })
  async findAllStores(@Query('search') search?: string): Promise<ResponseDto> {
    let stores;

    if (search) {
      stores = await this.storeService.searchStoresByName(search);
    } else {
      stores = await this.storeService.findAllStores();
    }

    return {
      success: true,
      data: stores,
      message: '매장 목록을 성공적으로 조회했습니다.',
    };
  }

  @Get(':id')
  @ApiOperation({
    summary: '매장 정보 조회',
    description: '특정 매장의 정보를 조회합니다.',
  })
  @ApiParam({ name: 'id', description: '매장 ID' })
  @ApiResponse({
    status: 200,
    description: '매장 정보 조회 성공',
    type: ResponseDto,
  })
  async findStoreById(
    @Param('id', ParseIntPipe) storeId: number,
  ): Promise<ResponseDto> {
    const store = await this.storeService.findStoreById(storeId);

    return {
      success: true,
      data: store,
      message: '매장 정보를 성공적으로 조회했습니다.',
    };
  }

  @Put(':id')
  @ApiOperation({
    summary: '매장 정보 수정',
    description: '매장 정보를 수정합니다.',
  })
  @ApiParam({ name: 'id', description: '매장 ID' })
  @ApiResponse({
    status: 200,
    description: '매장 정보 수정 성공',
    type: ResponseDto,
  })
  async updateStore(
    @Param('id', ParseIntPipe) storeId: number,
    @Body() updateStoreDto: UpdateStoreDto,
  ): Promise<ResponseDto> {
    const store = await this.storeService.updateStore(storeId, updateStoreDto);

    return {
      success: true,
      data: store,
      message: '매장 정보가 성공적으로 수정되었습니다.',
    };
  }

  @Delete(':id')
  @ApiOperation({ summary: '매장 삭제', description: '매장을 삭제합니다.' })
  @ApiParam({ name: 'id', description: '매장 ID' })
  @ApiResponse({
    status: 200,
    description: '매장 삭제 성공',
    type: ResponseDto,
  })
  async deleteStore(
    @Param('id', ParseIntPipe) storeId: number,
  ): Promise<ResponseDto> {
    await this.storeService.deleteStore(storeId);

    return {
      success: true,
      data: null,
      message: '매장이 성공적으로 삭제되었습니다.',
    };
  }

  /* -------------------------------------------------------------
     매장 메뉴 관리
  ------------------------------------------------------------- */

  @Get(':id/menus')
  @ApiOperation({
    summary: '매장별 메뉴 조회',
    description: '특정 매장의 모든 메뉴를 조회합니다.',
  })
  @ApiParam({ name: 'id', description: '매장 ID' })
  @ApiResponse({
    status: 200,
    description: '매장 메뉴 조회 성공',
    type: ResponseDto,
  })
  async findMenusByStore(
    @Param('id', ParseIntPipe) storeId: number,
  ): Promise<ResponseDto> {
    const menus = await this.storeService.findMenusByStore(storeId);

    return {
      success: true,
      data: menus,
      message: '매장 메뉴를 성공적으로 조회했습니다.',
    };
  }

  /* -------------------------------------------------------------
     카테고리 관리
  ------------------------------------------------------------- */

  @Post('categories')
  @ApiOperation({
    summary: '카테고리 생성',
    description: '새로운 카테고리를 생성합니다.',
  })
  @ApiResponse({
    status: 201,
    description: '카테고리 생성 성공',
    type: ResponseDto,
  })
  async createCategory(
    @Body() createCategoryDto: CreateCategoryDto,
  ): Promise<ResponseDto> {
    const category = await this.storeService.createCategory(createCategoryDto);

    return {
      success: true,
      data: category,
      message: '카테고리가 성공적으로 생성되었습니다.',
    };
  }

  @Get('categories')
  @ApiOperation({
    summary: '카테고리 목록 조회',
    description: '모든 카테고리 목록을 조회합니다.',
  })
  @ApiResponse({
    status: 200,
    description: '카테고리 목록 조회 성공',
    type: ResponseDto,
  })
  async findAllCategories(): Promise<ResponseDto> {
    const categories = await this.storeService.findAllCategories();

    return {
      success: true,
      data: categories,
      message: '카테고리 목록을 성공적으로 조회했습니다.',
    };
  }

  @Get('categories/:id')
  @ApiOperation({
    summary: '카테고리 정보 조회',
    description: '특정 카테고리의 정보를 조회합니다.',
  })
  @ApiParam({ name: 'id', description: '카테고리 ID' })
  @ApiResponse({
    status: 200,
    description: '카테고리 정보 조회 성공',
    type: ResponseDto,
  })
  async findCategoryById(
    @Param('id', ParseIntPipe) categoryId: number,
  ): Promise<ResponseDto> {
    const category = await this.storeService.findCategoryById(categoryId);

    return {
      success: true,
      data: category,
      message: '카테고리 정보를 성공적으로 조회했습니다.',
    };
  }

  @Put('categories/:id')
  @ApiOperation({
    summary: '카테고리 정보 수정',
    description: '카테고리 정보를 수정합니다.',
  })
  @ApiParam({ name: 'id', description: '카테고리 ID' })
  @ApiResponse({
    status: 200,
    description: '카테고리 정보 수정 성공',
    type: ResponseDto,
  })
  async updateCategory(
    @Param('id', ParseIntPipe) categoryId: number,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ): Promise<ResponseDto> {
    const category = await this.storeService.updateCategory(
      categoryId,
      updateCategoryDto,
    );

    return {
      success: true,
      data: category,
      message: '카테고리 정보가 성공적으로 수정되었습니다.',
    };
  }

  @Delete('categories/:id')
  @ApiOperation({
    summary: '카테고리 삭제',
    description: '카테고리를 삭제합니다.',
  })
  @ApiParam({ name: 'id', description: '카테고리 ID' })
  @ApiResponse({
    status: 200,
    description: '카테고리 삭제 성공',
    type: ResponseDto,
  })
  async deleteCategory(
    @Param('id', ParseIntPipe) categoryId: number,
  ): Promise<ResponseDto> {
    await this.storeService.deleteCategory(categoryId);

    return {
      success: true,
      data: null,
      message: '카테고리가 성공적으로 삭제되었습니다.',
    };
  }

  @Get('categories/:id/menus')
  @ApiOperation({
    summary: '카테고리별 메뉴 조회',
    description: '특정 카테고리의 모든 메뉴를 조회합니다.',
  })
  @ApiParam({ name: 'id', description: '카테고리 ID' })
  @ApiResponse({
    status: 200,
    description: '카테고리별 메뉴 조회 성공',
    type: ResponseDto,
  })
  async findMenusByCategory(
    @Param('id', ParseIntPipe) categoryId: number,
  ): Promise<ResponseDto> {
    const menus = await this.storeService.findMenusByCategory(categoryId);

    return {
      success: true,
      data: menus,
      message: '카테고리별 메뉴를 성공적으로 조회했습니다.',
    };
  }

  /* -------------------------------------------------------------
     메뉴 관리
  ------------------------------------------------------------- */

  @Post('menus')
  @ApiOperation({
    summary: '메뉴 생성',
    description: '새로운 메뉴를 생성합니다.',
  })
  @ApiResponse({
    status: 201,
    description: '메뉴 생성 성공',
    type: ResponseDto,
  })
  async createMenu(@Body() createMenuDto: CreateMenuDto): Promise<ResponseDto> {
    const menu = await this.storeService.createMenu(createMenuDto);

    return {
      success: true,
      data: menu,
      message: '메뉴가 성공적으로 생성되었습니다.',
    };
  }

  @Get('menus')
  @ApiOperation({
    summary: '메뉴 목록 조회',
    description: '모든 메뉴 목록을 조회합니다.',
  })
  @ApiQuery({ name: 'search', required: false, description: '메뉴명 검색' })
  @ApiQuery({ name: 'min_price', required: false, description: '최소 가격' })
  @ApiQuery({ name: 'max_price', required: false, description: '최대 가격' })
  @ApiResponse({
    status: 200,
    description: '메뉴 목록 조회 성공',
    type: ResponseDto,
  })
  async findAllMenus(
    @Query('search') search?: string,
    @Query('min_price') minPrice?: string,
    @Query('max_price') maxPrice?: string,
  ): Promise<ResponseDto> {
    let menus;

    if (search) {
      menus = await this.storeService.searchMenusByName(search);
    } else if (minPrice && maxPrice) {
      menus = await this.storeService.findMenusByPriceRange(
        parseInt(minPrice),
        parseInt(maxPrice),
      );
    } else {
      menus = await this.storeService.findAllMenus();
    }

    return {
      success: true,
      data: menus,
      message: '메뉴 목록을 성공적으로 조회했습니다.',
    };
  }

  @Get('menus/:id')
  @ApiOperation({
    summary: '메뉴 정보 조회',
    description: '특정 메뉴의 정보를 조회합니다.',
  })
  @ApiParam({ name: 'id', description: '메뉴 ID' })
  @ApiResponse({
    status: 200,
    description: '메뉴 정보 조회 성공',
    type: ResponseDto,
  })
  async findMenuById(
    @Param('id', ParseIntPipe) menuId: number,
  ): Promise<ResponseDto> {
    const menu = await this.storeService.findMenuById(menuId);

    return {
      success: true,
      data: menu,
      message: '메뉴 정보를 성공적으로 조회했습니다.',
    };
  }

  @Put('menus/:id')
  @ApiOperation({
    summary: '메뉴 정보 수정',
    description: '메뉴 정보를 수정합니다.',
  })
  @ApiParam({ name: 'id', description: '메뉴 ID' })
  @ApiResponse({
    status: 200,
    description: '메뉴 정보 수정 성공',
    type: ResponseDto,
  })
  async updateMenu(
    @Param('id', ParseIntPipe) menuId: number,
    @Body() updateMenuDto: UpdateMenuDto,
  ): Promise<ResponseDto> {
    const menu = await this.storeService.updateMenu(menuId, updateMenuDto);

    return {
      success: true,
      data: menu,
      message: '메뉴 정보가 성공적으로 수정되었습니다.',
    };
  }

  @Delete('menus/:id')
  @ApiOperation({ summary: '메뉴 삭제', description: '메뉴를 삭제합니다.' })
  @ApiParam({ name: 'id', description: '메뉴 ID' })
  @ApiResponse({
    status: 200,
    description: '메뉴 삭제 성공',
    type: ResponseDto,
  })
  async deleteMenu(
    @Param('id', ParseIntPipe) menuId: number,
  ): Promise<ResponseDto> {
    await this.storeService.deleteMenu(menuId);

    return {
      success: true,
      data: null,
      message: '메뉴가 성공적으로 삭제되었습니다.',
    };
  }
}
