// 간편 결제 시스템 - 매장, 카테고리, 메뉴 서비스

import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import {
  Store,
  Category,
  Menu,
  CreateStoreDto,
  UpdateStoreDto,
  CreateCategoryDto,
  UpdateCategoryDto,
  CreateMenuDto,
  UpdateMenuDto,
} from '../entities/store.entity';

@Injectable()
export class StoreService {
  private supabase: SupabaseClient;

  constructor() {
    this.supabase = createClient(
      process.env.SUPABASE_URL || '',
      process.env.SUPABASE_ANON_KEY || '',
    );
  }

  /* -------------------------------------------------------------
     매장 관리
  ------------------------------------------------------------- */

  // 매장 생성
  async createStore(createStoreDto: CreateStoreDto): Promise<Store> {
    const { data: store, error } = await this.supabase
      .from('store')
      .insert(createStoreDto)
      .select()
      .single();

    if (error) {
      throw new Error(`매장 생성 실패: ${error.message}`);
    }

    return store;
  }

  // 매장 조회 (ID)
  async findStoreById(storeId: number): Promise<Store> {
    const { data: store, error } = await this.supabase
      .from('store')
      .select('*')
      .eq('store_id', storeId)
      .single();

    if (error || !store) {
      throw new NotFoundException('매장을 찾을 수 없습니다.');
    }

    return store;
  }

  // 모든 매장 조회
  async findAllStores(): Promise<Store[]> {
    const { data: stores, error } = await this.supabase
      .from('store')
      .select('*')
      .eq('is_active', true)
      .order('store_id');

    if (error) {
      throw new Error(`매장 목록 조회 실패: ${error.message}`);
    }

    return stores || [];
  }

  // 매장 정보 수정
  async updateStore(
    storeId: number,
    updateStoreDto: UpdateStoreDto,
  ): Promise<Store> {
    const { data: store, error } = await this.supabase
      .from('store')
      .update(updateStoreDto)
      .eq('store_id', storeId)
      .select()
      .single();

    if (error) {
      throw new Error(`매장 정보 수정 실패: ${error.message}`);
    }

    if (!store) {
      throw new NotFoundException('매장을 찾을 수 없습니다.');
    }

    return store;
  }

  // 매장 삭제 (소프트 삭제)
  async deleteStore(storeId: number): Promise<void> {
    const { error } = await this.supabase
      .from('store')
      .update({ is_active: false })
      .eq('store_id', storeId);

    if (error) {
      throw new Error(`매장 삭제 실패: ${error.message}`);
    }
  }

  // 매장 검색 (이름으로)
  async searchStoresByName(storeName: string): Promise<Store[]> {
    const { data: stores, error } = await this.supabase
      .from('store')
      .select('*')
      .ilike('store_name', `%${storeName}%`)
      .eq('is_active', true)
      .order('store_name');

    if (error) {
      throw new Error(`매장 검색 실패: ${error.message}`);
    }

    return stores || [];
  }

  /* -------------------------------------------------------------
     카테고리 관리
  ------------------------------------------------------------- */

  // 카테고리 생성
  async createCategory(
    createCategoryDto: CreateCategoryDto,
  ): Promise<Category> {
    // 카테고리명 중복 확인
    const { data: existingCategory } = await this.supabase
      .from('category')
      .select('category_name')
      .eq('category_name', createCategoryDto.category_name)
      .single();

    if (existingCategory) {
      throw new ConflictException('이미 존재하는 카테고리명입니다.');
    }

    const { data: category, error } = await this.supabase
      .from('category')
      .insert(createCategoryDto)
      .select()
      .single();

    if (error) {
      throw new Error(`카테고리 생성 실패: ${error.message}`);
    }

    return category;
  }

  // 카테고리 조회 (ID)
  async findCategoryById(categoryId: number): Promise<Category> {
    const { data: category, error } = await this.supabase
      .from('category')
      .select('*')
      .eq('category_id', categoryId)
      .single();

    if (error || !category) {
      throw new NotFoundException('카테고리를 찾을 수 없습니다.');
    }

    return category;
  }

  // 모든 카테고리 조회
  async findAllCategories(): Promise<Category[]> {
    console.log('Fetching all categories...');

    const { data: categories, error } = await this.supabase
      .from('category')
      .select('*')
      .eq('is_active', true)
      .order('category_name');

    console.log('Categories query result:', { categories, error });

    if (error) {
      console.error('Category fetch error:', error);
      throw new Error(`카테고리 목록 조회 실패: ${error.message}`);
    }

    return categories || [];
  }

  // 카테고리 정보 수정
  async updateCategory(
    categoryId: number,
    updateCategoryDto: UpdateCategoryDto,
  ): Promise<Category> {
    // 카테고리명 중복 확인 (자신 제외)
    if (updateCategoryDto.category_name) {
      const { data: existingCategory } = await this.supabase
        .from('category')
        .select('category_id')
        .eq('category_name', updateCategoryDto.category_name)
        .neq('category_id', categoryId)
        .single();

      if (existingCategory) {
        throw new ConflictException('이미 존재하는 카테고리명입니다.');
      }
    }

    const { data: category, error } = await this.supabase
      .from('category')
      .update(updateCategoryDto)
      .eq('category_id', categoryId)
      .select()
      .single();

    if (error) {
      throw new Error(`카테고리 정보 수정 실패: ${error.message}`);
    }

    if (!category) {
      throw new NotFoundException('카테고리를 찾을 수 없습니다.');
    }

    return category;
  }

  // 카테고리 삭제 (소프트 삭제)
  async deleteCategory(categoryId: number): Promise<void> {
    const { error } = await this.supabase
      .from('category')
      .update({ is_active: false })
      .eq('category_id', categoryId);

    if (error) {
      throw new Error(`카테고리 삭제 실패: ${error.message}`);
    }
  }

  /* -------------------------------------------------------------
     메뉴 관리
  ------------------------------------------------------------- */

  // 메뉴 생성
  async createMenu(createMenuDto: CreateMenuDto): Promise<Menu> {
    // 매장 존재 확인
    await this.findStoreById(createMenuDto.store_id);

    // 카테고리 존재 확인 (있는 경우)
    if (createMenuDto.category_id) {
      await this.findCategoryById(createMenuDto.category_id);
    }

    const { data: menu, error } = await this.supabase
      .from('menu')
      .insert(createMenuDto)
      .select()
      .single();

    if (error) {
      throw new Error(`메뉴 생성 실패: ${error.message}`);
    }

    return menu;
  }

  // 메뉴 조회 (ID)
  async findMenuById(menuId: number): Promise<Menu> {
    const { data: menu, error } = await this.supabase
      .from('menu')
      .select(
        `
        *,
        store:store_id(store_name),
        category:category_id(category_name)
      `,
      )
      .eq('menu_id', menuId)
      .single();

    if (error || !menu) {
      throw new NotFoundException('메뉴를 찾을 수 없습니다.');
    }

    return menu;
  }

  // 매장별 메뉴 조회
  async findMenusByStore(storeId: number): Promise<Menu[]> {
    // 매장 존재 확인
    await this.findStoreById(storeId);

    const { data: menus, error } = await this.supabase
      .from('menu')
      .select(
        `
        *,
        category:category_id(category_name)
      `,
      )
      .eq('store_id', storeId)
      .eq('is_available', true)
      .order('category_id', { ascending: true })
      .order('menu_name', { ascending: true });

    if (error) {
      throw new Error(`메뉴 목록 조회 실패: ${error.message}`);
    }

    return menus || [];
  }

  // 카테고리별 메뉴 조회
  async findMenusByCategory(categoryId: number): Promise<Menu[]> {
    // 카테고리 존재 확인
    await this.findCategoryById(categoryId);

    const { data: menus, error } = await this.supabase
      .from('menu')
      .select(
        `
        *,
        store:store_id(store_name)
      `,
      )
      .eq('category_id', categoryId)
      .eq('is_available', true)
      .order('menu_name');

    if (error) {
      throw new Error(`카테고리별 메뉴 조회 실패: ${error.message}`);
    }

    return menus || [];
  }

  // 모든 메뉴 조회
  async findAllMenus(): Promise<Menu[]> {
    const { data: menus, error } = await this.supabase
      .from('menu')
      .select(
        `
        *,
        store:store_id(store_name),
        category:category_id(category_name)
      `,
      )
      .eq('is_available', true)
      .order('store_id', { ascending: true })
      .order('category_id', { ascending: true })
      .order('menu_name', { ascending: true });

    if (error) {
      throw new Error(`메뉴 목록 조회 실패: ${error.message}`);
    }

    return menus || [];
  }

  // 메뉴 정보 수정
  async updateMenu(
    menuId: number,
    updateMenuDto: UpdateMenuDto,
  ): Promise<Menu> {
    // 카테고리 존재 확인 (변경하는 경우)
    if (updateMenuDto.category_id) {
      await this.findCategoryById(updateMenuDto.category_id);
    }

    const { data: menu, error } = await this.supabase
      .from('menu')
      .update(updateMenuDto)
      .eq('menu_id', menuId)
      .select()
      .single();

    if (error) {
      throw new Error(`메뉴 정보 수정 실패: ${error.message}`);
    }

    if (!menu) {
      throw new NotFoundException('메뉴를 찾을 수 없습니다.');
    }

    return menu;
  }

  // 메뉴 삭제 (소프트 삭제)
  async deleteMenu(menuId: number): Promise<void> {
    const { error } = await this.supabase
      .from('menu')
      .update({ is_available: false })
      .eq('menu_id', menuId);

    if (error) {
      throw new Error(`메뉴 삭제 실패: ${error.message}`);
    }
  }

  // 메뉴 검색 (이름으로)
  async searchMenusByName(menuName: string): Promise<Menu[]> {
    const { data: menus, error } = await this.supabase
      .from('menu')
      .select(
        `
        *,
        store:store_id(store_name),
        category:category_id(category_name)
      `,
      )
      .ilike('menu_name', `%${menuName}%`)
      .eq('is_available', true)
      .order('menu_name');

    if (error) {
      throw new Error(`메뉴 검색 실패: ${error.message}`);
    }

    return menus || [];
  }

  // 가격 범위로 메뉴 검색
  async findMenusByPriceRange(
    minPrice: number,
    maxPrice: number,
  ): Promise<Menu[]> {
    const { data: menus, error } = await this.supabase
      .from('menu')
      .select(
        `
        *,
        store:store_id(store_name),
        category:category_id(category_name)
      `,
      )
      .gte('price', minPrice)
      .lte('price', maxPrice)
      .eq('is_available', true)
      .order('price');

    if (error) {
      throw new Error(`가격 범위 메뉴 검색 실패: ${error.message}`);
    }

    return menus || [];
  }
}
