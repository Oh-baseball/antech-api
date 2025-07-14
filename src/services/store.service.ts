import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseConfig } from '../config/database.config';
import {
  Store,
  CreateStoreDto,
  UpdateStoreDto,
  Menu,
  Category,
} from '../entities/store.entity';

@Injectable()
export class StoreService {
  constructor(private databaseConfig: DatabaseConfig) {}

  private get supabase() {
    return this.databaseConfig.getClient();
  }

  // 매장 관리
  async createStore(createStoreDto: CreateStoreDto): Promise<Store> {
    const { data, error } = await this.supabase
      .from('store')
      .insert([createStoreDto])
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to create store: ${error.message}`);
    }

    return data;
  }

  async findAllStores(): Promise<Store[]> {
    const { data, error } = await this.supabase
      .from('store')
      .select('*')
      .order('name');

    if (error) {
      throw new Error(`Failed to fetch stores: ${error.message}`);
    }

    return data || [];
  }

  async findStoreById(storeId: number): Promise<Store> {
    // string -> number
    const { data, error } = await this.supabase
      .from('store')
      .select('*')
      .eq('store_id', storeId)
      .single();

    if (error || !data) {
      throw new NotFoundException('Store not found');
    }

    return data;
  }

  async updateStore(
    storeId: number, // string -> number
    updateStoreDto: UpdateStoreDto,
  ): Promise<Store> {
    const { data, error } = await this.supabase
      .from('store')
      .update(updateStoreDto)
      .eq('store_id', storeId)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to update store: ${error.message}`);
    }

    if (!data) {
      throw new NotFoundException('Store not found');
    }

    return data;
  }

  async deleteStore(storeId: number): Promise<void> {
    // string -> number
    const { error } = await this.supabase
      .from('store')
      .delete()
      .eq('store_id', storeId);

    if (error) {
      throw new Error(`Failed to delete store: ${error.message}`);
    }
  }

  // 메뉴 관리
  async getStoreMenus(storeId: number): Promise<Menu[]> {
    // string -> number
    const { data, error } = await this.supabase
      .from('menu')
      .select(
        `
        *,
        category:category_id (name)
      `,
      )
      .eq('store_id', storeId)
      .order('category_id')
      .order('name');

    if (error) {
      throw new Error(`Failed to fetch store menus: ${error.message}`);
    }

    return data || [];
  }

  async getMenusByCategory(
    storeId: number, // string -> number
    categoryId: string,
  ): Promise<Menu[]> {
    const { data, error } = await this.supabase
      .from('menu')
      .select('*')
      .eq('store_id', storeId)
      .eq('category_id', categoryId)
      .order('name');

    if (error) {
      throw new Error(`Failed to fetch menus by category: ${error.message}`);
    }

    return data || [];
  }

  // 특정 메뉴 조회
  async getMenuById(menuId: string): Promise<Menu> {
    const { data, error } = await this.supabase
      .from('menu')
      .select(
        `
        *,
        store:store_id (name, address),
        category:category_id (name)
      `,
      )
      .eq('menu_id', menuId)
      .single();

    if (error || !data) {
      throw new NotFoundException('Menu not found');
    }

    return data;
  }

  // 카테고리 관리
  async getAllCategories(): Promise<Category[]> {
    const { data, error } = await this.supabase
      .from('category')
      .select('*')
      .order('name');

    if (error) {
      throw new Error(`Failed to fetch categories: ${error.message}`);
    }

    return data || [];
  }

  async createCategory(categoryId: string, name: string): Promise<Category> {
    const { data, error } = await this.supabase
      .from('category')
      .insert([{ category_id: categoryId, name }])
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to create category: ${error.message}`);
    }

    return data;
  }

  async getCategoryById(categoryId: string): Promise<Category> {
    const { data, error } = await this.supabase
      .from('category')
      .select('*')
      .eq('category_id', categoryId)
      .single();

    if (error || !data) {
      throw new NotFoundException('Category not found');
    }

    return data;
  }

  // 검색
  async searchStores(keyword: string): Promise<Store[]> {
    const { data, error } = await this.supabase
      .from('store')
      .select('*')
      .or(`name.ilike.%${keyword}%,address.ilike.%${keyword}%`)
      .order('name');

    if (error) {
      throw new Error(`Failed to search stores: ${error.message}`);
    }

    return data || [];
  }

  // 매장 통계
  async getStoreStats(storeId: number) {
    const { data: menuCount, error: menuError } = await this.supabase
      .from('menu')
      .select('menu_id', { count: 'exact' })
      .eq('store_id', storeId);

    const { data: paymentCount, error: paymentError } = await this.supabase
      .from('pay_history')
      .select('pay_id', { count: 'exact' })
      .eq('store_id', storeId);

    if (menuError || paymentError) {
      throw new Error('Failed to fetch store statistics');
    }

    return {
      menuCount: menuCount?.length || 0,
      paymentCount: paymentCount?.length || 0,
    };
  }
}
