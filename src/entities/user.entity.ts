export interface User {
  user_id: number; // INTEGER IDENTITY
  password: string;
  name: string;
  pw_number?: string; // VARCHAR(20)
  pw_pattern?: string; // VARCHAR(20)
  created_at?: Date;
  updated_at?: Date;
}

export interface CreateUserDto {
  password: string;
  name: string;
  pw_number?: string;
  pw_pattern?: string;
}

export interface UpdateUserDto {
  password?: string;
  name?: string;
  pw_number?: string;
  pw_pattern?: string;
}
