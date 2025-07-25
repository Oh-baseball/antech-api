// 간편 결제 시스템 - 매장, 주문, 메뉴 관련 엔티티

import {
  PaymentType,
  PaymentStatus,
  PointTransactionType,
} from './user.entity';

// PaymentType, PaymentStatus, PointTransactionType을 다시 export
export {
  PaymentType,
  PaymentStatus,
  PointTransactionType,
} from './user.entity';

/* -------------------------------------------------------------
   매장 및 메뉴 관련 엔티티
------------------------------------------------------------- */

// 매장 정보
export interface Store {
  store_id: number; // INTEGER IDENTITY
  store_name: string; // VARCHAR(100)
  address: string; // TEXT
  phone?: string; // VARCHAR(20)
  business_number?: string; // VARCHAR(20)
  point_rate: number; // DECIMAL(3,2) DEFAULT 1.0 - 포인트 적립률 (%)
  logo_url?: string; // TEXT
  is_active: boolean; // BOOLEAN DEFAULT true
  created_at: Date; // TIMESTAMP
}

// 카테고리 정보
export interface Category {
  category_id: number; // INTEGER IDENTITY
  category_name: string; // VARCHAR(50) UNIQUE
  description?: string; // TEXT
  is_active: boolean; // BOOLEAN DEFAULT true
}

// 메뉴 정보
export interface Menu {
  menu_id: number; // INTEGER IDENTITY
  store_id: number; // INTEGER FK
  category_id?: number; // INTEGER FK
  menu_name: string; // VARCHAR(100)
  description?: string; // TEXT
  price: number; // INTEGER CHECK (price >= 0)
  image_url?: string; // TEXT
  is_available: boolean; // BOOLEAN DEFAULT true
  created_at: Date; // TIMESTAMP
}

/* -------------------------------------------------------------
   주문 관련 엔티티
------------------------------------------------------------- */

// 주문 정보
export interface Order {
  order_id: string; // VARCHAR(20) PK - 주문번호 (예: ORD20250125001)
  user_id: number; // INTEGER FK
  store_id: number; // INTEGER FK
  total_amount: number; // INTEGER CHECK (total_amount >= 0)
  discount_amount: number; // INTEGER DEFAULT 0
  point_used: number; // INTEGER DEFAULT 0
  final_amount: number; // INTEGER CHECK (final_amount >= 0)
  order_status: string; // VARCHAR(20) DEFAULT 'PENDING'
  created_at: Date; // TIMESTAMP
}

// 주문 상품 정보
export interface OrderItem {
  item_id: number; // INTEGER IDENTITY
  order_id: string; // VARCHAR(20) FK
  menu_id: number; // INTEGER FK
  quantity: number; // INTEGER CHECK (quantity > 0)
  unit_price: number; // INTEGER CHECK (unit_price >= 0)
  total_price: number; // INTEGER CHECK (total_price >= 0)
}

/* -------------------------------------------------------------
   결제 및 포인트 내역 관련 엔티티
------------------------------------------------------------- */

// 결제 내역
export interface PaymentHistory {
  payment_id: string; // VARCHAR(30) PK - 결제 고유 ID
  order_id: string; // VARCHAR(20) FK
  user_id: number; // INTEGER FK
  method_id?: number; // INTEGER FK (nullable for point payments)

  payment_amount: number; // INTEGER CHECK (payment_amount >= 0)
  point_used: number; // INTEGER DEFAULT 0
  point_earned: number; // INTEGER DEFAULT 0

  payment_status: PaymentStatus; // payment_status ENUM
  payment_method: PaymentType; // payment_type ENUM

  // 외부 결제 시스템 연동 정보
  external_transaction_id?: string; // TEXT - 외부 결제사 거래 ID

  paid_at?: Date; // TIMESTAMP
  created_at: Date; // TIMESTAMP
  updated_at: Date; // TIMESTAMP
}

// 포인트 내역
export interface PointHistory {
  point_id: number; // INTEGER IDENTITY
  user_id: number; // INTEGER FK
  payment_id?: string; // VARCHAR(30) FK (nullable)

  transaction_type: PointTransactionType; // point_transaction_type ENUM
  amount: number; // INTEGER - 양수: 적립, 음수: 사용/소멸
  balance_after: number; // INTEGER CHECK (balance_after >= 0)

  description?: string; // TEXT
  expired_at?: Date; // TIMESTAMP - 포인트 만료일 (적립 시에만)
  created_at: Date; // TIMESTAMP
}

/* -------------------------------------------------------------
   DTO 인터페이스
------------------------------------------------------------- */

export interface CreateStoreDto {
  store_name: string;
  address: string;
  phone?: string;
  business_number?: string;
  point_rate?: number;
  logo_url?: string;
}

export interface UpdateStoreDto {
  store_name?: string;
  address?: string;
  phone?: string;
  business_number?: string;
  point_rate?: number;
  logo_url?: string;
  is_active?: boolean;
}

export interface CreateCategoryDto {
  category_name: string;
  description?: string;
}

export interface UpdateCategoryDto {
  category_name?: string;
  description?: string;
  is_active?: boolean;
}

export interface CreateMenuDto {
  store_id: number;
  category_id?: number;
  menu_name: string;
  description?: string;
  price: number;
  image_url?: string;
}

export interface UpdateMenuDto {
  category_id?: number;
  menu_name?: string;
  description?: string;
  price?: number;
  image_url?: string;
  is_available?: boolean;
}

export interface CreateOrderDto {
  user_id: number;
  store_id: number;
  items: OrderItemDto[];
  point_used?: number;
}

export interface OrderItemDto {
  menu_id: number;
  quantity: number;
}

export interface CreatePaymentDto {
  order_id: string;
  user_id: number;
  method_id?: number;
  payment_method: PaymentType;
  payment_amount: number;
  point_used?: number;
}

export interface OrderSummaryDto {
  order_id: string;
  total_amount: number;
  discount_amount: number;
  point_used: number;
  final_amount: number;
  order_status: string;
  created_at: Date;
  items: Array<{
    menu_id: number;
    menu_name: string;
    quantity: number;
    unit_price: number;
    total_price: number;
  }>;
}

export interface PaymentResultDto {
  payment_id: string;
  payment_status: PaymentStatus;
  payment_amount: number;
  point_used: number;
  point_earned: number;
  external_transaction_id?: string;
  paid_at?: Date;
}
