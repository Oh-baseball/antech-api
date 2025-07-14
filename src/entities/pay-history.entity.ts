export interface PayHistory {
  pay_id: string; // VARCHAR(8)
  user_id: number; // INTEGER (users 테이블 참조)
  store_id: number; // INTEGER (store 테이블 참조)
  method_id: string; // VARCHAR(10) (payment_method 테이블 참조)
  time: Date;
  amount: number;
  created_at?: Date;
  updated_at?: Date;
}

export interface CreatePayHistoryDto {
  user_id: number;
  store_id: number;
  method_id: string;
  amount: number;
}

export interface PayHistoryWithDetails extends PayHistory {
  user_name?: string;
  store_name?: string;
  method_type?: string;
  method_name?: string;
}
