export interface Store {
  store_id: number; // INTEGER IDENTITY
  name: string;
  address: string;
  image?: string;
  created_at?: Date;
  updated_at?: Date;
}

export interface CreateStoreDto {
  name: string;
  address: string;
  image?: string;
}

export interface UpdateStoreDto {
  name?: string;
  address?: string;
  image?: string;
}

export interface Category {
  category_id: string; // VARCHAR(8)
  name: string;
  created_at?: Date;
  updated_at?: Date;
}

export interface Menu {
  menu_id: string; // VARCHAR(8)
  store_id: number;
  category_id: string;
  name: string;
  content?: string;
  price: number;
  image?: string;
  created_at?: Date;
  updated_at?: Date;
}

// 새로운 엔티티들 추가
export interface Company {
  company_id: string; // VARCHAR(10)
  point: number;
}

export interface Logo {
  logo_id: string; // VARCHAR(8)
  image: string;
}

export interface PaymentMethod {
  method_id: string; // VARCHAR(10)
  logo_id: string;
  type: 'CARD' | 'BANK' | 'MOBILE';
  name: string;
}

export interface Account {
  account_id: string; // VARCHAR(10)
  user_id: number;
  company_id?: string;
  number: string;
  logo_id?: string;
}

export interface Card {
  card_id: string; // VARCHAR(10)
  user_id: number;
  company_id?: string;
  number: string;
}

export interface Toss {
  toss_id: number; // BIGSERIAL
  user_id: number;
  company_id: string;
  toss_amount: number;
}
