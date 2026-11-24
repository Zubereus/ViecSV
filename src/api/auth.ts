import { apiRequest } from "./client";
import type {
  AuthResponse,
  LoginInput,
  PublicUser,
  RegisterEmployerInput,
  RegisterStudentInput,
} from "../../shared/types";

/** Đăng nhập bằng email và mật khẩu, trả về token và thông tin người dùng. */
export async function login(payload: LoginInput): Promise<AuthResponse> {
  return apiRequest<AuthResponse>("/api/auth/login", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

/** Đăng ký tài khoản sinh viên mới. */
export async function registerStudent(payload: RegisterStudentInput): Promise<AuthResponse> {
  return apiRequest<AuthResponse>("/api/auth/register/student", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

/** Đăng ký tài khoản nhà tuyển dụng mới. */
export async function registerEmployer(payload: RegisterEmployerInput): Promise<AuthResponse> {
  return apiRequest<AuthResponse>("/api/auth/register/employer", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

/** Lấy thông tin người dùng hiện tại từ token đang lưu. */
export async function fetchMe(): Promise<{ ok: boolean; user: PublicUser }> {
  return apiRequest<{ ok: boolean; user: PublicUser }>("/api/auth/me");
}
