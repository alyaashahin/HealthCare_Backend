export interface RegisterDto {
  name: string;
  email: string;
  password: string;
}

export interface RegisterResponseDto {
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
    createdAt: Date;
  };
  token: string;
}
