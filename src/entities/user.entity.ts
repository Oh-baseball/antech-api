export interface User {
  user_id: number; // INTEGER IDENTITY
  company_id?: string; // VARCHAR(10) - 회사 ID 추가
  password: string;
  name: string;
  pw_number?: string; // VARCHAR(20)
  pw_pattern?: string; // VARCHAR(20)
  created_at?: Date;
  updated_at?: Date;
}

export interface CreateUserDto {
  company_id?: string;
  password: string;
  name: string;
  pw_number?: string;
  pw_pattern?: string;
}

export interface UpdateUserDto {
  company_id?: string;
  password?: string;
  name?: string;
  pw_number?: string;
  pw_pattern?: string;
}
