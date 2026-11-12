import { RegisterFormData } from "@/features/auth/schemas/auth.schema";


export interface LoginRequest {
  email: string;
  password: string;
  rememberMe: boolean;
}

export type RegisterPayload = Pick<
  RegisterFormData,
  "firstName" | "lastName" | "email" | "password" | "role"
>;

export interface RegisterResponse {
  success: boolean;
  message: string;
  data: {
    id: string;
    email: string;
    role: RegisterFormData["role"];
  };
}