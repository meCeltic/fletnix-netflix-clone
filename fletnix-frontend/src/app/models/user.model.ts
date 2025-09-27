export interface User {
    id: string;
    email: string;
    age: number;
    createdAt?: string;
    updatedAt?: string;
  }
  
  export interface AuthRequest {
    email: string;
    password: string;
  }
  
  export interface RegisterRequest extends AuthRequest {
    age: number;
  }
  
  export interface AuthResponse {
    message: string;
    token: string;
    user: User;
  }
  